// Admin credentials (In production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'Durgesh@01'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    showDashboard();
});

// Logout Handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'index.html';
    }
});

// Section Toggle Handlers
document.getElementById('manageVideosBtn').addEventListener('click', () => {
    document.getElementById('videoManagementSection').style.display = 'block';
    document.getElementById('bookingManagementSection').style.display = 'none';
    loadAdminVideos();
});

document.getElementById('manageBookingsBtn').addEventListener('click', () => {
    document.getElementById('videoManagementSection').style.display = 'none';
    document.getElementById('bookingManagementSection').style.display = 'block';
    loadBookings();
    updateStats();
});

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
        });
        
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

function approveBooking(id, approvedDate) {
    // Update booking status in Firestore
    bookingsRef.doc(id).update({
        status: 'approved',
        approvedDate: approvedDate,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert(`✅ Booking approved! Notification sent to client.`);
        console.log('✅ Booking approved:', id);
    }).catch((error) => {
        console.error('❌ Error approving booking:', error);
        alert('❌ Error approving booking: ' + error.message);
    });
}

function rejectBooking(id) {
    if (!confirm('Are you sure you want to reject this booking?')) {
        return;
    }
    
    // Update booking status in Firestore
    bookingsRef.doc(id).update({
        status: 'rejected',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert(`❌ Booking rejected. Notification sent to client.`);
        console.log('✅ Booking rejected:', id);
    }).catch((error) => {
        console.error('❌ Error rejecting booking:', error);
        alert('❌ Error rejecting booking: ' + error.message);
    });
}

function sendNotificationToClient(booking, status) {
    // In production, this would send an actual email/SMS
    const message = status === 'approved' 
        ? `Your booking has been approved for ${booking.approvedDate}! We'll contact you soon.`
        : `Sorry, we couldn't accept your booking request at this time. Please try another date.`;
    
    console.log(`📧 Notification sent to ${booking.clientEmail}:`, message);
    
    // You can integrate with email services like EmailJS, SendGrid, etc.
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
        
        document.getElementById('pendingCount').textContent = pending;
        document.getElementById('approvedCount').textContent = approved;
        document.getElementById('rejectedCount').textContent = rejected;
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
