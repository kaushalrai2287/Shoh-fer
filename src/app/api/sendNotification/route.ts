
import { google } from "googleapis";

import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";
import fs from "fs";
import path from "path";

// const serviceAccountPath = path.resolve("firebase-admin-sdk.json"); // Path to your service account file
const serviceAccountUrl = "https://democheck.in/cron/firebase-admin-sdk.json";

async function getAccessToken() {
  const response = await fetch(serviceAccountUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch service account file");
  }
  const serviceAccountPath = await response.json();

  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccountPath,
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
