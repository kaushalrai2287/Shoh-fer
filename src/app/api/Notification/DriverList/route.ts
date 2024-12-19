// import { createClient } from "../../../../../utils/supabase/server";
import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  try {
    // 1. Fetch notifications for drivers
    const { data: notifications, error: notificationError } = await supabase
      .from("admin_notifications")
      .select(`
        notification_id, 
        title, 
        message, 
        recipient_id
      `)
      .eq("recipient_type", "Driver");
    //   console.log(notifications);

    if (notificationError) {
      return NextResponse.json({ error: notificationError.message }, { status: 500 });
    }


    const recipientIds = notifications.map((notification) => notification.recipient_id);
    const { data: drivers, error: driverError } = await supabase
      .from("drivers")
      .select("driver_id, driver_name")
      .in("driver_id", recipientIds); 

    if (driverError) {
      return NextResponse.json({ error: driverError.message }, { status: 500 });
    }

    // 3. Merge notifications with driver names
    const data = notifications.map((notification) => {
      const driver = drivers.find((driver) => driver.driver_id === notification.recipient_id);
      return {
        ...notification,
        driver_name: driver ? driver.driver_name : null,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
