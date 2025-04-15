// pages/api/updateLocation.js
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { driver_id, latitude, longitude } = body;

    if (!driver_id || !latitude || !longitude) {
      return NextResponse.json({ status: '0', message: 'Missing required fields' });
    }

  
    const { data: insertData, error: insertError } = await supabase
      .from('driver_locations')
      .insert([{ driver_id, latitude, longitude }]);

    if (insertError) {
      return NextResponse.json({ status: '0', message: insertError.message });
    }

    
    const { error: updateError } = await supabase
      .from('drivers')
      .update({ latitude, longitude })
      .eq('driver_id', driver_id);

    if (updateError) {
      return NextResponse.json({ status: '0', message: updateError.message });
    }

    return NextResponse.json({ status: '1', message: 'Location updated successfully' });

  } catch (err: any) {
    return NextResponse.json({ status: '0', message: 'Server error', error: err.message });
  }
}
