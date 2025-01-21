import { getMessaging, getToken } from 'firebase/messaging';
import { createClient } from './supabase/server'; // Import Supabase client setup

// Function to initialize Supabase client (ensure this is async if you need to await initialization)
export const getSupabaseClient = async () => {
  return createClient();
};

// Function to get FCM token and store it in Supabase
export const getAndStoreFcmToken = async (userId: string) => {
  const supabase = await getSupabaseClient();  // Initialize Supabase client

  try {
    const messaging = getMessaging();  // Initialize Firebase Messaging
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (token) {
      // Store the token in Supabase
      const { data, error } = await supabase
        .from('fcm_tokens')
        .upsert({ user_id: userId, fcm_token: token });

      if (error) {
        console.error('Error storing FCM token:', error);
        throw error;
      }

      console.log('FCM Token stored in Supabase:', data);
    } else {
      console.log('No FCM token available');
    }
  } catch (error) {
    console.error('Error getting FCM token or storing it in Supabase:', error);
  }
};
