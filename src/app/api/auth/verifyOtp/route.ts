// import { NextResponse } from "next/server";
// import { createClient } from "../../../../../utils/supabase/server";
// export async function POST(req: Request) {
//     try {
//         const supabase = await createClient();
//         const body = await req.json();
//         const { email, otp } = body;

//         if (!email || !otp) {
//             return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
//         }

//         // Check if OTP matches
//         const { data, error } = await supabase
//             .from("users")
//             .select("otp")
//             .eq("email", email)
//             .single();
//             console.log(data);
//         if (error || !data || data.otp !== otp) {
            
//             return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
//         }

//         return NextResponse.json({ message: "OTP verified successfully!" }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { phone_number, otp } = body;

        if (!phone_number || !otp) {
            return NextResponse.json({ message: "phone_number and OTP required" }, { status: 200 });
        }

        // Check if OTP matches
        const { data, error } = await supabase
            .from("drivers")
            .select("otp")
            .eq("phone_number", phone_number)
            .single();

        if (error || !data || data.otp !== otp) {
            return NextResponse.json({ status: 0, message: "Invalid OTP" }, { status: 200 });
        }

        // ✅ If OTP matches, update `is_verified` to true
        const { error: updateError } = await supabase
            .from("drivers")
            .update({ is_verified: true })
            .eq("phone_number", phone_number);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        // ✅ Fetch user details after verification
        const { data: userData, error: userError } = await supabase
            .from("drivers")
            .select("*") // Fetch all user details
            .eq("phone_number", phone_number)
            .single();

        if (userError) {
            return NextResponse.json({ status: 0, message: "Failed to fetch user details" }, { status: 400 });
        }

        return NextResponse.json({
            status: 1,
            message: "OTP verified successfully!",
            user: userData // Return user details
        }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
