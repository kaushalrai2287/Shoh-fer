// app/api/complaint-categories/route.ts
// import { createClient } from '../../../../../utils/supabase/client';
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cancelled_reasons')
      .select('reasons');
    // console.log('cancelled_reasons', data, error);
    if (error) {
      return NextResponse.json({ status: '0', message: 'Failed to cancelled reasons', error }, { status: 500 });
    }

    return NextResponse.json({ status: '1', categories: data });
  } catch (err: any) {
    return NextResponse.json({ status: '0', message: 'Server Error', error: err.message }, { status: 500 });
  }
}
