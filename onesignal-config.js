// ==========================================
// OneSignal Push Notifications Configuration
// ==========================================

const ONESIGNAL_APP_ID = "a8e46320-37a3-47f6-a316-f0cb1a47c0a3";
const ONESIGNAL_API_URL = "https://onesignal.com/api/v1/notifications";

// Note: For sending notifications from client-side, we'll use OneSignal's 
// "Segments" feature. Admin will be tagged with "role: admin" and users 
// will be tagged with their mobile number.

// Wait for OneSignal to be ready and tag user
async function initOneSignalTags() {
    try {
        // Wait for OneSignal to be ready
        if (typeof OneSignal === 'undefined') {
            console.log('⏳ Waiting for OneSignal SDK...');
            return;
        }
        
        // Get subscription ID and save it
        const subscriptionId = await OneSignal.User.PushSubscription.id;
        if (subscriptionId) {
            localStorage.setItem('onesignal_subscription_id', subscriptionId);
            console.log('✅ OneSignal Subscription ID saved:', subscriptionId);
        }
        
        // Tag user based on role
        const userRole = localStorage.getItem('dkEditsUserRole');
        const userName = localStorage.getItem('dkEditsUserName');
        const userMobile = localStorage.getItem('dkEditsUserMobile');
        
        if (userRole === 'admin') {
            await OneSignal.User.addTag("role", "admin");
            console.log('✅ Tagged as admin');
        } else if (userRole === 'user' && userMobile) {
            await OneSignal.User.addTag("role", "user");
            await OneSignal.User.addTag("mobile", userMobile);
            if (userName) {
                await OneSignal.User.addTag("name", userName);
            }
            console.log('✅ Tagged as user with mobile:', userMobile);
        }
    } catch (error) {
        console.error('❌ Error in OneSignal tagging:', error);
    }
}

// Tag user with mobile number (call after login/booking)
async function tagUserWithMobile(mobile, name) {
    try {
        if (typeof OneSignal !== 'undefined') {
            await OneSignal.User.addTag("mobile", mobile);
            await OneSignal.User.addTag("role", "user");
            if (name) {
                await OneSignal.User.addTag("name", name);
            }
            
            // Also save subscription ID
            const subscriptionId = await OneSignal.User.PushSubscription.id;
            if (subscriptionId) {
                localStorage.setItem('onesignal_subscription_id', subscriptionId);
            }
            
            console.log('✅ User tagged with mobile:', mobile);
        }
    } catch (error) {
        console.error('❌ Error tagging user:', error);
    }
}

// Tag current user with their email (legacy - kept for backward compatibility)
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
