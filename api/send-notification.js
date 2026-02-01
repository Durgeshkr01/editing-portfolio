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
                included_segments: ['All'],
                filters: [{ field: 'tag', key: 'role', relation: '=', value: 'admin' }],
                headings: { en: '📩 New Booking Received!' },
                contents: { en: `${clientName} booked ${servicetype}. Check admin panel!` },
                url: 'https://editing-portfolio-alpha.vercel.app/admin.html'
            };
        } else if (type === 'booking_approved') {
            // Notify user about approval
            notification = {
                app_id: ONESIGNAL_APP_ID,
                included_segments: ['All'],
                filters: [{ field: 'tag', key: 'email', relation: '=', value: clientEmail.toLowerCase() }],
                headings: { en: '✅ Booking Approved!' },
                contents: { en: `Great news ${clientName}! Your booking has been approved by DK EDITS!` },
                url: 'https://editing-portfolio-alpha.vercel.app/home.html'
            };
        } else if (type === 'booking_rejected') {
            // Notify user about rejection
            notification = {
                app_id: ONESIGNAL_APP_ID,
                included_segments: ['All'],
                filters: [{ field: 'tag', key: 'email', relation: '=', value: clientEmail.toLowerCase() }],
                headings: { en: '❌ Booking Update' },
                contents: { en: `Sorry ${clientName}, your booking could not be approved. Please contact us.` },
                url: 'https://editing-portfolio-alpha.vercel.app/home.html'
            };
        } else {
            return res.status(400).json({ error: 'Invalid notification type' });
        }

        // Send notification via OneSignal API
        const response = await fetch('https://onesignal.com/api/v1/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${ONESIGNAL_API_KEY}`
            },
            body: JSON.stringify(notification)
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, data });
        } else {
            return res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error('Notification error:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
