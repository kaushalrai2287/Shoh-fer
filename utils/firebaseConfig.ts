import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCKih28VR01VaJMSZ3ADaxiHXLQOXNH0eU",
    authDomain: "chofor-9c477.firebaseapp.com",
    projectId: "chofor-9c477",
    storageBucket: "chofor-9c477.firebasestorage.app",
    messagingSenderId: "570718560766",
    appId: "1:570718560766:web:1da3433e2c069626f9a0af",
    measurementId: "G-9G09S291LZ"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };