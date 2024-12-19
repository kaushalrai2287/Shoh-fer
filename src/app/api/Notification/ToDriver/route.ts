import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

// Named export for POST method
export async function POST(req: Request) {
  const supabase = createClient();
  const { message, name, Driver, upload } = await req.json();  // Parsing JSON body from the request

  // Validate the received data
  if (!Driver || !Array.isArray(Driver) || Driver.length === 0) {
    return NextResponse.json(
      { error: "At least one Driver must be selected." },
      { status: 400 }
    );
  }

  if (!message || !name) {
    return NextResponse.json(
      { error: "Title and Message are required." },
      { status: 400 }
    );
  }

  try {
    // Prepare the notification data
    const notifications = Driver.map((center: { value: string }) => ({
      recipient_type: "Driver",  // Hardcoded
      recipient_id: center.value,        // Center ID
      type: "alert",                     // Hardcoded (You can add logic to make this dynamic)
      message: message,                  // Message from the form
      title: name,   
                          // Title from the form
    }));
    // console.log(notifications)
    // Batch Insert Notifications into Supabase
    const { error } = await supabase
      .from("admin_notifications")
      .insert(notifications);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Notifications sent successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}