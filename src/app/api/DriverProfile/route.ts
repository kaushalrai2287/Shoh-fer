// // import { supabase } from '../../lib/supabase';
// import { createClient } from '../../../../utils/supabase/client';
// import { NextResponse } from 'next/server';

// export async function POST(req:Request) {
//     try {

//         const body = await req.json();
//         const { driver_id } = body;
//         const supabase = await createClient();
       
//         const { data: drivers, error: driversError } = await supabase
//             .from('drivers')
//             .select('*')
//             .eq('driver_id', driver_id); 
       

//         return NextResponse.json({
//             status: '1',
//             message: 'Data fetched successfully',
//             data: drivers,
//         });
//     } catch (error:any) {
//         console.error('Error fetching professional info:', error.message);
//         return NextResponse.json({ status: '0', message: error.message });
//     }
// }
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver_id } = body;
    const supabase = await createClient();

    // Fetch driver row
    const { data: driver, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('driver_id', driver_id)
      .single(); // since only one expected

    if (error) {
      throw new Error(error.message);
    }

    // Extract document URLs
    const documents = [
      {
        name: 'National ID',
        url: driver.driver_national_id_image || null,
      },
      {
        name: 'Driver License',
        url: driver.driving_license_image || null,
      }
    ];

    // Remove raw document URLs from main driver object (optional cleanup)
    const { driver_national_id_image, driving_license_image, ...cleanedDriver } = driver;

    // Attach formatted documents
    const driver_info = {
      ...cleanedDriver,
      driver_documents: documents,
    };

    return NextResponse.json({
      status: '1',
      message: 'Data fetched successfully',
      data: driver_info
    });
  } catch (error: any) {
    console.error('Error fetching driver info:', error.message);
    return NextResponse.json({ status: '0', message: error.message });
  }
}
