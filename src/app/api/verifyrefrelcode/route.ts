import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { referral_code } = await req.json();

    if (!referral_code) {
      return NextResponse.json(
        { status: 0, message: "Referral code is required" },
        { status: 400 }
      );
    }

    
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", referral_code)
      .single();
      

    // ✅ Handle invalid or missing referral code
    if (error || !data) {
      return NextResponse.json(
        { status: 0, message: "Invalid referral code" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { status: 1, message: "Referral code is valid" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying referral code:", error);
    return NextResponse.json(
      { status: 0, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
