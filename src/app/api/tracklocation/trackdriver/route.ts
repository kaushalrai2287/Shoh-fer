import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';
import { createClient } from '../../../../../utils/supabase/client';

const supabase = createClient()
// GET Method
export async function GET(req: { url: string | URL; }) {
  try {
    const { searchParams } = new URL(req.url);
    const booking_id = searchParams.get('booking_id');

    if (!booking_id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    // Fetch the latest driver location for the given booking_id
    const { data, error } = await supabase
      .from('driverlocation')
      .select('latitude, longitude, timestamp')
      .eq('booking_id', booking_id)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Driver location not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
