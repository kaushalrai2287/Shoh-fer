// import { createClient } from "../../../../../utils/supabase/client"; // Adjust path if needed
// import { NextResponse } from "next/server";

// interface RolePermission {
//   permissions: {
//     permission_name: string;
//   } | null;
// }
// const supabase = createClient();
// // const supabase = createClient();

// export async function GET(request: Request) {
//   try {
//     const authHeader = request.headers.get("Authorization");
//     const token = authHeader?.split(" ")[1]; // Extract Bearer token

//     if (!token) {
//       return NextResponse.json(
//         { message: "Unauthorized: No token provided" },
//         { status: 401 }
//       );
//     }

//     // Validate token and fetch user
//     const { data, error } = await supabase.auth.getUser(token);

//     if (error || !data?.user) {
//       return NextResponse.json(
//         { message: "Unauthorized: Invalid token" },
//         { status: 401 }
//       );
//     }

//     const supabase_id = data.user.id; // UUID from Supabase auth

//     // Fetch user_id directly from custom users table
//     const { data: user, error: userError } = await supabase
//       .from("users")
//       .select("user_id") // Fetch integer user_id
//       .eq("auth_id", supabase_id)
//       .single();

//     if (userError || !user) {
//       return NextResponse.json(
//         { message: "User not found in custom table" },
//         { status: 404 }
//       );
//     }

//     const user_id = user.user_id; // Integer user_id

//     // Fetch user roles
//     const { data: userRoles, error: userRolesError } = await supabase
//       .from("user_roles")
//       .select("role_id")
//       .eq("user_id", user_id);

//     if (userRolesError || !userRoles.length) {
//       return NextResponse.json(
//         { message: "No roles found for user" },
//         { status: 404 }
//       );
//     }

//     // Extract role IDs
//     const roleIds = userRoles.map((role) => role.role_id);

//     // Fetch permissions by joining role_permissions with permissions
    
//     // Fetch permissions by joining role_permissions with permissions
//     const { data: permissions, error: permissionsError } = await supabase
//       .from("role_permissions")
//       .select(
//         `
        
//         permissions:permission_id (permission_name)
//       `
//       )
//       .in("role_id", roleIds);

//     if (permissionsError || !permissions) {
//       return NextResponse.json(
//         { message: "Failed to fetch permissions" },
//         { status: 500 }
//       );
//     }

  



//     // Extract permission names from the nested permissions object
//     const permissionNames = permissions
//     .map((item) => item.permissions?.permission_name)
//     .filter((name) => name); // Filter out any undefined or null names
//     return NextResponse.json({ permissions: permissionNames });
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { message: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { createClient } from "../../../../../utils/supabase/client"; // Adjust path if needed
import { NextResponse } from "next/server";

// Define the type for the permissions object
interface Permission {
  permission_name: string;
}

interface RolePermission {
  permissions: Permission[] | null;  // Permissions is an array of Permission objects
}

const supabase = createClient();

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1]; // Extract Bearer token

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Validate token and fetch user
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const supabase_id = data.user.id; // UUID from Supabase auth

    // Fetch user_id directly from custom users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id") // Fetch integer user_id
      .eq("auth_id", supabase_id)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: "User not found in custom table" },
        { status: 404 }
      );
    }

    const user_id = user.user_id; // Integer user_id

    // Fetch user roles
    const { data: userRoles, error: userRolesError } = await supabase
      .from("user_roles")
      .select("role_id")
      .eq("user_id", user_id);

    if (userRolesError || !userRoles.length) {
      return NextResponse.json(
        { message: "No roles found for user" },
        { status: 404 }
      );
    }

    // Extract role IDs
    const roleIds = userRoles.map((role) => role.role_id);

    // Fetch permissions by joining role_permissions with permissions
    const { data: permissions, error: permissionsError } = await supabase
      .from("role_permissions")
      .select(`
        permissions:permission_id (permission_name)
      `)
      .in("role_id", roleIds);

    if (permissionsError || !permissions) {
      return NextResponse.json(
        { message: "Failed to fetch permissions" },
        { status: 500 }
      );
    }

    // Debugging the structure of the permissions data
    // console.log("Permissions Data:", permissions);

    const permissionNames = permissions
  .flatMap((item: RolePermission) => item.permissions || []) // Flatten the array of permissions
  .map((permission: Permission) => permission.permission_name) // Map to permission_name
  .filter((name) => name);  // Filter out null or undefined values

    // Check the result before returning
    // console.log("Permission Names:", permissionNames);

    // Return the permission names as the response
    return NextResponse.json({ permissions: permissionNames });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
