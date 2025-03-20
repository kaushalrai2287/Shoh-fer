// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";

// export async function POST(req: Request) {
//   try {
//     const supabase = await createClient();
//     const body = await req.json();
//     const { driver_phone_no,reference_phone_number, otp } = body;

//     if (!reference_phone_number || !otp) {
//       return NextResponse.json(
//         { status: 0, message: "phone_number and OTP required" },
//         { status: 200 }
//       );
//     }

   
//     const { data, error } = await supabase
//       .from("drivers")
//       .select("reference_otp, is_verified")
//       .eq("phone_number", reference_phone_number)
//       .maybeSingle();

//     if (error || !data) {
//       return NextResponse.json(
//         { status: 0, message: "Invalid phone number" },
//         { status: 200 }
//       );
//     }

//     if (!data.is_verified) {
//       return NextResponse.json(
//         { status: 0, message: "Reference not verified user" },
//         { status: 200 }
//       );
//     }

 
//     if (data.reference_otp !== otp) {
//       return NextResponse.json(
//         { status: 0, message: "Invalid OTP" },
//         { status: 200 }
//       );
//     }

//     return NextResponse.json(
//       { status: 1, message: "OTP verified successfully!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { status: 0, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { driver_phone_no, reference_phone_number, otp } = await req.json();

    if (!driver_phone_no || !reference_phone_number || !otp) {
      return NextResponse.json(
        { status: 0, message: "All fields are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ✅ Check if combination of driver_phone_no and reference_phone_number exists
    const { data, error } = await supabase
      .from("driverAppRefrence")
      .select("id, reference_otp")
      .eq("driver_phone_no", driver_phone_no)
      .eq("reference_phone_number", reference_phone_number)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { status: 0, message: "Invalid reference details" },
        { status: 200 }
      );
    }

    // ✅ Check if OTP matches
    if (data.reference_otp !== otp) {
      return NextResponse.json(
        { status: 0, message: "Invalid OTP" },
        { status: 200 }
      );
    }

    // ✅ Update status to 'verified'
    const { error: updateError } = await supabase
      .from("driverAppRefrence")
      .update({
        is_verified: true, // Assuming there's an 'is_verified' column
      })
      .eq("id", data.id);

    if (updateError) {
      console.error("Error updating reference status:", updateError);
      return NextResponse.json(
        { status: 0, message: "Failed to verify reference" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { status: 1, message: "Reference verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { status: 0, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
