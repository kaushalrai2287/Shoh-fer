import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Read body from request
    const { driver_id } = body;

    if (!driver_id) {
      return NextResponse.json(
        { message: 'Driver ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Fetch driver details from the database
    const { data, error } = await supabase
      .from('drivers')
      .select('isadminverified, kyc_status, police_verification_status')
      .eq('driver_id', driver_id)
      .single();

    if (error || !data) {
        console.error('Error fetching driver details:', error);
      return NextResponse.json(
        { message: 'Driver not found', status: 'error' },
        { status: 404 }
      );
    }

    // Format status messages
    const formatStatus = (status: string, type: string) => {
      let message = '';
      switch (status) {
        case 'approved':
          message = `${type} approved`;
          break;
        case 'pending':
          message = `${type} pending`;
          break;
        case 'rejected':
          message = `${type} rejected`;
          break;
        default:
          message = `${type} status unknown`;
      }
      return { message, status };
    };

    // Response object
    const response = {
      message: 'Driver details fetched successfully',
      status: '1',
      data: {
        isAdminVerified: formatStatus(data.isadminverified, 'Admin verification'),
        kyc: formatStatus(data.kyc_status, 'KYC'),
        policeverification: formatStatus(
          data.police_verification_status,
          'Police verification'
        ),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching driver details:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', status: 'error' },
      { status: 500 }
    );
  }
}
