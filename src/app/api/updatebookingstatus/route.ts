import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';
import { assignDriverToBooking } from '../../../../utils/functions/assignDriverToBooking';

const supabase = createClient();

// export async function POST(req: NextRequest) {
//   try {
//     const { booking_id, status } = await req.json();

//     if (!booking_id || !status) {
//       return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
//     }

//     const { error } = await supabase
//       .from('bookings')
//       .update({ status })
//       .eq('booking_id', booking_id);

//     if (error) {
//       throw error;
//     }

//     return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating status:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
// export async function POST(req: NextRequest) {
//   try {
//     const { booking_id, status, driver_id } = await req.json();

//     if (!booking_id || !status || !driver_id) {
//       return NextResponse.json({ error: 'Booking ID, status, and driver ID are required' }, { status: 400 });
//     }

//     // Update booking status
//     const { error: updateError } = await supabase
//       .from('bookings')
//       .update({ status })
//       .eq('booking_id', booking_id);

//     if (updateError) throw updateError;

  
//     if (status.toLowerCase() === 'rejected') {
//       await supabase
//         .from('booking_rejected_drivers')
//         .insert([{ booking_id, driver_id }]);
//     }

//     return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error updating status:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
export async function POST(req: NextRequest) {
  try {
    const { booking_id, status, driver_id } = await req.json();

    if (!booking_id || !status || !driver_id) {
      return NextResponse.json({ error: 'Booking ID, status, and driver ID are required' }, { status: 400 });
    }

    const { error: updateStatusError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', booking_id);

    if (updateStatusError) throw updateStatusError;

    // if (status.toLowerCase() === 'rejected') {
      
    //   const { error: updateDriverStatusError } = await supabase
    //     .from('booking_assigned_drivers')
    //     .update({ status: 'rejected', rejected_at: new Date() })
    //     .eq('booking_id', booking_id)
    //     .eq('driver_id', driver_id);

    //   if (updateDriverStatusError) throw updateDriverStatusError;
    // }
    if (status.toLowerCase() === 'rejected') {
      const { error: updateDriverStatusError } = await supabase
        .from('booking_assigned_drivers')
        .update({ status: 'rejected', rejected_at: new Date() })
        .eq('booking_id', booking_id)
        .eq('driver_id', driver_id);
    
      if (updateDriverStatusError) throw updateDriverStatusError;
    
      const { data: locationData, error: locationError } = await supabase
        .from("booking_locations")
        .select("customer_latitude, customer_longitude")
        .eq("booking_id", booking_id)
        .maybeSingle();
    
      if (locationError) throw locationError;
    
      

      if (locationData) {
        try {
          // Call the assignDriverToBooking function instead of the fetch request
          const assignResult = await assignDriverToBooking(
            booking_id,
            locationData.customer_latitude,
            locationData.customer_longitude
          );
      
          if (assignResult.error) {
            console.warn("Driver status change failed:", assignResult.message || assignResult.error);
          } else {
            console.log("Driver status changed successfully:", assignResult);
          }
        } catch (assignError) {
          console.error("Error calling assignDriver function:", assignError);
        }
      }
      
    }
    
    
    if (status.toLowerCase() === 'active') {
      
      const { error: updateDriverStatusError } = await supabase
        .from('booking_assigned_drivers')
        .update({ status: 'active', active_at: new Date() })
        .eq('booking_id', booking_id)
        .eq('driver_id', driver_id);

      if (updateDriverStatusError) throw updateDriverStatusError;
    }
    if (status.toLowerCase() === 'completed') {
      
      const { error: updateDriverStatusError } = await supabase
        .from('booking_assigned_drivers')
        .update({ status: 'completed', completed_at: new Date() })
        .eq('booking_id', booking_id)
        .eq('driver_id', driver_id);

      if (updateDriverStatusError) throw updateDriverStatusError;
    }
    if (status.toLowerCase() === 'cancelled') {
      
      const { error: updateDriverStatusError } = await supabase
        .from('booking_assigned_drivers')
        .update({ status: 'cancelled', cancelled_at: new Date() })
        .eq('booking_id', booking_id)
        .eq('driver_id', driver_id);

      if (updateDriverStatusError) throw updateDriverStatusError;
    }

    if (status.toLowerCase() === 'accepted') {

      const { error: updateDriverStatusError } = await supabase
      .from('booking_assigned_drivers')
      .update({ status: 'accepted', accepted_at: new Date() })
      .eq('booking_id', booking_id)
      .eq('driver_id', driver_id);

      if (updateDriverStatusError) throw updateDriverStatusError;
      
      const { error: assignDriverError } = await supabase
        .from('bookings')
        .update({ driver_id })
        .eq('booking_id', booking_id);
      if (assignDriverError) throw assignDriverError;


      // const { error: updateLocationError } = await supabase
      //   .from('driver_locations')
      //   .update({ booking_id })
      //   .eq('driver_id', driver_id);
      // if (updateLocationError) throw updateLocationError;
    }

    return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
  } catch (error:any) {
    // console.error('Error updating status:', error.message);
    return NextResponse.json({ error:error.message }, { status: 500 });
  }
}