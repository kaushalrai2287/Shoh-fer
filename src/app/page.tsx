
// "use client";

// import { useEffect } from "react";
// import { createClient } from "../../utils/supabase/client";
// import { useRouter } from "next/navigation";
// import NotificationButton from "../../components/NotificationButton";


// export default function Home(){
//   const router = useRouter();
//   useEffect(() => {
//     const checkUser = async () => {
//       const supabase = await createClient();
//       const {data,error} = await supabase.auth.getUser();

      

//       if (error || data?.user){
//         router.push("/login")
//       }
//       else {
//         router.push("/dashboard")
//       }
//     }
//     checkUser();
//   },[router])

//   return null;
// }
// "use client";
// import { useEffect, useState } from "react";
// import { requestPushNotification } from "../../utils/pushNotification";

// export default function HomePage() {
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
//       body: JSON.stringify({ token, user_id: "66428f1b-72ee-4c29-92ec-e4e473cdc210" }),
//     });
//   };

//   return (
//     <main>
//       <h1>Push Notification Demo</h1>
//       <button onClick={() => requestPushNotification()}>Enable Notifications</button>
//     </main>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Use router for redirection
import { requestPushNotification } from "../../utils/pushNotification";
import { createClient } from "../../utils/supabase/client";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter(); // Initialize router for redirection

  useEffect(() => {
    const checkUserAndRequestNotification = async () => {
      const supabase = createClient();

      // Get the authenticated user details
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        // If no user is logged in, redirect to the login page
        // console.error("No user logged in");
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Save the user_id
      setUserId(data.user.id);

      // Request push notification token
      const t = await requestPushNotification();
      if (t) {
        setToken(t);
        saveTokenToDatabase(t, data.user.id); // Save token with user_id
      }
    };

    checkUserAndRequestNotification();
  }, [router]); // Add router as a dependency

  const saveTokenToDatabase = async (token: string, user_id: string) => {
    await fetch("/api/saveToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, user_id }),
    });
  };

  return (
    <main>
      <h1>Push Notification Demo</h1>
      <button onClick={() => requestPushNotification()}>Enable Notifications</button>
    </main>
  );
}
