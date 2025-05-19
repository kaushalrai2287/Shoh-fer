// // pages/api/cancelBooking.js
// import { createClient } from "../../../../utils/supabase/client";
// const supabase = createClient();
// import { NextResponse } from "next/server";
// import { assignDriverToBooking } from "../../../../utils/functions/assignDriverToBooking";

// export async function POST(req:Request) {
//   try {
//     const body = await req.json();
//     const { booking_id, driver_id, cancelled_reasons } = body;

//     if (!booking_id || !driver_id || !cancelled_reasons) {
//       return NextResponse.json(
//         { status: '0', message: 'Missing booking_id, driver_id, or cancelled_reason' },
//         { status: 400 }
//       );
//     }

//     // Step 1: Update `booking_assigned_driver` to mark as cancelled
//     const { error: assignError } = await supabase
//       .from('booking_assigned_drivers')
//       .update({
//         cancelled_reasons,
//         status: 'cancelled'
//       })
//       .eq('booking_id', booking_id)
//       .eq('driver_id', driver_id);
//     // console.log('assignError', assignError);

//     if (assignError) {
//       return NextResponse.json(
//         { status: '0', message: 'Failed to update assigned driver', error: assignError.message },
//         { status: 500 }
//       );
//     }

//     // Step 2: Update `bookings` table
//     const { error: bookingError } = await supabase
//       .from('bookings')
//       .update({
//         status: 'pending',
//         driver_id: null
//       })
//       .eq('booking_id', booking_id);

//     if (bookingError) {
//       return NextResponse.json(
//         { status: '0', message: 'Failed to update booking', error: bookingError.message },
//         { status: 500 }
//       );
//     }
//  const assignResult = await assignDriverToBooking(
//           booking_id,
//           parseFloat(data.p_lat),
//           parseFloat(data.p_lng)
//         );

//         if (assignResult.error) {
//           console.warn(
//             "Driver status change failed:",
//             assignResult.message || assignResult.error
//           );
//         } else {
//           console.log("Driver status changed successfully:", assignResult);
//         }
//       } catch (assignError) {
//         console.error("Error calling assignDriver function:", assignError);
//       }
    

//     return NextResponse.json(
//       { status: '1', message: 'Booking cancelled successfully' },
//       { status: 200 }
//     );
//   } catch (error:any) {
//     return NextResponse.json(
//       { status: '0', message: 'Server error', error: error.message },
//       { status: 500 }
//     );
//   }
// }
// app/api/cancelBooking/route.js
import { createClient } from "../../../../utils/supabase/client";
import { NextResponse } from "next/server";
import { assignDriverToBooking } from "../../../../utils/functions/assignDriverToBooking";

const supabase = createClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id, driver_id, cancelled_reasons } = body;

    if (!booking_id || !driver_id || !cancelled_reasons) {
      return NextResponse.json(
        { status: '0', message: 'Missing booking_id, driver_id, or cancelled_reasons' },
        { status: 400 }
      );
    }

    // Step 1: Update `booking_assigned_drivers` to cancelled
    const { error: assignError } = await supabase
      .from('booking_assigned_drivers')
      .update({
        cancelled_reasons,
        status: 'cancelled',
      })
      .eq('booking_id', booking_id)
      .eq('driver_id', driver_id);

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
        driver_id: null,
      })
      .eq('booking_id', booking_id);

    if (bookingError) {
      return NextResponse.json(
        { status: '0', message: 'Failed to update booking', error: bookingError.message },
        { status: 500 }
      );
    }

    // Step 3: Get customer latitude and longitude for that booking
    const { data: bookingData, error: locationError } = await supabase
      .from('booking_locations')
      .select('customer_latitude, customer_longitude')
      .eq('booking_id', booking_id)
      .single();

      // console.log("Booking data:", bookingData);

    if (locationError || !bookingData) {
      return NextResponse.json(
        { status: '0', message: 'Failed to fetch booking location', error: locationError?.message },
        { status: 500 }
      );
    }

    // Step 4: Call assignDriverToBooking
    try {
      const assignResult = await assignDriverToBooking(
        booking_id,
        parseFloat(bookingData.customer_latitude),
        parseFloat(bookingData.customer_longitude)
      );

      if (assignResult?.error) {
        console.warn("Driver assignment failed:", assignResult.message || assignResult.error);
      } else {
        console.log("Driver reassigned successfully:", assignResult);
      }
    } catch (assignDriverError) {
      console.error("Error calling assignDriverToBooking:", assignDriverError);
    }

    return NextResponse.json(
      { status: '1', message: 'Booking cancelled and reassigned successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { status: '0', message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}
