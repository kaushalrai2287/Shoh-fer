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
        recipient_id,
        doc_url
       
      `)
      .eq("recipient_type", "Service Center");
    //   console.log(notifications);

    if (notificationError) {
      return NextResponse.json({ error: notificationError.message }, { status: 500 });
    }


    const recipientIds = notifications.map((notification) => notification.recipient_id);
    const { data: servicecenter, error: centerError } = await supabase
      .from("service_centers")
      .select("service_center_id, name")
      .in("service_center_id", recipientIds); 

    if (centerError) {
      return NextResponse.json({ error: centerError.message }, { status: 500 });
    }

    // 3. Merge notifications with driver names
    const data = notifications.map((notification) => {
      const ServiceCenter = servicecenter.find((ServiceCenter) => ServiceCenter.service_center_id === notification.recipient_id);
      return {
        ...notification,
        servicecenter_name: ServiceCenter ? ServiceCenter.name : null,
      };
    });

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
