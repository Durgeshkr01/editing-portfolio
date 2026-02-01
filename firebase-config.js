// ==========================================
// Firebase Configuration for DK EDITS
// ==========================================
// 
// INSTRUCTIONS: Replace the values below with your Firebase project credentials
// 1. Go to Firebase Console: https://console.firebase.google.com
// 2. Select your project
// 3. Go to Project Settings > General
// 4. Scroll down to "Your apps" section
// 5. Copy your Firebase configuration and replace below
//
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyBU1Ye-lR0Rj1Tuv_8ZD_ZpB7gTlpb1_Ms",
    authDomain: "dk-edits-a8d57.firebaseapp.com",
    projectId: "dk-edits-a8d57",
    storageBucket: "dk-edits-a8d57.firebasestorage.app",
    messagingSenderId: "695681433441",
    appId: "1:695681433441:web:b21c88647c99e46f264f20",
    measurementId: "G-N41SZ2982R"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('🔥 Firebase initialized successfully!');
} catch (error) {
    console.error('❌ Firebase initialization error:', error);
}

// Initialize Firebase services
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

// Firestore Collections
const videosRef = db.collection('videos');
const bookingsRef = db.collection('bookings');

console.log('✅ Firebase services ready: Firestore & Storage');
