import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';


const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const { driver_id, is_online } = await req.json();

    if (!driver_id || is_online === undefined) {
      return NextResponse.json({ error: 'Driver ID and status are required' }, { status: 400 });
    }

    
    const { error: updateError } = await supabase
      .from('drivers')
      .update({ is_online })
      .eq('driver_id', driver_id);

    if (updateError) {
      throw updateError;
    }

   
    const { data: driverData, error: fetchError } = await supabase
      .from('drivers')
      .select('latitude, longitude')
      .eq('driver_id', driver_id)
      .single();

    if (fetchError || !driverData) {
      throw fetchError || new Error('Driver not found');
    }

    return NextResponse.json(
      {
        message: 'Driver status updated successfully',
        latitude: driverData.latitude,
        longitude: driverData.longitude,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
