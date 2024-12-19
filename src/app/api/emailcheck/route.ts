import { NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/client';

export async function POST(req:any) {
  const supabase = createClient();

  try {
    const { email } = await req.json();


    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('users') 
      .select('email')
      .eq('email', email);

    if (error) {
      console.error('Database query error:', error.message);
      return NextResponse.json(
        { success: false, message: 'Error checking email' },
        { status: 500 }
      );
    }

    
    if (data.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Email is already registered',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Email is available',
    });
  } catch (err:any) {
    console.error('Unexpected error:', err.message);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
