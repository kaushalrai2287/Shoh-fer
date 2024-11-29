import { NextRequest, NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import { parseForm, setUploadFileName } from "../../../../utils/constant";


export const runtime = "nodejs"; // Ensure Node.js runtime for app directory API

// Handle POST request
export const POST = async (req: NextRequest) => {
  try {
    const { fields, files } = await parseForm(req);
    
    if (!files || !files.file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const uploadedFile = files.file[0];
    const tempFilePath = uploadedFile.path; // Temporary file path

    const filename=setUploadFileName(uploadedFile.originalFilename);

    const uploadDir = path.join(process.cwd(), "public/assets");
    await fs.mkdir(uploadDir, { recursive: true });

    const destination = path.join(uploadDir, filename);
    await fs.copyFile(tempFilePath, destination);
    const fileURL=process.env.NEXT_PUBLIC_BASE_URL+"assets/"+filename

    return NextResponse.json({ message: "File uploaded successfully", status: 1,documentURL:fileURL },{status:200});
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json({
      message: "File upload failed",
      error: error instanceof Error ? error.message : String(error),
      status: 500,
    });
  }
};
