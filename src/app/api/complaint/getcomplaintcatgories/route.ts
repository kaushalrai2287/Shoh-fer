// app/api/complaint-categories/route.ts
import { createClient } from '../../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('complaint_categories')
      .select('category_name');

    if (error) {
      return NextResponse.json({ status: '0', message: 'Failed to fetch categories', error }, { status: 500 });
    }

    return NextResponse.json({ status: '1', categories: data });
  } catch (err: any) {
    return NextResponse.json({ status: '0', message: 'Server Error', error: err.message }, { status: 500 });
  }
}
