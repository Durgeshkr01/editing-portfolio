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
        const { type, clientName, clientEmail, clientPhone, servicetype } = req.body;

        const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
        const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

        let notification = {};

        if (type === 'new_booking') {
            // Notify admin about new booking - try tag filter first, fallback to segment
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [
                    { field: 'tag', key: 'role', relation: '=', value: 'admin' }
                ],
                headings: { en: '📩 New Booking Request!' },
                contents: { en: `🎬 ${clientName} (📱${clientPhone || 'N/A'}) wants to book ${servicetype}! Open app to check.` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/admin.html',
                url: 'https://editing-portfolio-alpha.vercel.app/admin.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                isAnyWeb: true,
                data: {
                    type: 'new_booking',
                    clientName: clientName,
                    clientPhone: clientPhone
                }
            };
        } else if (type === 'booking_approved') {
            // Notify user about approval - use mobile number for filtering
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [
                    { field: 'tag', key: 'mobile', relation: '=', value: clientPhone }
                ],
                headings: { en: '🎉 Booking Approved!' },
                contents: { en: `Great news ${clientName} ji! ✅ Your booking has been APPROVED by DK EDITS! Check app for details.` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                isAnyWeb: true,
                data: {
                    type: 'booking_approved',
                    clientName: clientName
                }
            };
        } else if (type === 'booking_rejected') {
            // Notify user about rejection - use mobile number for filtering
            notification = {
                app_id: ONESIGNAL_APP_ID,
                filters: [
                    { field: 'tag', key: 'mobile', relation: '=', value: clientPhone }
                ],
                headings: { en: '😔 Booking Update' },
                contents: { en: `Sorry ${clientName} ji, your booking could not be approved. Please contact DK EDITS for more info.` },
                web_url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                url: 'https://editing-portfolio-alpha.vercel.app/home.html',
                chrome_web_icon: 'https://editing-portfolio-alpha.vercel.app/icons/icon-192x192.png',
                chrome_web_badge: 'https://editing-portfolio-alpha.vercel.app/icons/icon-72x72.png',
                priority: 10,
                ttl: 86400,
                isAnyWeb: true,
                data: {
                    type: 'booking_rejected',
                    clientName: clientName
                }
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
            return res.status(200).json({ 
                success: true, 
                data, 
                recipients: data.recipients,
                message: data.recipients > 0 ? 'Notification sent!' : 'No recipients found with matching tags'
            });
        } else {
            console.error('❌ OneSignal Error:', data);
            return res.status(400).json({ success: false, error: data });
        }

    } catch (error) {
        console.error('Notification error:', error);
        return res.status(500).json({ error: 'Failed to send notification' });
    }
}
