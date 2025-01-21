// import { createClient } from "../../../../utils/supabase/client";
// import { NextResponse } from "next/server";

// const supabase = createClient();

// export async function POST(req: Request) {
//   const { token, user_id } = await req.json();

//   if (!token || !user_id) {
//     return NextResponse.json({ error: "Token and user ID are required" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("fcm_token")
//     .upsert([{ user_id, token }], { onConflict: "user_id" });

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   return NextResponse.json({ message: "Token saved successfully", data });
// }
import { createClient } from "../../../../utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient();

export async function POST(req: Request) {
  const { token, user_id } = await req.json();

  if (!token || !user_id) {
    return NextResponse.json({ error: "Token and user ID are required" }, { status: 400 });
  }

  // Log the request data to debug
  console.log('Received token and user_id:', { token, user_id });

  const { data, error } = await supabase
    .from("fcm_tokens")
    .upsert([{ user_id, token }], { onConflict: "user_id" });

  if (error) {
    console.error('Supabase error:', error);  // Log the full error object
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Token saved successfully", data });
}
