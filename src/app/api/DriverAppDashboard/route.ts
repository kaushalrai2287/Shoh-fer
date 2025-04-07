// import { NextResponse } from 'next/server';
// import { createClient } from '../../../../utils/supabase/client';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json(); // Read body from request
//     const { driver_id } = body;

//     if (!driver_id) {
//       return NextResponse.json(
//         { message: 'Driver ID is required', status: 'error' },
//         { status: 400 }
//       );
//     }

//     const supabase = createClient();

//     // Fetch driver details from the database
//     const { data, error } = await supabase
//       .from('drivers')
//       .select('isadminverified, kyc_status, police_verification_status')
//       .eq('driver_id', driver_id)
//       .single();

//     if (error || !data) {
//         console.error('Error fetching driver details:', error);
//       return NextResponse.json(
//         { message: 'Driver not found', status: 'error' },
//         { status: 404 }
//       );
//     }

//     // Format status messages
//     const formatStatus = (status: string, type: string) => {
//       let message = '';
//       switch (status) {
//         case 'approved':
//           message = `${type} approved`;
//           break;
//         case 'pending':
//           message = `${type} pending`;
//           break;
//         case 'rejected':
//           message = `${type} rejected`;
//           break;
//         default:
//           message = `${type} status unknown`;
//       }
//       return { message, status };
//     };

//     // Response object
//     const response = {
//       message: 'Driver details fetched successfully',
//       status: '1',
//       data: {
//         isAdminVerified: formatStatus(data.isadminverified, 'Admin verification'),
//         kyc: formatStatus(data.kyc_status, 'KYC'),
//         policeverification: formatStatus(
//           data.police_verification_status,
//           'Police verification'
//         ),
//       },
//     };

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching driver details:', error);
//     return NextResponse.json(
//       { message: 'Internal Server Error', status: 'error' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver_id } = body;

    if (!driver_id) {
      return NextResponse.json(
        { message: 'Driver ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch driver details from the database
    const { data: driverData, error: driverError } = await supabase
      .from('drivers')
      .select('isadminverified, kyc_status, police_verification_status,is_online')
      .eq('driver_id', driver_id)
      .single();

    if (driverError || !driverData) {
      console.error('Error fetching driver details:', driverError);
      return NextResponse.json(
        { message: 'Driver not found', status: 'error' },
        { status: 404 }
      );
    }

   
    const formatStatus = (status: string, type: string) => {
      let message = '';
      switch (status) {
        case 'approved':
          message = `${type} approved`;
          if (type === 'KYC') {
            message = 'KYC verification is successfully completed, and the admin has approved the physical documentation.';
          }
          break;
        case 'pending':
          message = `${type} pending`;
          if (type === 'KYC') {
            message = 'KYC document verification must be completed within 3 days, and the physical documentation is awaiting admin approval.';
          }
          if (type === 'Police verification' && driverData.police_verification_status === 'pending') {
            message = 'Police verification is still pending, even after seven days of visiting the Chofor office.';
          }
          break;
        case 'rejected':
          message = `${type} rejected`;
          break;
        default:
          message = `${type} status unknown`;
      }
      return { message, status };
    };

    const isPending =
      driverData.isadminverified === 'pending' ||
      driverData.kyc_status === 'pending' ||
      driverData.police_verification_status === 'pending';

    if (isPending) {
      return NextResponse.json(
        {
          message: 'Driver details fetched successfully',
          status: '1',
          data: {
           
            isAdminVerified: formatStatus(driverData.isadminverified, 'Admin verification'),
            kyc: formatStatus(driverData.kyc_status, 'KYC'),
            policeverification: formatStatus(driverData.police_verification_status, 'Police verification'),
            bookings: []
          },
        },
        { status: 200 }
      );
    }

    // Fetch booking details
    // const { data: bookings, error: bookingError } = await supabase
    //   .from('bookings')
    //   .select('*')
    //   .eq('driver_id', driver_id);
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

const { data: bookings, error: bookingError } = await supabase
  .from('bookings')
  .select('*',)
  .eq('driver_id', driver_id)
  .gte('created_at', `${today}T00:00:00.000Z`) 
  .lt('created_at', `${today}T23:59:59.999Z`); 


    if (bookingError) {
      console.error('Error fetching booking details:', bookingError);
      return NextResponse.json(
        { message: 'Error fetching booking details', status: 'error' },
        { status: 500 }
      );
    }

    const response = {
      message: 'Driver details and bookings fetched successfully',
      status: '1',
      data: {
        DriverOnlineStatus: driverData.is_online,
        isAdminVerified: formatStatus(driverData.isadminverified, 'Admin verification'),
        kyc: formatStatus(driverData.kyc_status, 'KYC'),
        policeverification: formatStatus(driverData.police_verification_status, 'Police verification'),
        bookings,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 'error' },
      { status: 500 }
    );
  }
}
