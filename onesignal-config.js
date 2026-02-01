// ==========================================
// OneSignal Push Notifications Configuration
// ==========================================

const ONESIGNAL_APP_ID = "a8e46320-37a3-47f6-a316-f0cb1a47c0a3";
const ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

// Note: For sending notifications from client-side, we'll use OneSignal's 
// "Segments" feature. Admin will be tagged with "role: admin" and users 
// will be tagged with their email.

// Tag current user with their email (call after booking)
async function tagUserWithEmail(email) {
    try {
        if (typeof OneSignal !== 'undefined') {
            await OneSignal.User.addTag("email", email.toLowerCase());
            console.log('✅ User tagged with email:', email);
        }
    } catch (error) {
        console.error('❌ Error tagging user:', error);
    }
}

// Tag user as admin
async function tagAsAdmin() {
    try {
        if (typeof OneSignal !== 'undefined') {
            await OneSignal.User.addTag("role", "admin");
            console.log('✅ User tagged as admin');
        }
    } catch (error) {
        console.error('❌ Error tagging admin:', error);
    }
}

// Request notification permission
async function requestNotificationPermission() {
    try {
        if (typeof OneSignal !== 'undefined') {
            const permission = await OneSignal.Notifications.requestPermission();
            console.log('🔔 Notification permission:', permission);
            return permission;
        }
    } catch (error) {
        console.error('❌ Error requesting permission:', error);
    }
    return false;
}

// Check if notifications are enabled
async function areNotificationsEnabled() {
    try {
        if (typeof OneSignal !== 'undefined') {
            return await OneSignal.Notifications.permission;
        }
    } catch (error) {
        console.error('❌ Error checking notification status:', error);
    }
    return false;
}

console.log('✅ OneSignal notification helpers loaded');
