import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';
import { Readable } from "stream";
import { NextResponse } from 'next/server';
import { createClient } from '../../../../../utils/supabase/client';
import { IncomingMessage } from "http";

const supabase = createClient(
)

export const config = {
  api: {
    bodyParser: false, // ✅ Required for multiparty
  },
};

export async function POST(req: Request) {
  try {
      const reqStream = new Readable();
        const arrayBuffer = await req.arrayBuffer();
        reqStream.push(Buffer.from(arrayBuffer));
        reqStream.push(null);
    
        // ✅ Add headers to the Readable stream
        const headers = Object.fromEntries(req.headers.entries());
        const incomingReq = Object.assign(reqStream, {
          headers,
          method: req.method,
          url: req.url,
        }) as unknown as IncomingMessage;
    
        // ✅ Use multiparty to parse the form
        const form = new multiparty.Form({
          uploadDir: path.join(process.cwd(), "public/uploads/DriverProfilePhoto"),
          autoFiles: true,
        });
    
        const parseForm = () =>
          new Promise<{ fields: Record<string, any>; files: Record<string, any> }>(
            (resolve, reject) => {
              form.parse(incomingReq, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
              });
            }
          );
    
        const { fields, files } = await parseForm();
    

    if (!fields.driver_id || !files.file) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const driverId = fields.driver_id[0];
    const file = files.file[0];

    // ✅ Rename and move the file
    const newFileName = `${Date.now()}_${file.originalFilename}`;
    const newPath = path.join(
      process.cwd(),
      'public/uploads/DriverProfilePhoto',
      newFileName
    );

    fs.renameSync(file.path, newPath);

    // ✅ File URL (accessible publicly)
    const profilePhotoUrl = `/uploads/DriverProfilePhoto/${newFileName}`;
    console.log('Profile photo URL:', profilePhotoUrl);

    // ✅ Update the driver's record in Supabase
    const { error } = await supabase
      .from('drivers')
      .update({ profile_photo_url: profilePhotoUrl })
      .eq('driver_id', driverId);

    if (error) {
      console.error('Failed to update driver:', error);
      return NextResponse.json(
        { message: 'Failed to update driver record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'File uploaded successfully',
      profilePhotoUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}
