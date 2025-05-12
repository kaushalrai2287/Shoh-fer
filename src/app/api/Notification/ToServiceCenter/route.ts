// import { createClient } from "../../../../../utils/supabase/client";
// import { NextResponse } from "next/server";

// // Named export for POST method
// export async function POST(req: Request) {
//   const supabase = createClient();
//   const { message, name, service_centers, upload } = await req.json(); 


//   if (!service_centers || !Array.isArray(service_centers) || service_centers.length === 0) {
//     return NextResponse.json(
//       { error: "At least one service center must be selected." },
//       { status: 400 }
//     );
//   }

//   if (!message || !name) {
//     return NextResponse.json(
//       { error: "Title and Message are required." },
//       { status: 400 }
//     );
//   }

//   try {
//     // Prepare the notification data
//     const notifications = service_centers.map((center: { value: string }) => ({
//       recipient_type: "Service Center",  // Hardcoded
//       recipient_id: center.value,        // Center ID
//       type: "alert",                     // Hardcoded (You can add logic to make this dynamic)
//       message: message,                  // Message from the form
//       title: name,                       // Title from the form
//     }));

//     // Batch Insert Notifications into Supabase
//     const { error } = await supabase
//       .from("admin_notifications")
//       .insert(notifications);

//     if (error) {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Notifications sent successfully!" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return NextResponse.json(
//       { error: "An unexpected error occurred." },
//       { status: 500 }
//     );
//   }
// }

// // You can also add a named export for the GET method if you want to handle it (optional)
// // export async function GET() {
// //   return NextResponse.json({ message: "This is the GET endpoint" }, { status: 200 });
// // }
// import { createClient } from "../../../../../utils/supabase/client";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const supabase = createClient();
//   const formData = await req.formData(); // Handle file uploads using FormData

//   const message = formData.get('message') as string;
//   const name = formData.get('name') as string;
//   const service_centers = JSON.parse(formData.get('service_centers') as string || '[]');
//   const upload = formData.get('upload') as File | null;

//   if (!service_centers || !Array.isArray(service_centers) || service_centers.length === 0) {
//     return NextResponse.json(
//       { error: "At least one service center must be selected." },
//       { status: 400 }
//     );
//   }

//   if (!message || !name) {
//     return NextResponse.json(
//       { error: "Title and Message are required." },
//       { status: 400 }
//     );
//   }

//   let fileUrl: string | null = null;

//   try {
//     // Handle file upload if a file is provided
//     if (upload) {
//       const fileName = `${Date.now()}_${upload.name}`;
//       const { data: uploadData, error: uploadError } = await supabase
//         .storage
//         .from('ServiceNotificationDocs')
//         .upload(fileName, upload, { contentType: upload.type });

//       if (uploadError) {
//         console.error("File upload error:", uploadError);
//         return NextResponse.json(
//           { error: "Failed to upload document." },
//           { status: 500 }
//         );
//       }

//       // Get public URL for the uploaded file
//       const { data: publicURL } = supabase
//         .storage
//         .from('ServiceNotificationDocs')
//         .getPublicUrl(fileName);

//       fileUrl = publicURL.publicUrl;
//     }

//     // Prepare the notification data
//     const notifications = service_centers.map((center: { value: string }) => ({
//       recipient_type: "Service Center",
//       recipient_id: center.value,
//       type: "alert",
//       message: message,
//       title: name,
//       doc_url: fileUrl, // Attach file URL if available
//     }));

//     // Batch Insert Notifications into Supabase
//     const { error } = await supabase
//       .from("admin_notifications")
//       .insert(notifications);

//     if (error) {
//       console.error("Database insertion error:", error);
//       return NextResponse.json(
//         { error: error.message },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Notifications sent successfully!" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Unexpected error:", err);
//     return NextResponse.json(
//       { error: "An unexpected error occurred." },
//       { status: 500 }
//     );
//   }
// }
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/client";

async function getAccessToken() {
  const credentials = JSON.parse(process.env.FIREBASE_CREDENTIALS!);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token?.token;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const message = formData.get("message") as string;
  const name = formData.get("name") as string;
  const service_centers = JSON.parse(formData.get("service_centers") as string || "[]");
  const upload = formData.get("upload") as File | null;

  if (!service_centers || !Array.isArray(service_centers) || service_centers.length === 0) {
    return NextResponse.json({ error: "At least one service center must be selected." }, { status: 400 });
  }

  if (!message || !name) {
    return NextResponse.json({ error: "Title and Message are required." }, { status: 400 });
  }

  let fileUrl: string | null = null;

  try {
    // Upload file if exists
    if (upload) {
      const fileName = `${Date.now()}_${upload.name}`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from("ServiceNotificationDocs")
        .upload(fileName, upload, { contentType: upload.type });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        return NextResponse.json({ error: "Failed to upload document." }, { status: 500 });
      }

      const { data: publicURL } = supabase
        .storage
        .from("ServiceNotificationDocs")
        .getPublicUrl(fileName);
      fileUrl = publicURL.publicUrl;
    }

    // Prepare and insert notifications into Supabase
    const notifications = service_centers.map((center: { value: string }) => ({
      recipient_type: "Service Center",
      recipient_id: center.value,
      type: "alert",
      message,
      title: name,
      doc_url: fileUrl,
    }));

    const { error } = await supabase
      .from("admin_notifications")
      .insert(notifications);

    if (error) {
      console.error("DB Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get Firebase access token
    const accessToken = await getAccessToken();
    // console.log("Access Token:", accessToken);
    if (!accessToken) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
    }

    // Send notification to all service center FCM tokens
    for (const center of service_centers) {
      // console.log("Sending notification to:", center);
      const { data: tokens, error: tokenError } = await supabase
        .from("fcm_tokens")
        .select("token")
        .eq("user_id", center.user_id)
        .order("created_at", { ascending: false })
        // .limit(1);
// console.log("Tokens:", tokens, "Error:", tokenError);
      if (tokenError || !tokens || tokens.length === 0) {
        console.warn(`No token found for user ${center.value}`);
        continue;
      }
// console.log("Tokens found:", tokens);
      const fcmPayload = {
        message: {
          token: tokens[0].token,
          notification: {
            title: name,
            body: message,
          },
        },
      };

      const response = await fetch(`https://fcm.googleapis.com/v1/projects/chofor-9c477/messages:send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(fcmPayload),
      });

      if (!response.ok) {
        console.error(`Failed to send FCM to ${center.value}: ${response.statusText}`);
      }
    }

    return NextResponse.json({ message: "Notifications sent successfully!" }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
