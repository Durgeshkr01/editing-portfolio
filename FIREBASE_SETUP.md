# DK EDITS - Firebase Setup Instructions

## 🔥 Firebase Configuration Kaise Karein

### Step 1: Firebase Project Banayein
1. [Firebase Console](https://console.firebase.google.com) pe jaayein
2. "Add Project" pe click karein
3. Project ka naam daalein (e.g., "dk-edits")
4. Google Analytics enable/disable karein (optional)
5. "Create Project" pe click karein

### Step 2: Web App Add Karein
1. Firebase console mein apne project pe click karein
2. Web icon (</>) pe click karein
3. App ka nickname daalein (e.g., "DK EDITS Web")
4. "Register app" pe click karein
5. Firebase configuration code copy karein

### Step 3: Firestore Database Setup
1. Firebase console mein "Firestore Database" pe jaayein
2. "Create database" pe click karein
3. **Test mode** select karein (development ke liye)
4. Location select karein (closest to your users)
5. "Enable" pe click karein

### Step 4: Firebase Storage Setup
1. Firebase console mein "Storage" pe jaayein
2. "Get started" pe click karein
3. **Test mode** select karein
4. "Done" pe click karein

### Step 5: Firebase Config Update Karein
1. `firebase-config.js` file kholein
2. Apne Firebase configuration values ko replace karein:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Step 6: Security Rules Setup (Optional - Production ke liye)

#### Firestore Rules:
Firebase console → Firestore Database → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Videos - anyone can read, only admins can write
    match /videos/{videoId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Bookings - users can create, admins can read/update
    match /bookings/{bookingId} {
      allow create: if true;
      allow read, update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

#### Storage Rules:
Firebase console → Storage → Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /videos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 Features Jo Firebase Se Integrate Hain

### Admin Panel Features:
✅ **Video Upload**: Admin videos upload kar sakte hain
✅ **Video Management**: Videos ko edit aur delete kar sakte hain
✅ **Booking Management**: Real-time booking notifications
✅ **Approve/Reject**: Bookings ko approve ya reject kar sakte hain
✅ **Real-time Updates**: Automatic refresh jab nayi booking aaye

### User Features:
✅ **Video Portfolio**: Admin ke uploaded videos dekh sakte hain
✅ **Book Services**: Service booking kar sakte hain
✅ **Track Bookings**: Email se apni booking status check kar sakte hain
✅ **Real-time Notifications**: Jab booking approve/reject ho

## 🚀 How to Run

1. Firebase configuration update karein (upar dekhen)
2. Local server start karein:
   ```bash
   python -m http.server 8000
   ```
3. Browser mein kholen: `http://localhost:8000/index.html`

## 📝 Database Structure

### Firestore Collections:

#### `videos` Collection:
```javascript
{
  title: "Video Title",
  description: "Description",
  instagramUrl: "https://instagram.com/...",
  thumbnailUrl: "https://...",
  category: "Wedding/Corporate/Personal",
  timestamp: serverTimestamp
}
```

#### `bookings` Collection:
```javascript
{
  clientName: "Name",
  clientEmail: "email@example.com",
  clientPhone: "1234567890",
  serviceType: "editing" or "videography",
  projectDetails: "Details...",
  status: "pending/approved/rejected",
  approvedDate: "2026-02-15",
  timestamp: serverTimestamp
}
```

## 🔧 Troubleshooting

### Problem: "Firebase is not defined"
**Solution**: Check ki Firebase SDK scripts properly load ho rahe hain browser console mein

### Problem: "Permission denied"
**Solution**: Firestore rules check karein, test mode enable karein development ke liye

### Problem: Videos nahi dikh rahe
**Solution**: 
1. Browser console check karein for errors
2. Firebase console mein `videos` collection check karein
3. Network tab mein Firebase requests check karein

## 📞 Support
Koi problem ho to browser console (F12) check karein aur error messages dekhein.

---
Made with ❤️ by DK EDITS
