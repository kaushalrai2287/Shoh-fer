// import { createClient } from "../../../../../utils/supabase/client";
// import { NextResponse } from "next/server";

// // Named export for POST method
// export async function POST(req: Request) {
//   const supabase = createClient();
//   const { message, name, Driver, upload } = await req.json();  // Parsing JSON body from the request

//   // Validate the received data
//   if (!Driver || !Array.isArray(Driver) || Driver.length === 0) {
//     return NextResponse.json(
//       { error: "At least one Driver must be selected." },
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
//     const notifications = Driver.map((center: { value: string }) => ({
//       recipient_type: "Driver",  // Hardcoded
//       recipient_id: center.value,        // Center ID
//       type: "alert",                     // Hardcoded (You can add logic to make this dynamic)
//       message: message,                  // Message from the form
//       title: name,   
//                           // Title from the form
//     }));
//     // console.log(notifications)
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
import { createClient } from "../../../../../utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const message = formData.get('message');
  const name = formData.get('name');
  const Driver = JSON.parse(formData.get('Driver') as string || '[]');
  const upload = formData.get('upload') as File | null;

  if (!Driver || !Array.isArray(Driver) || Driver.length === 0) {
    return NextResponse.json(
      { error: "At least one Driver must be selected." },
      { status: 400 }
    );
  }

  if (!message || !name) {
    return NextResponse.json(
      { error: "Title and Message are required." },
      { status: 400 }
    );
  }

  let docUrl: string | null = null;

  try {
    // Handle file upload if a file is provided
    if (upload) {
      const filePath = `DriverNotificationDocs/${Date.now()}_${upload.name}`;
      const { error: uploadError } = await supabase.storage
        .from('DriverNotificationDocs')
        .upload(filePath, upload);

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        );
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('DriverNotificationDocs')
        .getPublicUrl(filePath);

      docUrl = publicUrlData.publicUrl;
    }

    // Prepare the notification data
    const notifications = Driver.map((center: { value: string }) => ({
      recipient_type: "Driver",
      recipient_id: center.value,
      type: "alert",
      message,
      title: name,
      doc_url: docUrl, // Store the uploaded file URL
    }));

    // Insert notifications into Supabase
    const { error } = await supabase
      .from("admin_notifications")
      .insert(notifications);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Notifications sent successfully!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
