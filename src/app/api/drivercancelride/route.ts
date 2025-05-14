// pages/api/cancelBooking.js
import { createClient } from "../../../../utils/supabase/client";
const supabase = createClient();
import { NextResponse } from "next/server";
import { assignDriverToBooking } from "../../../../utils/functions/assignDriverToBooking";

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { booking_id, driver_id, cancelled_reasons } = body;

    if (!booking_id || !driver_id || !cancelled_reasons) {
      return NextResponse.json(
        { status: '0', message: 'Missing booking_id, driver_id, or cancelled_reason' },
        { status: 400 }
      );
    }

    // Step 1: Update `booking_assigned_driver` to mark as cancelled
    const { error: assignError } = await supabase
      .from('booking_assigned_drivers')
      .update({
        cancelled_reasons,
        status: 'cancelled'
      })
      .eq('booking_id', booking_id)
      .eq('driver_id', driver_id);
    // console.log('assignError', assignError);

    if (assignError) {
      return NextResponse.json(
        { status: '0', message: 'Failed to update assigned driver', error: assignError.message },
        { status: 500 }
      );
    }

    // Step 2: Update `bookings` table
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({
        status: 'pending',
        driver_id: null
      })
      .eq('booking_id', booking_id);

    if (bookingError) {
      return NextResponse.json(
        { status: '0', message: 'Failed to update booking', error: bookingError.message },
        { status: 500 }
      );
    }

    

    return NextResponse.json(
      { status: '1', message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error:any) {
    return NextResponse.json(
      { status: '0', message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
