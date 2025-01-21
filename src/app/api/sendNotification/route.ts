// import admin from "firebase-admin";
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/server";

// const serviceAccount = require("../../../../firebase-admin-sdk.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const supabase = await createClient();

// export async function POST(req: Request) {
//   const { title, body } = await req.json();
//   const { data, error } = await supabase.from("user_tokens").select("token");

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }

//   if (!data.length) {
//     return NextResponse.json({ error: "No registered tokens" }, { status: 400 });
//   }

//   const message = {
//     notification: { title, body },
//     tokens: data.map((row) => row.token),
//   };

//   try {
//     const response = await admin.messaging().sendEachForMulticast(message);
//     return NextResponse.json({ success: true, response });
//   } catch (error:any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
// import { NextResponse } from "next/server";
// import { createClient } from "../../../../utils/supabase/server";

// export async function POST(req: Request) {
//   const { title, message, user_id } = await req.json();

//   if (!title || !message || !user_id) {
//     return NextResponse.json({ success: false, message: "Invalid request data" });
//   }

//   const supabase = await createClient();
//   const { data: tokens, error } = await supabase
//     .from("fcm_tokens")
//     .select("token")
//     .eq("user_id", user_id);

//     console.log('Received tokens:', tokens);
//     console.log(user_id)

//   if (error || !tokens || tokens.length === 0) {
//     return NextResponse.json({ success: false, message: "No tokens found" });
//   }

//   const firebaseServerKey = "BDCJuMBOPgYNoB6meWRhnTODDT41fU0zujFB7v2tIfD7v2gaIHupJ5jI9hCpMI2dnQtbTNFksnmZUbyH9olDuog";
//   if (!firebaseServerKey) {
//     return NextResponse.json({ success: false, message: "FCM Server Key is missing" });
//   }

//   const tokenList = tokens.map((t) => t.token);

//   const notificationPayload = {
//     notification: { title, body: message },
//     ...(tokenList.length === 1
//       ? { to: tokenList[0] } // For a single recipient
//       : { registration_ids: tokenList }) // For multiple recipients
//   };

//   try {
//     const response = await fetch("https://fcm.googleapis.com/fcm/send", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `key=${firebaseServerKey}`,
//       },
//       body: JSON.stringify(notificationPayload),
//     });

//     const result = await response.json();
//     return NextResponse.json({ success: true, data: result });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message });
//   }
// }
import { google } from "googleapis";

import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("firebase-admin-sdk.json"); // Path to your service account file

// Generate OAuth2 access token
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountPath,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  // console.log(getAccessToken)
  return token?.token;
}

export async function POST(req: Request) {
  const { title, message, user_id } = await req.json();

  if (!title || !message || !user_id) {
    return NextResponse.json({ success: false, message: "Invalid request data" });
  }

  const supabase = await createClient();
  const { data: tokens, error } = await supabase
    .from("fcm_tokens")
    .select("token")
    .eq("user_id", user_id);

  if (error || !tokens || tokens.length === 0) {
    return NextResponse.json({ success: false, message: "No tokens found" });
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ success: false, message: "Failed to get access token" });
  }

  const fcmUrl = `https://fcm.googleapis.com/v1/projects/chofor-9c477/messages:send`;
  const notificationPayload = {
    message: {
      token: tokens[0].token, 
      notification: { title, body: message },
    },
  };

  try {
    const response = await fetch(fcmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(notificationPayload),
    });

    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
