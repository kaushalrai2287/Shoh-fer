// "use client";
// import { useState, useEffect } from "react";
// import { requestPushNotification } from "../utils/pushNotification";

// export default function NotificationButton() {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     requestPushNotification().then((t) => {
//       if (t) {
//         setToken(t);
//         saveTokenToDatabase(t);
//       }
//     });
//   }, []);

//   const saveTokenToDatabase = async (token: string) => {
//     await fetch("/api/saveToken", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ token, user_id: "user123" }),
//     });
//   };

//   return <button onClick={() => requestPushNotification()}>Enable Notifications</button>;
// }
