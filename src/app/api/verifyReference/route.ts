import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { reference_phone_number } = await req.json();

    if (!reference_phone_number) {
      return NextResponse.json(
        { status: 0, message: "Reference phone number is required" },
        { status: 400 }
      );
    }


    const supabase = await createClient();
    const { data, error } = await supabase
      .from("drivers")
      .select("driver_id")
      .eq("phone_number", reference_phone_number)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        { status: 0, message: "Reference phone number not found" },
        { status: 200 }
      );
    }

  
    const otp = 1234; // 4-digit OTP


    const { error: updateError } = await supabase
      .from("drivers")
      .update({ reference_otp: otp })
      .eq("phone_number", reference_phone_number);

    if (updateError) {
      console.error("Error updating OTP:", updateError);
      return NextResponse.json(
        { status: 0, message: "Failed to save OTP" },
        { status: 500 }
      );
    }

  

    return NextResponse.json(
      {
        status: 1,
        message: "OTP sent successfully",
        otp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying reference:", error);
    return NextResponse.json(
      { status: 0, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
