import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { booking_id } = body;

    if (!booking_id) {
      return NextResponse.json(
        { message: 'Booking ID is required', status: 'error' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', booking_id)
      .single();

    if (bookingError || !bookingData) {
      console.error('Error fetching booking details:', bookingError);
      return NextResponse.json(
        { message: 'Booking not found', status: 'error' },
        { status: 404 }
      );
    }

    
    const response = {
      message: 'Booking details fetched successfully',
      status: '1',
      data: bookingData,
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
