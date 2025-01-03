// import { createClient } from '@supabase/supabase-js';
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function POST(req: { json: () => PromiseLike<{ userId: any; roleId: any; }> | { userId: any; roleId: any; }; }) {
  try {
    const { userId, roleId } = await req.json();

    const { error } = await supabase
      .from('service_center_user_roles')
      .insert([{ user_id: userId, role_id: roleId }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Service Center Role assigned successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
