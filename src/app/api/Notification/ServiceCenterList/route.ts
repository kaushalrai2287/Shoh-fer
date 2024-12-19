import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  try {
    // Fetch notifications where recipient_type is 'Driver'
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("notification_id, recipient_id, title, message")
      .eq("recipient_type", "Service Center");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
