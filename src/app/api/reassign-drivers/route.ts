// app/api/reassign-drivers/route.ts
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/client";
import { assignDriverToBooking } from "../../../../utils/functions/assignDriverToBooking";

const supabase = createClient();

export async function POST(request: Request) {
  try {
    const thresholdDate = new Date(Date.now() - 45 * 1000).toISOString();

    const { data: pendingBookings, error } = await supabase
      .from("booking_assigned_drivers")
      .select("*")
      .eq("status", "pending")
      .lt("pending_at", thresholdDate);
// console.log("Pending bookings:", pendingBookings);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pendingBookings || pendingBookings.length === 0) {
      return NextResponse.json(
        { message: "No pending bookings older than 45 seconds." },
        { status: 200 }
      );
    }

    const bookingIds = pendingBookings.map((b) => b.booking_id);
    console.log("Booking IDs to update:", bookingIds);

    const {data:rejectdata, error: updateError } = await supabase
      .from("booking_assigned_drivers")
      .update({ status: "rejected" })
      .in("booking_id", bookingIds);
// console.log(rejectdata);
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Call assignDriverToBooking for each rejected booking
    for (const booking of pendingBookings) {
      try {
        // Fetch pickup location from booking_location table
        const { data: location, error: locationError } = await supabase
          .from("booking_locations")
          .select("customer_latitude, customer_longitude")
          .eq("booking_id", booking.booking_id)
          .single();

        if (locationError) {
          console.error(`Error fetching location for booking ${booking.id}:`, locationError.message);
          continue;
        }

        const { customer_latitude, customer_longitude } = location;
        console.log(customer_latitude, customer_longitude);
        const assignResult = await assignDriverToBooking(
          booking.booking_id,
          parseFloat(customer_latitude),
          parseFloat(customer_longitude)
        );

        if (assignResult.error) {
          console.warn(
            `Driver assignment failed for booking ${booking.id}:`,
            assignResult.message || assignResult.error
          );
        } else {
          console.log(`Driver assigned successfully for booking ${booking.id}`, assignResult);
        }
      } catch (assignError) {
        console.error(`Error calling assignDriverToBooking for booking ${booking.id}:`, assignError);
      }
    }

    return NextResponse.json(
      {
        message: "Pending bookings rejected and reassignment triggered.",
        count: bookingIds.length,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}
