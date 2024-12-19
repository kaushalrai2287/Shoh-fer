// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '../../../../../utils/supabase/client';

// const supabase = createClient();

// export async function GET(req: NextRequest) {
//   try {
//     // Fetch all roles with their associated permissions
//     const { data: roles, error: rolesError } = await supabase
//       .from('roles')
//       .select('role_id, role_name')
//       .order('role_name', { ascending: true });

//     if (rolesError) {
//       return NextResponse.json({ error: rolesError.message }, { status: 400 });
//     }

//     // For each role, fetch the associated permissions
//     const rolesWithPermissions = await Promise.all(
//       roles.map(async (role) => {
//         const { data: permissions, error: permissionsError } = await supabase
//           .from('role_permissions')
//           .select('permission_id')
//           .eq('role_id', role.role_id);

//         if (permissionsError) {
//           return { ...role, permissions: [], error: permissionsError.message };
//         }

//         return { ...role, permissions: permissions.map((p) => p.permission_id) };
//       })
//     );

//     return NextResponse.json({ roles: rolesWithPermissions });
//   } catch (error) {
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/client';

const supabase = createClient();

export async function GET(req: NextRequest) {
  try {
    // Extract the role_name filter from query parameters
    const { searchParams } = new URL(req.url);
    const roleNameFilter = searchParams.get('role_name');  // Get the role_name filter if provided

    // Build the base query
    let query = supabase.from('roles').select('role_id, role_name').order('role_name', { ascending: true });

    // If a role_name filter is provided, add a where condition to filter by role_name
    if (roleNameFilter) {
      query = query.ilike('role_name', `%${roleNameFilter}%`); // Use ilike for case-insensitive matching
    }

    // Fetch the roles with the optional filter
    const { data: roles, error: rolesError } = await query;

    // Handle roles fetching error
    if (rolesError) {
      return NextResponse.json({ error: rolesError.message }, { status: 400 });
    }

    // Return the roles in the response
    return NextResponse.json({ roles });
  } catch (error) {
    // Catch any unexpected errors
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
