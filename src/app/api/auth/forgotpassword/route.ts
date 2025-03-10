import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Set default OTP
        const defaultOTP = "1234";

        // Store OTP in the database (assuming you have a users table)
        const { data, error } = await supabase
            .from("users")
            .update({ otp: defaultOTP })
            .eq("email", email);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(
            { message: "OTP sent to email.", otp: defaultOTP }, // Remove otp from response in production
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
