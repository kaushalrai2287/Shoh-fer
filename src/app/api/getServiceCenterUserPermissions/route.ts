// import { createClient } from '@supabase/supabase-js';
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(req: { url: string | URL; }) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('service_center_user_roles')
      .select('role_id')
      .eq('user_id', userId);

    if (error || !data.length) {
      return NextResponse.json({ error: 'No roles found for this user' }, { status: 404 });
    }

    const roleIds = data.map((role) => role.role_id);

    const { data: permissionsData } = await supabase
      .from('service_center_role_permissions')
      .select('service_center_permissions(name)')
      .in('role_id', roleIds);

    // const permissions = permissionsData.map((perm) => perm.service_center_permissions.name);

    // return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
