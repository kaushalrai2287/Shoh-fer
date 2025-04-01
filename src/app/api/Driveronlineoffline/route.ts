import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const { driver_id, is_online } = await req.json();
 
    if (!driver_id || !is_online) {
      return NextResponse.json({ error: 'Driver ID and status are required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('drivers')
      .update({ is_online })
      .eq('driver_id', driver_id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'driver is online' }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
