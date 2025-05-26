// // pages/api/updateLocation.js
// import { createClient } from '../../../../utils/supabase/client';
// import { NextResponse } from 'next/server';

// // Initialize Supabase client
// const supabase = createClient();

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { driver_id, latitude, longitude } = body;

//     if (!driver_id || !latitude || !longitude) {

//       return NextResponse.json({ status: '0', message: 'Missing required fields' });
      
//     }

  
//     const { data: insertData, error: insertError } = await supabase
//       .from('driver_locations')
//       .insert([{ driver_id, latitude, longitude }]);

//     if (insertError) {
//       return NextResponse.json({ status: '0', message: insertError.message });
//     }

    
//     const { error: updateError } = await supabase
//       .from('drivers')
//       .update({ latitude, longitude })
//       .eq('driver_id', driver_id);

//     if (updateError) {
//       return NextResponse.json({ status: '0', message: updateError.message });
//     }

//     return NextResponse.json({ status: '1', message: 'Location updated successfully' });

//   } catch (err: any) {
//     return NextResponse.json({ status: '0', message: 'Server error', error: err.message });
//   }
// }
// import { createClient } from '../../../../utils/supabase/client';
// import { NextResponse } from 'next/server';

// const supabase = createClient();

// export async function POST(req: Request) {
//   try {
//     console.log('API called'); 

//     const body = await req.json();
//     const { driver_id, latitude, longitude } = body;

//     if (!driver_id || !latitude || !longitude) {
//       console.error('Missing required fields', body); 
//       return NextResponse.json({ status: '0', message: 'Missing required fields' });
//     }

   
//     const { data: existingList, error: fetchError } = await supabase
//       .from('driver_locations')
//       .select('id')
//       .eq('driver_id', driver_id)
//       .is('booking_id', null)
//       .limit(1);

//     if (fetchError) {
//       console.error('Fetch error:', fetchError); 
//       return NextResponse.json({ status: '0', message: fetchError.message });
//     }

//     const existing = existingList?.[0];

//     if (existing) {
  
//       const { error: updateLocError } = await supabase
//         .from('driver_locations')
//         .update({
//           latitude,
//           longitude,
//           updated_at: new Date().toISOString(),
//         })
//         .eq('id', existing.id);

//       if (updateLocError) {
//         console.error('Update location error:', updateLocError); // Log any update error
//         return NextResponse.json({ status: '0', message: updateLocError.message });
//       }
//     } else {
     
//       const { data: insertData, error: insertError } = await supabase
//         .from('driver_locations')
//         .insert([{ driver_id, latitude, longitude }]);

//       console.log('Insert Data:', insertData); 
//       console.error('Insert Error:', insertError);

//       if (insertError) {
//         return NextResponse.json({ status: '0', message: insertError.message });
//       }
//     }

//     const { error: updateDriverError } = await supabase
//       .from('drivers')
//       .update({ latitude, longitude })
//       .eq('driver_id', driver_id);

//     if (updateDriverError) {
//       console.error('Update driver error:', updateDriverError); 
//       return NextResponse.json({ status: '0', message: updateDriverError.message });
//     }

//     return NextResponse.json({ status: '1', message: 'Location updated successfully' });

//   } catch (err: any) {
//     console.error('Server error:', err); 
//     return NextResponse.json({ status: '0', message: 'Server error', error: err.message });
//   }
// }
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

interface DriverData {
  is_online: boolean;
  segment_ids: number[];
  latitude: number;
  longitude: number;
}

export async function POST(req: Request) {
  try {
    console.log('API called');

    const body = await req.json();
    const { driver_id, booking_id, latitude, longitude } = body;

    if (!driver_id || !latitude || !longitude) {
      console.error('Missing required fields', body);
      return NextResponse.json({ status: '0', message: 'Missing required fields' });
    }

    // Convert booking_id to number if it exists
    const numericBookingId = booking_id ? Number(booking_id) : null;

    // First check if driver exists and is online
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('is_online, segment_ids, latitude, longitude')
      .eq('driver_id', driver_id)
      .single();

    if (driverError) {
      console.error('Driver fetch error:', driverError);
      return NextResponse.json({ status: '0', message: 'Error fetching driver data' });
    }

    if (!driverData) {
      console.error('Driver not found:', driver_id);
      return NextResponse.json({ status: '0', message: 'Driver not found' });
    }

    const driver = driverData as DriverData;

    if (!driver.is_online) {
      console.error('Driver is offline:', driver_id);
      return NextResponse.json({ status: '0', message: 'Driver is offline' });
    }

    console.log('Driver data:', driver);

    // Check if location has changed significantly (more than 10 meters)
    const hasLocationChanged = calculateDistance(
      driver.latitude,
      driver.longitude,
      latitude,
      longitude
    ) > 0.01; // 10 meters in kilometers

    if (!hasLocationChanged) {
      console.log('Location unchanged, skipping update');
      return NextResponse.json({ status: '1', message: 'Location unchanged' });
    }

    // If there's a booking_id, check if we need to update previous entries
    if (numericBookingId) {
      // Update any recent null booking_id entries to this booking_id
      const { error: updateError } = await supabase
        .from('driver_locations')
        .update({ booking_id: numericBookingId })
        .eq('driver_id', driver_id)
        .is('booking_id', null)
        .gte('updated_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      if (updateError) {
        console.error('Update previous entries error:', updateError);
        return NextResponse.json({ status: '0', message: updateError.message });
      }
    }

    // Insert new location record
    const { data: insertData, error: insertError } = await supabase
      .from('driver_locations')
      .insert([{
        driver_id,
        latitude,
        longitude,
        booking_id: numericBookingId,
        updated_at: new Date().toISOString()
      }])
      .select();

    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json({ status: '0', message: insertError.message });
    }
    console.log('Inserted location data:', insertData);

    // Update the driver's current location in the drivers table
    const { data: updateDriverData, error: updateDriverError } = await supabase
      .from('drivers')
      .update({ 
        latitude, 
        longitude
      })
      .eq('driver_id', driver_id)
      .select();

    if (updateDriverError) {
      console.error('Update driver error:', updateDriverError);
      return NextResponse.json({ status: '0', message: updateDriverError.message });
    }
    console.log('Updated driver data:', updateDriverData);

    return NextResponse.json({ status: '1', message: 'Location updated successfully' });

  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ status: '0', message: 'Server error', error: err.message });
  }
}

// Helper function to calculate distance between two points in kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

// Helper function to convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
