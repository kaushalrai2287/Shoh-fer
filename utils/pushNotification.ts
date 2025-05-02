// import { messaging, getToken } from "./firebaseConfig";
// // import { messaging, getToken } from "./firebaseClientConfig";
// // import { messaging, getToken } from "./firebaseClientConfig";


// export const requestPushNotification = async (): Promise<string | null> => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === "granted") {
//       const token = await getToken(messaging, {
//         vapidKey:"BDCJuMBOPgYNoB6meWRhnTODDT41fU0zujFB7v2tIfD7v2gaIHupJ5jI9hCpMI2dnQtbTNFksnmZUbyH9olDuog",
//       });
//       return token;
//     } else {
//       console.error("Notification permission denied.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error getting push notification token:", error);
//     return null;
//   }
// };
import { messaging, getToken } from "./firebaseClientConfig";

export const requestPushNotification = async (): Promise<string | null> => {
  if (!messaging) return null; // Ensure messaging is initialized
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BDCJuMBOPgYNoB6meWRhnTODDT41fU0zujFB7v2tIfD7v2gaIHupJ5jI9hCpMI2dnQtbTNFksnmZUbyH9olDuog",
        
      });
      return token;
    } else {
      console.error("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("Error getting push notification token:", error);
    return null;
  }
};
