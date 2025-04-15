import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

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

    // Update booking status
    const { error: updateStatusError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', booking_id);

    if (updateStatusError) throw updateStatusError;

    if (status.toLowerCase() === 'rejected') {
      
      await supabase
        .from('booking_rejected_drivers')
        .insert([{ booking_id, driver_id }]);
    }

    if (status.toLowerCase() === 'accepted') {
      
      const { error: assignDriverError } = await supabase
        .from('bookings')
        .update({ driver_id })
        .eq('booking_id', booking_id);
      if (assignDriverError) throw assignDriverError;


      const { error: updateLocationError } = await supabase
        .from('driver_locations')
        .update({ booking_id })
        .eq('driver_id', driver_id);
      if (updateLocationError) throw updateLocationError;
    }

    return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}