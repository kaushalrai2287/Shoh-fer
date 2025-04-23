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

export async function POST(req: Request) {
  try {
    console.log('API called');

    const body = await req.json();
    const { driver_id, latitude, longitude } = body;

    if (!driver_id || !latitude || !longitude) {
      console.error('Missing required fields', body);
      return NextResponse.json({ status: '0', message: 'Missing required fields' });
    }

    // Always insert a new row into driver_locations
    const { data: insertData, error: insertError } = await supabase
    .from('driver_locations')
    .insert([{ driver_id, latitude, longitude }])
    .select(); //

    // console.log('Insert Data:', insertData);
    if (insertError) {
      console.error('Insert Error:', insertError);
      return NextResponse.json({ status: '0', message: insertError.message });
    }

    // Update the driver's current location in the drivers table
    const { error: updateDriverError } = await supabase
      .from('drivers')
      .update({ latitude, longitude })
      .eq('driver_id', driver_id);

    if (updateDriverError) {
      console.error('Update driver error:', updateDriverError);
      return NextResponse.json({ status: '0', message: updateDriverError.message });
    }

    return NextResponse.json({ status: '1', message: 'Location inserted and updated successfully' });

  } catch (err: any) {
    console.error('Server error:', err);
    return NextResponse.json({ status: '0', message: 'Server error', error: err.message });
  }
}
