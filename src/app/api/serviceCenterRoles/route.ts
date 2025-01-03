// import { createClient } from '@supabase/supabase-js';
import { createClient } from '../../../../utils/supabase/client';
import { NextResponse } from 'next/server';


const supabase = createClient();

export async function POST(req: { json: () => PromiseLike<{ name: any; description: any; permissions: any; }> | { name: any; description: any; permissions: any; }; }) {
  try {
    const { name, description, permissions } = await req.json();

    // Create role
    const { data: role, error: roleError } = await supabase
      .from('service_center_roles')
      .insert([{ name, description }])
      .select()
      .single();

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 400 });
    }

    // Assign permissions to the role
    const rolePermissions = permissions.map((permId: any) => ({
      role_id: role.id,
      permission_id: permId,
    }));

    const { error: rolePermError } = await supabase
      .from('service_center_role_permissions')
      .insert(rolePermissions);

    if (rolePermError) {
      return NextResponse.json({ error: rolePermError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Service Center Role created successfully', role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
