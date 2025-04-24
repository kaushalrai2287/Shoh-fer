// app/api/register-complaint/route.ts
import { createClient } from '../../../../../utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driver_id, booking_id, complaintCategory, complaintMessage } = body;

    // Validation (optional, but recommended)
    if (!driver_id || !booking_id || !complaintCategory || !complaintMessage) {
      return NextResponse.json({ status: '0', message: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('feedback_complaints')
      .insert([{
        driver_id,
        booking_id,
        raised_by: 'driver',
        type_of_complaints: complaintCategory,
        complaint_box: complaintMessage,
        created_at: new Date().toISOString(), 
      }])
      .select();

    if (error) {
      return NextResponse.json({ status: '0', message: 'Failed to register complaint', error }, { status: 500 });
    }

    return NextResponse.json({ status: '1', message: 'Complaint registered successfully', data });
  } catch (err: any) {
    return NextResponse.json({ status: '0', message: 'Server Error', error: err.message }, { status: 500 });
  }
}
