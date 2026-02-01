# DK EDITS - Quick Reference

## 🔐 Admin Credentials
- **Username**: admin
- **Password**: admin123

## 🎯 Features Summary

### Admin Panel (`admin.html`):
1. **Video Management**
   - Add new videos (title, description, Instagram URL, thumbnail)
   - Edit existing videos
   - Delete videos
   - Real-time sync with Firebase Firestore

2. **Booking Management**
   - View all booking requests
   - Approve bookings with date
   - Reject bookings
   - Real-time notifications for new bookings
   - See pending/approved/rejected counts

### User Portal (`home.html`):
1. **Video Portfolio**
   - View all uploaded videos
   - Click to view on Instagram
   - Auto-updates when admin adds new videos

2. **Book Services**
   - Choose service type (Editing Only / Videography + Editing)
   - Submit booking request
   - Track booking status

3. **Notifications**
   - Check booking status by email
   - See approved/rejected notifications
   - View approved dates

## 🔥 Firebase Collections

### `videos` Collection
- Stores all video portfolio items
- Auto-updates on user side

### `bookings` Collection  
- Stores all booking requests
- Real-time status updates (pending → approved/rejected)

## 📁 File Structure
```
├── index.html           # Login page (role selection)
├── admin.html          # Admin dashboard
├── home.html           # User portfolio page
├── admin-script.js     # Admin panel logic + Firebase
├── script.js           # User page logic + Firebase
├── firebase-config.js  # Firebase configuration
├── admin-styles.css    # Admin panel styles
├── styles.css          # User page styles
├── login-styles.css    # Login page styles
└── FIREBASE_SETUP.md   # Firebase setup guide
```

## 🚀 Quick Start

1. **Firebase Setup** (One-time):
   - Create Firebase project
   - Enable Firestore Database (test mode)
   - Enable Firebase Storage (test mode)
   - Copy config to `firebase-config.js`

2. **Run Local Server**:
   ```bash
   python -m http.server 8000
   ```

3. **Access Application**:
   - Login: `http://localhost:8000/index.html`
   - Select "Admin" → Enter credentials
   - Or select "User" → Browse portfolio & book

## 💡 Tips

- **Admin**: Videos add karne ke baad automatically user side pe dikhegi
- **User**: Email yaad rakhein - booking status check karne ke liye chahiye
- **Real-time**: Admin panel mein new bookings automatically appear hoti hain
- **Notifications**: User notification bell (🔔) se apni booking status check kar sakte hain

## 🔄 Data Flow

1. **Video Upload Flow**:
   Admin adds video → Firebase Firestore → Real-time update → User sees video

2. **Booking Flow**:
   User submits booking → Firebase Firestore → Admin sees request → Admin approves/rejects → User gets notification

## 🛠️ To-Do (Future Enhancements)
- [ ] Add Firebase Authentication for admin
- [ ] Email notifications (EmailJS/SendGrid)
- [ ] Video file upload to Firebase Storage
- [ ] Advanced filtering for bookings
- [ ] Calendar view for approved bookings
