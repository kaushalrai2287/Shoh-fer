import { NextResponse } from "next/server";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import multiparty from "multiparty";
import { createClient } from "../../../../../utils/supabase/client";
import { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const reqStream = new Readable();
    const arrayBuffer = await req.arrayBuffer();
    reqStream.push(Buffer.from(arrayBuffer));
    reqStream.push(null);

    const headers = Object.fromEntries(req.headers.entries());
    const incomingReq = Object.assign(reqStream, {
      headers,
      method: req.method,
      url: req.url,
    }) as unknown as IncomingMessage;

    const form = new multiparty.Form({
      uploadDir: path.join(process.cwd(), "public/uploads/DriverDocs"),
      autoFiles: true,
    });

    const parseForm = () =>
      new Promise<{ fields: Record<string, any>; files: Record<string, any> }>(
        (resolve, reject) => {
          form.parse(incomingReq, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
          });
        }
      );

    const { fields, files } = await parseForm();

    // Handle segment_ids as a comma-separated string
    const segmentIds = fields['segment_ids'] ? 
      fields['segment_ids'][0].split(',').map((id: string) => id.trim()) : [];
    
    const {
      phone_number,
      driver_name,
      email,
      address,
      driving_license_no,
      license_category,
      experience_years,
      vehicle_type_experience,
      language_spoken,
      Brand,
      emergency_contact_no,
      device_id,
      countrycode,
      dialcode,
      platform,
      transmission_type,
      license_expiry_dates,
      aadhar_card,
      pan_card,
      type,
      refrel_code,
      refrence_no,
    } = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    const requiredFields = {
      phone_number,
      driver_name,
      email,
      address,
      driving_license_no,
      license_category,
      experience_years,
      vehicle_type_experience,
      language_spoken,
      Brand,
      emergency_contact_no,
      device_id,
      countrycode,
      dialcode,
      platform,
      transmission_type,
      license_expiry_dates,
      type,
      segment_ids: segmentIds.length > 0 ? segmentIds : null,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    // Custom check: At least one of aadhar_card or pan_card must be provided
    if (!aadhar_card && !pan_card) {
      missingFields.push("aadhar_card or pan_card (at least one required)");
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          status: 0,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email or phone already exists and is VERIFIED
    const { data: existingVerified, error: checkError } = await supabase
      .from("drivers")
      .select("driver_id")
      .or(`phone_number.eq.${phone_number},email.eq.${email}`)
      .eq("is_verified", true);

    if (checkError) {
      return NextResponse.json(
        { status: 0, error: checkError.message },
        { status: 400 }
      );
    }

    if (existingVerified && existingVerified.length > 0) {
      return NextResponse.json(
        { status: 0, message: "Phone number or email already exists" },
        { status: 200 }
      );
    }

    // Check for unverified user to update
    const { data: existingUnverified, error: unverifiedCheckError } =
      await supabase
        .from("drivers")
        .select("driver_id")
        .or(`phone_number.eq.${phone_number},email.eq.${email}`)
        .eq("is_verified", false)
        .maybeSingle();

    if (unverifiedCheckError) {
      return NextResponse.json(
        { status: 0, error: unverifiedCheckError.message },
        { status: 400 }
      );
    }

    let driverNationalIdImage = "";
    let drivingLicenseImage = "";

    if (files.driver_national_id_image) {
      const file = files.driver_national_id_image[0];
      const newPath = `/uploads/DriverDocs/${file.originalFilename}`;
      fs.renameSync(file.path, path.join("public", newPath));
      driverNationalIdImage = newPath;
    }

    if (files.driving_license_image) {
      const file = files.driving_license_image[0];
      const newPath = `/uploads/DriverLicence/${file.originalFilename}`;
      fs.renameSync(file.path, path.join("public", newPath));
      drivingLicenseImage = newPath;
    }

    const otp = "1234"; // Generate or send actual OTP here

    const driverData = {
      phone_number,
      driver_name,
      email,
      address,
      driving_license_no,
      license_category,
      experience_years,
      vehicle_type_experience,
      language_spoken,
      driver_national_id_image: driverNationalIdImage,
      driving_license_image: drivingLicenseImage,
      Brand,
      emergency_contact_no,
      device_id,
      countrycode,
      otp,
      dialcode,
      platform,
      transmission_type,
      license_expiry_dates,
      aadhar_card,
      pan_card,
      type,
      refrel_code,
      refrence_no,
      segment_ids: segmentIds,
    };

    if (existingUnverified) {
      // Update unverified record
      const { error: updateError } = await supabase
        .from("drivers")
        .update(driverData)
        .eq("driver_id", existingUnverified.driver_id);

      if (updateError) {
        return NextResponse.json(
          { status: 0, error: updateError.message },
          { status: 400 }
        );
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("drivers")
        .insert([driverData]);

      if (insertError) {
        return NextResponse.json(
          { status: 0, error: insertError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        status: 1,
        message: "OTP sent successfully!",
        otp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ status: 0, error: errorMessage }, { status: 500 });
  }
}

