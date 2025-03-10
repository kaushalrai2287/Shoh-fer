import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { email, otp, newPassword } = body;

        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: "Email, OTP, and new password required" }, { status: 400 });
        }

        // Check if OTP matches
        const { data, error } = await supabase
            .from("users")
            .select("otp, auth_id") // Fetch user ID for updating the password
            .eq("email", email)
            .single();

        if (error || !data || data.otp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // Update password using Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Clear OTP after successful password reset
        await supabase.from("users").update({ otp: null }).eq("email", email);

        return NextResponse.json({ message: "Password reset successful!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
