importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKih28VR01VaJMSZ3ADaxiHXLQOXNH0eU",
  authDomain: "chofor-9c477.firebaseapp.com",
  projectId: "chofor-9c477",
  storageBucket: "chofor-9c477.firebasestorage.app",
  messagingSenderId: "570718560766",
  appId: "1:570718560766:web:1da3433e2c069626f9a0af",
  measurementId: "G-9G09S291LZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
