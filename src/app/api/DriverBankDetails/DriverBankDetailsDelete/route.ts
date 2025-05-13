import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/client";

const supabase = createClient();

export async function POST(req: Request) {
    try {
        const { driver_id } = await req.json();

        // Validate input
        if (!Number.isInteger(driver_id)) {
            return NextResponse.json(
                { status: "error", message: "Driver ID is required and must be an integer." },
                { status: 400 }
            );
        }

        // Soft delete by setting is_delete = true
        const { data, error } = await supabase
            .from("driver_bank_details")
            .update({ is_delete: true })
            .eq("driver_id", driver_id);

        if (error) {
            return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: "success",
            message: "Bank details soft deleted successfully",
            // data,
        });
    } catch (error:any) {
        return NextResponse.json({  status: "error", message: error.message }, { status: 400 });
    }
}
