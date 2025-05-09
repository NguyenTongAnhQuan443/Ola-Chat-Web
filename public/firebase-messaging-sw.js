// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Cấu hình Firebase của bạn (copy từ Firebase Console)
firebase.initializeApp({
  apiKey: "AIzaSyBNfDb_8qugsABsUG248l_-vGXRyp4FBlA",
  authDomain: "ola-chat-93b40.firebaseapp.com",
  projectId: "ola-chat-93b40",
  storageBucket: "ola-chat-93b40.firebasestorage.app",
  messagingSenderId: "586464898832",
  appId: "1:586464898832:web:a839a30bd067c05ff3bf95",
  measurementId: "G-GRDEP21EEL"
});

// Lấy instance của Firebase Messaging
const messaging = firebase.messaging();

// (Tùy chọn) Lắng nghe sự kiện khi nhận thông báo
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Thông báo';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/firebase-logo.png' // hoặc icon tuỳ chọn
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
