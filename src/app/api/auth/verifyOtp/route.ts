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
            return NextResponse.json({ error: "phone_number and OTP required" }, { status: 400 });
        }

        // Check if OTP matches
        const { data, error } = await supabase
            .from("drivers")
            .select("otp")
            .eq("phone_number", phone_number)
            .single();
            console.log(data);
        if (error || !data || data.otp !== otp) {
            
            return NextResponse.json({ status:0, message:"Invalid OTP" }, { status: 400 });
        }

        return NextResponse.json({ status:1, message: "OTP verified successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
