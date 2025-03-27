// // import { NextResponse } from "next/server";
// // import { createClient } from "../../../../../utils/supabase/server";


// // export async function POST(req:Request) {
// //     try {
// //         const supabase = await createClient();
// //         // console.log("Incoming request:", req);

// //         const body = await req.json();
// //         // console.log("Parsed body:", body);
        
// //         const { email, password } = body;

// //         if (!email || !password) {
// //             return NextResponse.json(
// //                 { error: "Email and password are required" },
// //                 { status: 400 }
// //             );
// //         }

// //         const { data, error } = await supabase.auth.signUp({ email, password });

// //         if (error) {
// //             return NextResponse.json({ error: error.message }, { status: 400 });
// //         }

// //         return NextResponse.json(
// //             { message: "Signup successful! Check your email.", user: data.user },
// //             { status: 200 }
// //         );
// //     } catch (error) {
// //         console.error("Signup error:", error);
// //         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
// //     }
// // }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";


// export async function POST(req:Request) {
//     try {
//         const supabase = await createClient();
//         // console.log("Incoming request:", req);

//         const body = await req.json();
//         // console.log("Parsed body:", body);
        
//         const { email, password } = body;

//         if (!email || !password) {
//             return NextResponse.json(
//                 { error: "Email and password are required" },
//                 { status: 400 }
//             );
//         }

//         const { data, error } = await supabase.auth.signUp({ email, password });

//         if (error) {
//             return NextResponse.json({ error: error.message }, { status: 400 });
//         }

//         return NextResponse.json(
//             { message: "Signup successful! Check your email.", user: data.user },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Signup error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";

// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();
//         const { phone_number,driver_name,
//             email ,
//             address,
//             dob ,
//             driving_license_no,
//             driving_license_image,
//             license_category,
//             experience_years ,
//             vehicle_type_experience,
//             language_spoken,
//             profile_photo_url,
//             driver_national_id_image,
//             Brand,
//             emergency_contact_no,
//             device_id ,
//             
//             countrycode,
//             dialcode,
//             platform,
//             transmission_type,
//             license_expiry_dates,  } = body;

//         if (!phone_number) {
//             return NextResponse.json({ error: "Mobile number required" }, { status: 400 });
//         }

//         const otp = "1234";     

 
//         const { data: existingDriver, error: fetchError } = await supabase
//             .from("drivers")
//             .select("driver_id")
//             .eq("phone_number", phone_number)
//             .single();

//         if (fetchError && fetchError.code !== "PGRST116") { 
//             // Ignore "PGRST116: no rows found" error
//             return NextResponse.json({ error: fetchError.message }, { status: 400 });
//         }

//         if (existingDriver) {
         
//             const { error: updateError } = await supabase
//                 .from("drivers")
//                 .update({ otp })
//                 .eq("phone_number", phone_number);

//             if (updateError) {
//                 return NextResponse.json({ error: updateError.message }, { status: 400 });
//             }
//         } else {
            
//             const { error: insertError } = await supabase
//                 .from("drivers")
//                 .insert([{ phone_number, otp,driver_name,
//                     email ,
//                     address,
//                     dob ,
//                     driving_license_no,
//                     driving_license_image,
//                     license_category,
//                     experience_years ,
//                     vehicle_type_experience,
//                     language_spoken,
//                     profile_photo_url,
//                     driver_national_id_image,
//                     Brand,
//                     emergency_contact_no,
//                     device_id ,
//                     
//                     countrycode,
//                     dialcode,
//                     platform,
//                     transmission_type,
//                     license_expiry_dates,}]);

//             if (insertError) {
//                 return NextResponse.json({ error: insertError.message }, { status: 400 });
//             }
//         }

//         return NextResponse.json({ message: "OTP sent successfully!", otp }, { status: 200 }); // Remove OTP in production
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";

// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();

//         const {
//             name,
//             phone_no,
//             email,
//             emergency_contact_no,
//             address,
//             driving_license_image,
//             driver_photo_proof,
//             driver_national_id_image,
//             years_of_experience,
//             type_of_vehicle_driven,
//             license_category
//         } = body;

//         const dial_code = "+91";
//         const country_code = "IN";

//         // ✅ Validate required fields
//         if (!name || !phone_no || !email || !emergency_contact_no || !address || !driving_license_image || !driver_photo_proof || !driver_national_id_image || !years_of_experience || !type_of_vehicle_driven || !license_category) {
//             return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//         }

//         // ✅ Check if driver already exists
//         const { data: existingDriver, error: fetchError } = await supabase
//             .from("drivers")
//             .select("driver_id")
//             .eq("phone_no", phone_no)
//             .single();

//         if (fetchError && fetchError.code !== "PGRST116") {
//             return NextResponse.json({ error: fetchError.message }, { status: 400 });
//         }

//         if (existingDriver) {
//             return NextResponse.json({ error: "Driver already exists" }, { status: 400 });
//         }

//         // ✅ Insert new driver record
//         const { data, error: insertError } = await supabase
//             .from("drivers")
//             .insert([
//                 {
//                     dial_code,
//                     country_code,
//                     driver_name,
//                     phone_number,
//                     email,
//                     emergency_contact_no,
//                     address,
//                     driving_license_image,
//                     profile_photo_url,
//                     driver_national_id_image,
//                     years_of_experience,
//                     vehicle_type_experience,
//                     license_category
//                 }
//             ])
//             .select();

//         if (insertError) {
//             return NextResponse.json({ error: insertError.message }, { status: 400 });
//         }

//         return NextResponse.json({ message: "Driver registered successfully", driver: data }, { status: 201 });
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";

// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();

//         const {
//             phone_number,
//             driver_name,
//             email,
//             address,
//             driving_license_no,
//             license_category,
//             experience_years,
//             vehicle_type_experience,
//             language_spoken,
//             profile_photo_url,
//             driver_national_id_image,
//             driving_license_image,
//             Brand,
//             emergency_contact_no,
//             device_id,
//             countrycode,
//             dialcode,
//             platform,
//             transmission_type,
//             license_expiry_dates
//         } = body;

//         // ✅ Validate required fields
//         const requiredFields = {
//             phone_number,
//             driver_name,
//             email,
//             address,
//             driving_license_no,
//             license_category,
//             experience_years,
//             vehicle_type_experience,
//             language_spoken,
//             profile_photo_url,
//             driver_national_id_image,
//             driving_license_image,
//             Brand,
//             emergency_contact_no,
//             device_id,
//             countrycode,
//             dialcode,
//             platform,
//             transmission_type,
//             license_expiry_dates
//         };

//         const missingFields = Object.entries(requiredFields)
//             .filter(([_, value]) => !value)
//             .map(([key]) => key);

//         if (missingFields.length > 0) {
//             return NextResponse.json(
//                 { message: `Missing required fields: ${missingFields.join(", ")}` },
//                 { status: 400 }
//             );
//         }

//         // ✅ Generate a random 4-digit OTP (for testing)
//         const otp = "1234"; 

//         // ✅ Check if phone number already exists
//         const { data: existingDriverByPhone, error: phoneCheckError } = await supabase
//             .from("drivers")
//             .select("driver_id")
//             .eq("phone_number", phone_number)
//             .single();

//         if (phoneCheckError && phoneCheckError.code !== "PGRST116") {
//             return NextResponse.json({ error: phoneCheckError.message }, { status: 400 });
//         }

//         if (existingDriverByPhone) {
//             return NextResponse.json({ status: 0, message: "Phone number is already registered" }, { status: 200 });
//         }

//         // ✅ Check if email already exists
//         const { data: existingDriverByEmail, error: emailCheckError } = await supabase
//             .from("drivers")
//             .select("driver_id")
//             .eq("email", email)
//             .single();

//         if (emailCheckError && emailCheckError.code !== "PGRST116") {
//             return NextResponse.json({ error: emailCheckError.message }, { status: 400 });
//         }

//         if (existingDriverByEmail) {
//             return NextResponse.json({ status: 0, message: "Email is already registered" }, { status: 200 });
//         }

//         // ✅ Insert new driver record
//         const { error: insertError } = await supabase
//             .from("drivers")
//             .insert([
//                 {
//                     phone_number,
//                     driver_name,
//                     email,
//                     address,
//                     driving_license_no,
//                     license_category,
//                     experience_years,
//                     vehicle_type_experience,
//                     language_spoken,
//                     profile_photo_url,
//                     driver_national_id_image,
//                     driving_license_image,
//                     Brand,
//                     emergency_contact_no,
//                     otp,
//                     device_id,
//                     countrycode,
//                     dialcode,
//                     platform,
//                     transmission_type,
//                     license_expiry_dates
//                 }
//             ]);

//         if (insertError) {
//             return NextResponse.json({ error: insertError.message }, { status: 400 });
//         }

//         return NextResponse.json({ status: 1, message: "OTP sent successfully!", otp }, { status: 200 }); // ⚠️ Remove OTP in production
//     } catch (error) {
//         console.error("Error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
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
    // ✅ Convert Next.js req to a readable stream with headers
    const reqStream = new Readable();
    const arrayBuffer = await req.arrayBuffer();
    reqStream.push(Buffer.from(arrayBuffer));
    reqStream.push(null);

    // ✅ Add headers to the Readable stream
    const headers = Object.fromEntries(req.headers.entries());
    const incomingReq = Object.assign(reqStream, {
      headers,
      method: req.method,
      url: req.url,
    }) as unknown as IncomingMessage;

    // ✅ Use multiparty to parse the form
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
  type   ,
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
      aadhar_card,        
      pan_card  ,
  type,  
  // refrel_code,   
  
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { status: 0, message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Check if phone_number or email already exists
    const supabase = await createClient();
    const { data: existingDrivers, error: checkError } = await supabase
      .from("drivers")
      .select("driver_id")
      .or(`phone_number.eq.${phone_number},email.eq.${email}`);

    if (checkError) {
      return NextResponse.json(
        { status: 0, error: checkError.message },
        { status: 400 }
      );
    }

    if (existingDrivers && existingDrivers.length > 0) {
      return NextResponse.json(
        { status: 0, message: "Phone number or email already exists" },
        { status: 200 }
      );
    }

    // ✅ Handle file uploads
    // let profilePhotoUrl = "";
    let driverNationalIdImage = "";
    let drivingLicenseImage = "";

    // if (files.profile_photo_url) {
    //   const file = files.profile_photo_url[0];
    //   const newPath = `/uploads/DriverProfilePhoto/${file.originalFilename}`;
    //   fs.renameSync(file.path, path.join("public", newPath));
    //   profilePhotoUrl = newPath;
    // }

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

    // ✅ Insert into the database
    const otp = "1234"; // Example OTP
    const { error: insertError } = await supabase.from("drivers").insert([
      {
        phone_number,
        driver_name,
        email,
        address,
        driving_license_no,
        license_category,
        experience_years,
        vehicle_type_experience,
        language_spoken,
        // profile_photo_url: profilePhotoUrl,
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
    pan_card ,
  type,  
  refrel_code ,
  refrence_no, 

      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { status: 0, error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        status: 1,
        message: "OTP sent successfully!",
        // profilePhotoUrl,
        // driverNationalIdImage,
        // drivingLicenseImage,
        otp,
      },
      { status: 200 }
    
    );
  } 
  // catch (error) {
  //   console.error("Error:", error);
  //   return NextResponse.json(
  //     { status: 0, error: "Internal Server Error" },
  //     { status: 500 }
  //   );
  // }
  catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { status: 0, error: errorMessage },
      { status: 500 }
    );
  }
}
