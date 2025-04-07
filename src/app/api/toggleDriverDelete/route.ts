import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function POST(req:Request) {
    try {
        const { driver_id, is_delete } = await req.json();

        // Validate input
        if (!Number.isInteger(driver_id)) {
            return NextResponse.json(
                { status: "error", message: "Invalid driver_id. Must be an integer." },
                { status: 400 }
            );
        }
        if (typeof is_delete !== "boolean") {
            return NextResponse.json(
                { status: "error", message: "Invalid is_delete value. Must be true or false." },
                { status: 400 }
            );
        }

        // Check if driver exists
        const { data: driver, error: driverError } = await supabase
            .from("drivers")
            .select("driver_id")
            .eq("driver_id", driver_id)
            .single();

        if (driverError || !driver) {
            return NextResponse.json({ status: "error", message: "Driver not found." }, { status: 404 });
        }

        
        const { data, error } = await supabase
            .from("drivers")
            .update({ is_delete })
            .eq("driver_id", driver_id);

        if (error) {
            return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: "success",
            message: `Driver is_delete status updated to ${is_delete}`,
            // data
        });
    } catch (error) {
        return NextResponse.json({ status: "error", message: "Invalid request" }, { status: 400 });
    }
}
