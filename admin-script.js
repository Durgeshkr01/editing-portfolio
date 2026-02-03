// Admin credentials (In production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Durgesh@01'
};

// Check if admin is logged in
(function checkAdminAuth() {
    const userRole = localStorage.getItem('dkEditsUserRole');
    
    if (!userRole || userRole !== 'admin') {
        window.location.replace('index.html');
        return;
    }
})();

// Prevent back button after logout
window.addEventListener('pageshow', function(event) {
    const userRole = localStorage.getItem('dkEditsUserRole');
    if (!userRole || userRole !== 'admin') {
        window.location.replace('index.html');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showDashboard();
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear login state
        localStorage.removeItem('dkEditsUserRole');
        window.location.replace('index.html');
    }
});

// Section Toggle Handlers
document.getElementById('manageVideosBtn').addEventListener('click', () => {
    document.getElementById('videoManagementSection').style.display = 'block';
    document.getElementById('bookingManagementSection').style.display = 'none';
    document.getElementById('manageVideosBtn').classList.add('active');
    document.getElementById('manageBookingsBtn').classList.remove('active');
    loadAdminVideos();
});

document.getElementById('manageBookingsBtn').addEventListener('click', () => {
    document.getElementById('videoManagementSection').style.display = 'none';
    document.getElementById('bookingManagementSection').style.display = 'block';
    document.getElementById('manageBookingsBtn').classList.add('active');
    document.getElementById('manageVideosBtn').classList.remove('active');
    loadBookings();
    updateStats();
});

// Filter Tabs for Bookings
let currentFilter = 'all';
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Apply filter
        currentFilter = tab.dataset.filter;
        filterBookings(currentFilter);
    });
});

function filterBookings(filter) {
    const bookingCards = document.querySelectorAll('.booking-card');
    
    bookingCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (card.classList.contains(filter)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Video Modal Handlers
const videoModal = document.getElementById('videoModal');
const addVideoBtn = document.getElementById('addVideoBtn');
const closeVideoModal = document.getElementById('closeVideoModal');
const videoForm = document.getElementById('videoForm');

addVideoBtn.addEventListener('click', () => {
    document.getElementById('videoModalTitle').textContent = 'Add New Video';
    videoForm.reset();
    document.getElementById('videoId').value = '';
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeVideoModal.addEventListener('click', () => {
    videoModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Video Form Submit
videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = videoForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Uploading...';
    submitBtn.disabled = true;
    
    try {
        const videoId = document.getElementById('videoId').value;
        const videoData = {
            title: document.getElementById('videoTitle').value,
            description: document.getElementById('videoDescription').value,
            instagramUrl: document.getElementById('instagramUrl').value,
            thumbnailUrl: document.getElementById('thumbnailUrl').value,
            category: document.getElementById('videoCategory').value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        if (videoId) {
            // Update existing video in Firestore
            await videosRef.doc(videoId).update(videoData);
            console.log('✅ Video updated in Firestore:', videoId);
        } else {
            // Add new video to Firestore
            const docRef = await videosRef.add(videoData);
            console.log('✅ New video added to Firestore:', docRef.id);
        }
        
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        loadAdminVideos();
        
        alert('✅ Video saved successfully!');
    } catch (error) {
        console.error('❌ Error saving video:', error);
        alert('❌ Error saving video: ' + error.message);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    // Show bookings by default
    document.getElementById('videoManagementSection').style.display = 'none';
    document.getElementById('bookingManagementSection').style.display = 'block';
    loadBookings();
    updateStats();
}

// Load bookings from Firestore with real-time updates
function loadBookings() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '<div class="loading">⏳ Loading bookings...</div>';
    
    // Real-time listener for bookings
    bookingsRef.orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        const bookings = [];
        snapshot.forEach((doc) => {
            bookings.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = `
                <div class="empty-state">
                    <h3>📭 No Bookings Yet</h3>
                    <p>When clients book your services, they'll appear here.</p>
                </div>
            `;
            return;
        }
        
        bookingsList.innerHTML = bookings.map(booking => createBookingCard(booking)).join('');
        
        // Add event listeners to action buttons
        bookings.forEach(booking => {
            if (booking.status === 'pending') {
                const approveBtn = document.getElementById(`approve-${booking.id}`);
                const rejectBtn = document.getElementById(`reject-${booking.id}`);
                const dateInput = document.getElementById(`date-${booking.id}`);
                
                if (approveBtn) {
                    approveBtn.addEventListener('click', () => {
                        const approvedDate = dateInput.value;
                        if (!approvedDate) {
                            alert('Please select an approved date first!');
                            return;
                        }
                        approveBooking(booking.id, approvedDate);
                    });
                }
                
                if (rejectBtn) {
                    rejectBtn.addEventListener('click', () => rejectBooking(booking.id));
                }
            }
            
            // Delete button for approved/rejected bookings
            if (booking.status === 'approved' || booking.status === 'rejected') {
                const deleteBtn = document.getElementById(`delete-${booking.id}`);
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => deleteBooking(booking.id, booking.clientName));
                }
            }
            
            // WhatsApp button for approved bookings
            if (booking.status === 'approved') {
                const whatsappBtn = document.getElementById(`whatsapp-${booking.id}`);
                if (whatsappBtn) {
                    whatsappBtn.addEventListener('click', () => sendWhatsAppMessage(booking));
                }
            }
        });
        
        // Re-apply current filter after loading
        filterBookings(currentFilter);
        
        updateStats();
    }, (error) => {
        console.error('❌ Error loading bookings:', error);
        bookingsList.innerHTML = `
            <div class="empty-state">
                <h3>❌ Error Loading Bookings</h3>
                <p>${error.message}</p>
            </div>
        `;
    });
}

function createBookingCard(booking) {
    const serviceText = booking.serviceType === 'editing' ? '🎬 Video Editing Only' : '🎥 Videography + Editing';
    const bookingDate = booking.timestamp?.toDate ? booking.timestamp.toDate().toLocaleString() : new Date(booking.timestamp).toLocaleString();
    
    let actionsHTML = '';
    if (booking.status === 'pending') {
        actionsHTML = `
            <div class="booking-actions">
                <div class="date-input-group">
                    <label for="date-${booking.id}">Approved Date:</label>
                    <input type="date" id="date-${booking.id}">
                </div>
                <button id="approve-${booking.id}" class="btn btn-success">✅ Approve</button>
                <button id="reject-${booking.id}" class="btn btn-danger">❌ Reject</button>
            </div>
        `;
    } else if (booking.status === 'approved') {
        actionsHTML = `
            <div class="project-details">
                <strong>✅ Approved Date: ${booking.approvedDate}</strong>
            </div>
            <div class="booking-actions">
                <button id="whatsapp-${booking.id}" class="btn btn-whatsapp">📱 WhatsApp</button>
                <button id="delete-${booking.id}" class="btn btn-danger">🗑️ Delete</button>
            </div>
        `;
    } else if (booking.status === 'rejected') {
        actionsHTML = `
            <div class="booking-actions">
                <button id="delete-${booking.id}" class="btn btn-danger">🗑️ Delete</button>
            </div>
        `;
    }
    
    return `
        <div class="booking-card ${booking.status}">
            <div class="booking-header">
                <h3>${booking.clientName}</h3>
                <span class="booking-status ${booking.status}">${booking.status.toUpperCase()}</span>
            </div>
            
            <div class="booking-info">
                <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">${booking.clientEmail}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">${booking.clientPhone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Service</span>
                    <span class="service-badge">${serviceText}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Price</span>
                    <span class="info-value price-highlight">₹${booking.price || (booking.serviceType === 'editing' ? 150 : 300)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Booked On</span>
                    <span class="info-value">${bookingDate}</span>
                </div>
            </div>
            
            <div class="project-details">
                <strong>Project Details:</strong>
                <p>${booking.projectDetails}</p>
            </div>
            
            ${actionsHTML}
        </div>
    `;
}

async function approveBooking(id, approvedDate) {
    try {
        // Get booking data first
        const bookingDoc = await bookingsRef.doc(id).get();
        const bookingData = bookingDoc.data();
        
        // Calculate price
        const price = bookingData.price || (bookingData.serviceType === 'editing' ? 150 : 300);
        const serviceText = bookingData.serviceType === 'editing' ? 'Video Editing Only' : 'Videography + Editing';
        
        // Update booking status in Firestore
        await bookingsRef.doc(id).update({
            status: 'approved',
            approvedDate: approvedDate,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Send push notification to user
        try {
            await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'booking_approved',
                    clientName: bookingData.clientName,
                    clientEmail: bookingData.clientEmail,
                    clientPhone: bookingData.clientPhone
                })
            });
            console.log('✅ User notification sent');
        } catch (err) {
            console.log('⚠️ Could not send user notification');
        }
        
        // Send WhatsApp message to user 📱
        if (bookingData.clientPhone) {
            const whatsappMessage = `🎉 *DK EDITS - Booking Approved!*\n\n` +
                `Hello *${bookingData.clientName}* ji! 👋\n\n` +
                `✅ Your booking has been *APPROVED*!\n\n` +
                `📋 *Booking Details:*\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `📅 Approved Date: *${approvedDate}*\n` +
                `🎬 Service: *${serviceText}*\n` +
                `💰 Amount: *₹${price}*\n` +
                `━━━━━━━━━━━━━━━━━━\n\n` +
                `🙏 Thank you for choosing DK EDITS!\n` +
                `We will contact you soon for further details.\n\n` +
                `📞 For any queries, feel free to reach out!\n\n` +
                `With love ❤️\n` +
                `*DK EDITS Team*`;
            
            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/91${bookingData.clientPhone}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
        
        alert(`✅ Booking approved! Notification sent to client.`);
        console.log('✅ Booking approved:', id);
    } catch (error) {
        console.error('❌ Error approving booking:', error);
        alert('❌ Error approving booking: ' + error.message);
    }
}

async function rejectBooking(id) {
    if (!confirm('Are you sure you want to reject this booking?')) {
        return;
    }
    
    try {
        // Get booking data first
        const bookingDoc = await bookingsRef.doc(id).get();
        const bookingData = bookingDoc.data();
        
        // Update booking status in Firestore
        await bookingsRef.doc(id).update({
            status: 'rejected',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Send push notification to user
        try {
            await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'booking_rejected',
                    clientName: bookingData.clientName,
                    clientEmail: bookingData.clientEmail,
                    clientPhone: bookingData.clientPhone
                })
            });
            console.log('✅ User notification sent');
        } catch (err) {
            console.log('⚠️ Could not send user notification');
        }
        
        // Send WhatsApp message for rejection too
        if (bookingData.clientPhone) {
            const whatsappMessage = `😔 *DK EDITS - Booking Update*\n\n` +
                `Hello *${bookingData.clientName}* ji,\n\n` +
                `We regret to inform you that your booking request could not be approved at this time.\n\n` +
                `Please feel free to:\n` +
                `• Try booking for a different date\n` +
                `• Contact us for more details\n\n` +
                `We apologize for any inconvenience.\n\n` +
                `With regards,\n` +
                `*DK EDITS Team* ❤️`;
            
            // Open WhatsApp with pre-filled message
            const whatsappUrl = `https://wa.me/91${bookingData.clientPhone}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        }
        
        alert(`❌ Booking rejected. Notification sent to client.`);
        console.log('✅ Booking rejected:', id);
    } catch (error) {
        console.error('❌ Error rejecting booking:', error);
        alert('❌ Error rejecting booking: ' + error.message);
    }
}

function sendNotificationToClient(booking, status) {
    // In production, this would send an actual email/SMS
    const message = status === 'approved' 
        ? `Your booking has been approved for ${booking.approvedDate}! We'll contact you soon.`
        : `Sorry, we couldn't accept your booking request at this time. Please try another date.`;
    
    console.log(`📧 Notification sent to ${booking.clientEmail}:`, message);
    
    // You can integrate with email services like EmailJS, SendGrid, etc.
}

// Delete booking function
async function deleteBooking(id, clientName) {
    if (!confirm(`Are you sure you want to delete booking for "${clientName}"?\n\nThis action cannot be undone!`)) {
        return;
    }
    
    try {
        await bookingsRef.doc(id).delete();
        alert('✅ Booking deleted successfully!');
        console.log('✅ Booking deleted:', id);
        updateStats();
    } catch (error) {
        console.error('❌ Error deleting booking:', error);
        alert('❌ Error deleting booking: ' + error.message);
    }
}

// Send WhatsApp message to approved booking
function sendWhatsAppMessage(booking) {
    const price = booking.price || (booking.serviceType === 'editing' ? 150 : 300);
    const serviceText = booking.serviceType === 'editing' ? 'Video Editing Only' : 'Videography + Editing';
    
    const whatsappMessage = `🎉 *DK EDITS - Reminder*\n\n` +
        `Hello *${booking.clientName}* ji! 👋\n\n` +
        `This is a reminder about your approved booking:\n\n` +
        `📋 *Booking Details:*\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `📅 Approved Date: *${booking.approvedDate}*\n` +
        `🎬 Service: *${serviceText}*\n` +
        `💰 Amount: *₹${price}*\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `📞 For any queries, feel free to reach out!\n\n` +
        `With love ❤️\n` +
        `*DK EDITS Team*`;
    
    const whatsappUrl = `https://wa.me/91${booking.clientPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
}

function updateStats() {
    // Real-time stats from Firestore
    bookingsRef.get().then((snapshot) => {
        const bookings = [];
        snapshot.forEach((doc) => {
            bookings.push(doc.data());
        });
        
        const pending = bookings.filter(b => b.status === 'pending').length;
        const approved = bookings.filter(b => b.status === 'approved').length;
        const rejected = bookings.filter(b => b.status === 'rejected').length;
        
        // Calculate total income from approved bookings
        const totalIncome = bookings
            .filter(b => b.status === 'approved')
            .reduce((sum, b) => {
                const price = b.price || (b.serviceType === 'editing' ? 150 : 300);
                return sum + price;
            }, 0);
        
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('rejectedCount').textContent = rejected;
        document.getElementById('totalIncome').textContent = '₹' + totalIncome.toLocaleString('en-IN');
        document.getElementById('notificationCount').textContent = pending;
        
        // Show/hide notification badge
        const badge = document.getElementById('notificationBadge');
        badge.style.display = pending > 0 ? 'block' : 'none';
    }).catch((error) => {
        console.error('❌ Error updating stats:', error);
    });
}

// Video Management Functions
function loadAdminVideos() {
    const videosList = document.getElementById('videosList');
    videosList.innerHTML = '<div class="loading">⏳ Loading videos...</div>';
    
    // Fetch videos from Firestore with real-time updates
    videosRef.orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        const videos = [];
        snapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (videos.length === 0) {
            videosList.innerHTML = `
                <div class="empty-state">
                    <h3>🎬 No Videos Yet</h3>
                    <p>Click "Add New Video" to add your first video to the portfolio.</p>
                </div>
            `;
            return;
        }
        
        videosList.innerHTML = videos.map(video => createAdminVideoCard(video)).join('');
        
        // Add event listeners
        videos.forEach(video => {
            document.getElementById(`edit-${video.id}`).addEventListener('click', () => editVideo(video.id));
            document.getElementById(`delete-${video.id}`).addEventListener('click', () => deleteVideo(video.id));
        });
    }, (error) => {
        console.error('❌ Error loading videos:', error);
        videosList.innerHTML = `
            <div class="empty-state">
                <h3>❌ Error Loading Videos</h3>
                <p>${error.message}</p>
            </div>
        `;
    });
}

function createAdminVideoCard(video) {
    const thumbnailHTML = video.thumbnailUrl 
        ? `<img src="${video.thumbnailUrl}" alt="${video.title}" class="video-thumbnail">`
        : `<div class="video-thumbnail">🎬</div>`;
    
    return `
        <div class="video-item">
            ${thumbnailHTML}
            <div class="video-item-info">
                <span class="video-category">${video.category}</span>
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <div class="video-item-actions">
                    <button id="edit-${video.id}" class="btn btn-edit">Edit</button>
                    <button id="delete-${video.id}" class="btn btn-delete">Delete</button>
                    <a href="${video.instagramUrl}" target="_blank" class="btn btn-view">View</a>
                </div>
            </div>
        </div>
    `;
}

function editVideo(id) {
    // Fetch video from Firestore
    videosRef.doc(id).get().then((doc) => {
        if (doc.exists) {
            const video = doc.data();
            document.getElementById('videoModalTitle').textContent = 'Edit Video';
            document.getElementById('videoId').value = id;
            document.getElementById('videoTitle').value = video.title;
            document.getElementById('videoDescription').value = video.description;
            document.getElementById('instagramUrl').value = video.instagramUrl;
            document.getElementById('thumbnailUrl').value = video.thumbnailUrl || '';
            document.getElementById('videoCategory').value = video.category;
            
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }).catch((error) => {
        console.error('❌ Error fetching video:', error);
        alert('❌ Error loading video: ' + error.message);
    });
}

function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) {
        return;
    }
    
    // Delete from Firestore
    videosRef.doc(id).delete().then(() => {
        alert('✅ Video deleted successfully!');
        console.log('✅ Video deleted:', id);
    }).catch((error) => {
        console.error('❌ Error deleting video:', error);
        alert('❌ Error deleting video: ' + error.message);
    });
}

function showDashboard() {
    // Show bookings by default
    document.getElementById('videoManagementSection').style.display = 'none';
    document.getElementById('bookingManagementSection').style.display = 'block';
    loadBookings();
    updateStats();
}

console.log('✅ Admin panel loaded with Firebase backend!');
