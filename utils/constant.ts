import { NextRequest, NextResponse } from "next/server";
import multiparty from "multiparty";
import { Readable } from "stream";


import moment from "moment";
export const runtime = "nodejs";

export function setUploadFileName(fileName: string) {
  const name = fileName.replaceAll(" ", "_");
  const subSt = name.substring(0, name.lastIndexOf("."));
  return subSt + new Date().toLocaleDateString().replaceAll("/", "") + new Date().toLocaleTimeString().substring(0, 4).replaceAll(":", "") + name.substring(name.lastIndexOf("."));

}


export function toIncomingMessage(req: NextRequest): any {
  const readable = new Readable();
  readable._read = () => { }; // No-op (_read is required for Readable streams)

  const reader = req.body?.getReader();
  function pushChunk() {
    reader
      ?.read()
      .then(({ value, done }) => {
        if (done) {
          readable.push(null); // Signal EOF
        } else {
          readable.push(Buffer.from(value)); // Push chunk into stream
          pushChunk(); // Continue reading
        }
      })
      .catch(() => readable.push(null));
  }

  pushChunk(); // Start reading

  
  return Object.assign(readable, {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  });
}

// Parse form data
export const parseForm = async (req: NextRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    const incomingReq = toIncomingMessage(req);

    form.parse(incomingReq, (err: any, fields: any, files: any) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
};

export function funCalculateTimeDifference(startDate: Date, endDate: Date) {
 
if(formatDate(startDate.toDateString(),false)==formatDate(endDate.toDateString(),false)){
  const milliDiff: number = startDate.getTime()
    - endDate.getTime();

  // Converting time into hh:mm:ss format

  // Total number of seconds in the difference
  const totalSeconds = Math.floor(milliDiff / 1000);

  // Total number of minutes in the difference
  const totalMinutes = Math.floor(totalSeconds / 60);

  // Total number of hours in the difference
  const totalHours = Math.floor(totalMinutes / 60);

  // Getting the number of seconds left in one minute
  

  // Getting the number of minutes left in one hour
  const remMinutes = totalMinutes % 60;

  return `${totalHours}.${remMinutes}`;
}else{
  return `0.0`;
}
}


export const formatDate = (date: string, isTime = false) => {
  if (!date) return '';
  const parsedDate = moment(date);

  if (isTime) return parsedDate.format('HH:mm A');

  return parsedDate.format('DD/MM/YYYY');
};




export const formatDateToISO = (now:Date) => {
  

  // Get the ISO string in UTC (e.g., "2024-11-21T13:00:00.000Z")
  const isoString = new Date(now).toISOString();

  // Replace the trailing "Z" with "+00:00" to match your format
  const formattedDate = isoString.replace(/\.\d{3}Z$/, "+00:00");

  return formattedDate;
};