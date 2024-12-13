import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/client';

const supabase = createClient();


export async function POST(req: NextRequest) {
  try {
    const { role_name, permissions } = await req.json();

    
    const { data: roleData, error: roleError } = await supabase
    .from('roles')
    .insert([{ role_name }])
    .select('role_id')

    if (roleError) {
      return NextResponse.json({ error: roleError.message }, { status: 400 });
    }

    const roleId = roleData[0].role_id;

    
    const rolePermissions = permissions.map((permission_id: number) => ({
      role_id: roleId,
      permission_id,
    }));

    const { error: rolePermissionsError } = await supabase
      .from('role_permissions')
      .insert(rolePermissions);

    if (rolePermissionsError) {
      return NextResponse.json({ error: rolePermissionsError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Role and permissions added successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '../../../../../utils/supabase/client';

// const supabase = createClient();

// export async function POST(req: NextRequest) {
//   try {
//     const { role_name, permissions } = await req.json();

//     console.log("Received role_name:", role_name);
//     console.log("Received permissions:", permissions);

//     // Step 1: Insert into roles table
//     const { data: roleData, error: roleError } = await supabase
//       .from('roles')
//       .insert([{ role_name }])
//       .select('role_id');

//     if (roleError) {
//       console.error("Role Insertion Error:", roleError.message);
//       return NextResponse.json({ error: roleError.message }, { status: 400 });
//     }

//     if (!roleData || roleData.length === 0) {
//       return NextResponse.json({ error: "Failed to retrieve role_id" }, { status: 400 });
//     }

//     const roleId = roleData[0].role_id;
//     console.log("Inserted role_id:", roleId);

//     // Step 2: Prepare role_permissions data
//     const rolePermissions = permissions.map((permission_id: number) => ({
//       role_id: roleId,
//       permission_id,
//     }));
//     console.log("Inserting into role_permissions:", rolePermissions);

//     // Step 3: Insert into role_permissions table
//     const { error: rolePermissionsError } = await supabase
//       .from('role_permissions')
//       .insert(rolePermissions);

//     if (rolePermissionsError) {
//       console.error("Role Permissions Insertion Error:", rolePermissionsError.message);
//       return NextResponse.json({ error: rolePermissionsError.message }, { status: 400 });
//     }

//     return NextResponse.json({ message: 'Role and permissions added successfully' });
//   } catch (error) {
//     console.error("Server Error:", error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
