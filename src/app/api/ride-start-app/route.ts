import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const { booking_id, driver_id } = await req.json();

    if (!booking_id || !driver_id) {
      return NextResponse.json({ error: "Booking ID and Driver ID are required" }, { status: 400 });
    }

   
    const { error: updateAssignedError } = await supabase
      .from("booking_assigned_drivers")
      .update({
        status: "active",
        active_at: new Date().toISOString(),
      })
      .eq("booking_id", booking_id)
      .eq("driver_id", driver_id);

    if (updateAssignedError) throw updateAssignedError;

    
    const { error: updateBookingError } = await supabase
      .from("bookings")
      .update({
        status: "active",
        // ride_started_at: new Date().toISOString(),
      })
      .eq("booking_id", booking_id);

    if (updateBookingError) throw updateBookingError;
    const { data: locationData, error: locationError } = await supabase
    .from("booking_locations")
    .select("customer_latitude, customer_longitude, dropoff_lat, dropoff_lng")
    .eq("booking_id", booking_id)
    .single();

  if (locationError || !locationData) {
    return NextResponse.json({
      message: "Ride started, but location info not found",
      ride_status: "ride_started",
      location: null,
    }, { status: 200 });
  }

  return NextResponse.json({
    message: "Ride started successfully",
    status: "active",
    location: locationData,
  }, { status: 200 });

}  catch (error) {
    console.error("Error starting ride:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
