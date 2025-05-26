// scripts/generateFirebaseFiles.js
const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Tạo src/firebase.js
const firebaseJs = `
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
`;

fs.writeFileSync(path.join(__dirname, '../src/firebase.js'), firebaseJs);
console.log('✅ src/firebase.js created.');

// Tạo public/firebase-messaging-sw.js
const firebaseSw = `
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

firebase.initializeApp(${JSON.stringify(firebaseConfig, null, 2)});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Thông báo';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
`;

fs.writeFileSync(path.join(__dirname, '../public/firebase-messaging-sw.js'), firebaseSw);
console.log('✅ public/firebase-messaging-sw.js created.');
