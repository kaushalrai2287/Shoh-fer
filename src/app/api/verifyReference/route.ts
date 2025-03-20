// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";

// export async function POST(req: Request) {
//   try {
//     const {name, reference_phone_number,driver_phone_no } = await req.json();

//     if (!reference_phone_number) {
//       return NextResponse.json(
//         { status: 0, message: "Reference phone number is required" },
//         { status: 400 }
//       );
//     }


//     const supabase = await createClient();
//     const { data, error } = await supabase
//       .from("drivers")
//       .select("driver_id")
//       .eq("phone_number", reference_phone_number)
//       .maybeSingle();

//     if (error || !data) {
//       return NextResponse.json(
//         { status: 0, message: "Reference phone number not found" },
//         { status: 200 }
//       );
//     }

  
//     const otp = 1234; // 4-digit OTP


//     const { error: updateError } = await supabase
//       .from("drivers")
//       .update({ reference_otp: otp })
//       .eq("phone_number", reference_phone_number);

//     if (updateError) {
//       console.error("Error updating OTP:", updateError);
//       return NextResponse.json(
//         { status: 0, message: "Failed to save OTP" },
//         { status: 500 }
//       );
//     }

  

//     return NextResponse.json(
//       {
//         status: 1,
//         message: "OTP sent successfully",
//         otp,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error verifying reference:", error);
//     return NextResponse.json(
//       { status: 0, message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/client";

// export async function POST(req: Request) {
//   try {
//     const { name, reference_phone_number, driver_phone_no } = await req.json();

//     if (!reference_phone_number) {
//       return NextResponse.json(
//         { status: 0, message: "Reference phone number is required" },
//         { status: 400 }
//       );
//     }

//     const supabase = await createClient();

//     // Check if reference phone number exists in the drivers table and check if it's verified and name matches
//     const { data, error } = await supabase
//       .from("drivers")
//       .select("driver_id, driver_name")
//       .eq("phone_number", reference_phone_number)
//       .maybeSingle();

//     if (error || !data) {
//       return NextResponse.json(
//         { status: 0, message: "Reference phone number not found" },
//         { status: 200 }
//       );
//     }

//     // if (!data.is_verified) {
//     //   return NextResponse.json(
//     //     { status: 0, message: "Reference phone number not verified" },
//     //     { status: 200 }
//     //   );
//     // }

//     if (data.driver_name !== name) {
//       // console.log("Name does not match the reference phone number",data.driver_name,name);
//       return NextResponse.json(
//         { status: 0, message: "Name does not match the reference phone number" },
//         { status: 200 }
//       );
//     }

//     // Generate 4-digit OTP
//     const otp = 1234; // Random 4-digit OTP

//     // // Update OTP in drivers table
//     // const { error: updateError } = await supabase
//     //   .from("driverAppRefrence")
//     //   .update({ reference_otp: otp })
//     //   .eq("phone_number", reference_phone_number);

//     // if (updateError) {
//     //   console.error("Error updating OTP:", updateError);
//     //   return NextResponse.json(
//     //     { status: 0, message: "Failed to save OTP" },
//     //     { status: 500 }
//     //   );
//     // }

//     // ✅ Insert data into driverAppRefrence table after sending OTP
//     const { error: insertError } = await supabase
//       .from("driverAppRefrence")
//       .insert([
//         {
//           name,
//           driver_phone_no,
//           reference_phone_number, // ✅ Use reference_phone_number as reference_no
//           reference_otp: otp,
//         },
//       ]);

//     if (insertError) {
//       console.error("Error inserting reference data:", insertError);
//       return NextResponse.json(
//         { status: 0, message: "Failed to insert reference data" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         status: 1,
//         message: "OTP sent and reference data inserted successfully",
//         otp,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error processing request:", error);
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
    const { name, reference_phone_number, driver_phone_no } = await req.json();

    if (!reference_phone_number) {
      return NextResponse.json(
        { status: 0, message: "Reference phone number is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // ✅ Check if reference phone number exists in the drivers table and verify the name
    const { data, error } = await supabase
      .from("drivers")
      .select("driver_id, driver_name")
      .eq("phone_number", reference_phone_number)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { status: 0, message: "Reference phone number not found" },
        { status: 200 }
      );
    }

    if (data.driver_name !== name) {
      return NextResponse.json(
        { status: 0, message: "Name does not match the reference phone number" },
        { status: 200 }
      );
    }

  
    const otp = Math.floor(1000 + Math.random() * 9000); // Random 4-digit OTP

    
    const { data: existingCombination, error: existingCombinationError } = await supabase
      .from("driverAppRefrence")
      .select("id")
      .eq("reference_phone_number", reference_phone_number)
      .eq("driver_phone_no", driver_phone_no)
      .single();

    if (existingCombination) {
     
      const { error: updateError } = await supabase
        .from("driverAppRefrence")
        .update({
          reference_otp: otp,
        })
        .eq("id", existingCombination.id);

      if (updateError) {
        console.error("Error updating reference data:", updateError);
        return NextResponse.json(
          { status: 0, message: "Failed to update reference data" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          status: 1,
          message: "OTP sent and reference data updated successfully",
          otp,
        },
        { status: 200 }
      );
    }

    if (existingCombinationError && existingCombinationError.code !== "PGRST116") {
      console.error("Error checking existing combination:", existingCombinationError);
      return NextResponse.json(
        { status: 0, message: "Failed to check existing combination" },
        { status: 500 }
      );
    }

    // ✅ Insert new data if combination does not exist
    const { error: insertError } = await supabase
      .from("driverAppRefrence")
      .insert([
        {
          name,
          driver_phone_no,
          reference_phone_number,
          reference_otp: otp,
        },
      ]);

    if (insertError) {
      console.error("Error inserting reference data:", insertError);
      return NextResponse.json(
        { status: 0, message: "Failed to insert reference data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: 1,
        message: "OTP sent and reference data inserted successfully",
        otp,
      },
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
