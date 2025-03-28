import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const { booking_id, status } = await req.json();

    if (!booking_id || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', booking_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Booking status updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
