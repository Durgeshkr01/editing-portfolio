// Vercel Serverless Function - Send Push Notification
// This function sends push notifications via OneSignal API

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { type, clientName, clientEmail, servicetype } = req.body;

        const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
        const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

        let notification = {};

        if (type === 'new_booking') {
            // Notify admin about new booking
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [{ field: 'tag', key: 'role', relation: '=', value: 'admin' }],
                headings: { en: '📩 New Booking Received!' },
                contents: { en: `${clientName} booked ${servicetype}. Check admin panel!` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/admin.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                android_channel_id: 'booking_channel',
                android_visibility: 1
            };
        } else if (type === 'booking_approved') {
            // Notify user about approval
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [{ field: 'tag', key: 'email', relation: '=', value: clientEmail.toLowerCase() }],
                headings: { en: '✅ Booking Approved!' },
                contents: { en: `Great news ${clientName}! Your booking has been approved by DK EDITS!` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                android_channel_id: 'booking_channel',
                android_visibility: 1
            };
        } else if (type === 'booking_rejected') {
            // Notify user about rejection
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [{ field: 'tag', key: 'email', relation: '=', value: clientEmail.toLowerCase() }],
                headings: { en: '❌ Booking Update' },
                contents: { en: `Sorry ${clientName}, your booking could not be approved. Please contact us.` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                android_channel_id: 'booking_channel',
                android_visibility: 1
            };
        } else {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        // Send notification via OneSignal API
        console.log('📤 Sending notification:', JSON.stringify(notification, null, 2));
        
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONESIGNAL_API_KEY}`
            },
            body: JSON.stringify(notification)
        });

        const data = await response.json();
        console.log('📥 OneSignal Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            return res.status(200).json({ success: true, data, recipients: data.recipients });
        } else {
            console.error('❌ OneSignal Error:', data);
            return res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error('Notification error:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
