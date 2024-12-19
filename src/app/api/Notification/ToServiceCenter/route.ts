import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

// Named export for POST method
export async function POST(req: Request) {
  const supabase = createClient();
  const { message, name, service_centers, upload } = await req.json(); 


  if (!service_centers || !Array.isArray(service_centers) || service_centers.length === 0) {
    return NextResponse.json(
      { error: "At least one service center must be selected." },
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
    const notifications = service_centers.map((center: { value: string }) => ({
      recipient_type: "Service Center",  // Hardcoded
      recipient_id: center.value,        // Center ID
      type: "alert",                     // Hardcoded (You can add logic to make this dynamic)
      message: message,                  // Message from the form
      title: name,                       // Title from the form
    }));

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

// You can also add a named export for the GET method if you want to handle it (optional)
// export async function GET() {
//   return NextResponse.json({ message: "This is the GET endpoint" }, { status: 200 });
// }
