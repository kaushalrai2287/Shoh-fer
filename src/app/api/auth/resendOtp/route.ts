import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { phone_number, device_id, platform, dialcode, countrycode } = body;

        if (!phone_number) {
            return NextResponse.json({ message: "Mobile number required" }, { status: 200 });
        }

        if (!device_id) {
            return NextResponse.json({ message: "Device ID required" }, { status: 200 });
        }

        // Generate new OTP (for testing, use a fixed value)
        const otp = "1234"; // In production, use a random OTP generator

        // Check if the phone number exists
        const { data: existingDriver, error: fetchError } = await supabase
            .from("drivers")
            .select("driver_id")
            .eq("phone_number", phone_number)
            .single();

        if (fetchError) {
            return NextResponse.json({ error: fetchError.message }, { status: 400 });
        }

        if (!existingDriver) {
            return NextResponse.json({ status: 0, message: "Phone not registered! Go to registration page." }, { status: 200 });
        }

        // Update OTP and other details
        const { error: updateError } = await supabase
            .from("drivers")
            .update({ otp, device_id, platform, dialcode, countrycode })
            .eq("phone_number", phone_number);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json({ status: 1, message: "OTP resent successfully!", otp }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
