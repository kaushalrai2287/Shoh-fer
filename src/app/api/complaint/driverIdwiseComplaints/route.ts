// app/api/complaints-by-driver/route.ts
import { createClient } from '../../../../../utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driver_id } = body;

    if (!driver_id) {
      return NextResponse.json({ status: '0', message: 'Missing driverid' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('feedback_complaints')
      .select('id, booking_id, complaint_box, type_of_complaints, created_at')
      .eq('driver_id', driver_id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ status: '0', message: 'Failed to fetch complaints', error }, { status: 500 });
    }

    return NextResponse.json({ status: '1', complaints: data });
  } catch (err: any) {
    return NextResponse.json({ status: '0', message: 'Server Error', error: err.message }, { status: 500 });
  }
}
