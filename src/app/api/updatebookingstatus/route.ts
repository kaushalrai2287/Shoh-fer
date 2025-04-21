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
          // const response = await fetch("/api/DriverDocUpload/DriverPhotoProof", {
            const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/api/assignDriver`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              booking_id,
              customer_latitude: locationData.customer_latitude,
              customer_longitude: locationData.customer_longitude,
            }),
          });
    
          const assignResult = await response.json();
    
          if (response.ok && assignResult.status === 1) {
            console.log("Driver status changed successfully:", assignResult);
          } else {
            console.warn("Driver  status changed successfully::", assignResult.message || assignResult);
          }
        } catch (assignError) {
          console.error("Error calling assignDriver API:", assignError);
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


      const { error: updateLocationError } = await supabase
        .from('driver_locations')
        .update({ booking_id })
        .eq('driver_id', driver_id);
      if (updateLocationError) throw updateLocationError;
    }

    return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
  } catch (error:any) {
    // console.error('Error updating status:', error.message);
    return NextResponse.json({ error:error.message }, { status: 500 });
  }
}