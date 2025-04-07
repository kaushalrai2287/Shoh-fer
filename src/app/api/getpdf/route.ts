import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function GET() {
    const { data, error } = await supabase.from("pdf_list").select("*");

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "success", data });
}
