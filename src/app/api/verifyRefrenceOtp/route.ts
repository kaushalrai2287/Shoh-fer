import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { reference_phone_number, otp } = body;

    if (!reference_phone_number || !otp) {
      return NextResponse.json(
        { status: 0, message: "phone_number and OTP required" },
        { status: 200 }
      );
    }

   
    const { data, error } = await supabase
      .from("drivers")
      .select("reference_otp, is_verified")
      .eq("phone_number", reference_phone_number)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { status: 0, message: "Invalid phone number" },
        { status: 200 }
      );
    }

    if (!data.is_verified) {
      return NextResponse.json(
        { status: 0, message: "Reference not verified user" },
        { status: 200 }
      );
    }

 
    if (data.reference_otp !== otp) {
      return NextResponse.json(
        { status: 0, message: "Invalid OTP" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 1, message: "OTP verified successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { status: 0, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
