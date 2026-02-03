// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = menuToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Modal functionality
const bookNowBtn = document.getElementById('bookNowBtn');
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const notificationBtn = document.getElementById('notificationBtn');
const notificationModal = document.getElementById('notificationModal');
const closeNotificationModal = document.getElementById('closeNotificationModal');

bookNowBtn.addEventListener('click', () => {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Auto-fill name and phone from login data
    const loggedInName = localStorage.getItem('dkEditsUserName');
    const loggedInMobile = localStorage.getItem('dkEditsUserMobile');
    
    if (loggedInName) {
        const nameField = document.getElementById('clientName');
        if (nameField) {
            nameField.value = loggedInName;
            nameField.readOnly = true;
            nameField.style.background = '#f0f9ff';
            nameField.style.cursor = 'not-allowed';
        }
    }
    
    if (loggedInMobile) {
        const phoneField = document.getElementById('clientPhone');
        if (phoneField) {
            phoneField.value = loggedInMobile;
            phoneField.readOnly = true;
            phoneField.style.background = '#f0f9ff';
            phoneField.style.cursor = 'not-allowed';
        }
    }
});

closeModal.addEventListener('click', () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

notificationBtn.addEventListener('click', () => {
    notificationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Get logged in user info
    const userName = localStorage.getItem('dkEditsUserName') || 'User';
    const userMobile = localStorage.getItem('dkEditsUserMobile') || '';
    
    // Show user welcome info
    const welcomeNameEl = document.getElementById('welcomeUserName');
    const welcomeMobileEl = document.getElementById('welcomeUserMobile');
    if (welcomeNameEl) welcomeNameEl.textContent = userName;
    if (welcomeMobileEl) welcomeMobileEl.textContent = userMobile;
    
    // Auto-load bookings for this user
    if (userMobile) {
        loadUserBookingsByMobile(userMobile);
    } else {
        document.getElementById('userBookingsList').innerHTML = `
            <div class="no-bookings">
                <h3>❌ Login Required</h3>
                <p>Please login with your name and mobile to see your bookings.</p>
            </div>
        `;
    }
});

closeNotificationModal.addEventListener('click', () => {
    notificationModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        bookingModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

notificationModal.addEventListener('click', (e) => {
    if (e.target === notificationModal) {
        notificationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (bookingModal.classList.contains('active')) {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (notificationModal.classList.contains('active')) {
            notificationModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections except hero
const sections = document.querySelectorAll('section:not(.hero)');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add animation to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    observer.observe(card);
});

// Add animation to skill items
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    
    observer.observe(item);
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--primary-color)';
        }
    });
});

// Service Prices
const PRICES = {
    editing: 150,
    videography_editing: 300
};

// Update Price Display
function updatePrice() {
    const serviceType = document.getElementById('serviceType').value;
    const priceDisplay = document.getElementById('priceDisplay');
    const priceAmount = document.getElementById('priceAmount');
    
    if (serviceType && PRICES[serviceType]) {
        priceDisplay.style.display = 'flex';
        priceAmount.textContent = '₹' + PRICES[serviceType];
    } else {
        priceDisplay.style.display = 'none';
    }
}

// Booking Form Handler
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Submitting...';
    submitBtn.disabled = true;
    
    const serviceType = document.getElementById('serviceType').value;
    const price = PRICES[serviceType] || 0;
    
    try {
        // Get form data - use login name and mobile
        const loggedInName = localStorage.getItem('dkEditsUserName') || '';
        const loggedInMobile = localStorage.getItem('dkEditsUserMobile') || '';
        
        const formData = {
            clientName: loggedInName || document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: loggedInMobile || document.getElementById('clientPhone').value,
            serviceType: document.getElementById('serviceType').value,
            projectDetails: document.getElementById('projectDetails').value,
            price: price,
            status: 'pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            approvedDate: null
        };
        
        // Save to Firestore
        await bookingsRef.add(formData);
        
        // Tag user with mobile for push notifications and save subscription ID
        if (typeof OneSignal !== 'undefined') {
            try {
                // Get subscription ID
                const subscriptionId = await OneSignal.User.PushSubscription.id;
                if (subscriptionId) {
                    localStorage.setItem('onesignal_subscription_id', subscriptionId);
                    console.log('✅ Subscription ID:', subscriptionId);
                }
                
                // Tag user
                await OneSignal.User.addTag("mobile", formData.clientPhone);
                await OneSignal.User.addTag("role", "user");
                await OneSignal.User.addTag("name", formData.clientName);
                console.log('✅ User tagged for notifications:', formData.clientPhone);
            } catch (err) {
                console.log('⚠️ Could not tag user for notifications:', err);
            }
        }
        
        // Send push notification to admin
        try {
            await fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'new_booking',
                    clientName: formData.clientName,
                    clientEmail: formData.clientEmail,
                    clientPhone: formData.clientPhone,
                    servicetype: formData.serviceType === 'editing' ? 'Video Editing' : 'Videography + Editing'
                })
            });
            console.log('✅ Admin notification sent');
        } catch (err) {
            console.log('⚠️ Could not send admin notification');
        }
        
        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = '✅ Booking submitted successfully! Total: ₹' + price + '. Check notifications (🔔) to track your booking status.';
        formMessage.style.display = 'block';
        
        // Reset form and hide price
        bookingForm.reset();
        document.getElementById('priceDisplay').style.display = 'none';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            formMessage.style.display = 'none';
        }, 3000);
        
        console.log('📩 New booking submitted to Firestore with price:', price);
    } catch (error) {
        console.error('❌ Error submitting booking:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = '❌ Error submitting booking: ' + error.message;
        formMessage.style.display = 'block';
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Load user bookings by mobile number (auto-load)
function loadUserBookingsByMobile(mobile) {
    const listContainer = document.getElementById('userBookingsList');
    listContainer.innerHTML = '<div class="loading">⏳ Loading your bookings...</div>';
    
    // Query Firebase for user's bookings by phone number
    bookingsRef.where('clientPhone', '==', mobile)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                listContainer.innerHTML = `
                    <div class="no-bookings">
                        <h3>📭 No Bookings Yet</h3>
                        <p>You haven't made any bookings yet. Click "Book Now" to get started!</p>
                    </div>
                `;
                return;
            }
            
            const userBookings = [];
            snapshot.forEach((doc) => {
                userBookings.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Sort bookings by timestamp on client side (newest first)
            userBookings.sort((a, b) => {
                const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
                const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
                return dateB - dateA;
            });
            
            listContainer.innerHTML = userBookings.map(booking => createUserBookingCard(booking)).join('');
        })
        .catch((error) => {
            console.error('❌ Error fetching bookings:', error);
            listContainer.innerHTML = `
                <div class="no-bookings">
                    <h3>❌ Error</h3>
                    <p>Unable to load bookings. Please try again.</p>
                </div>
            `;
        });
}

// Legacy function for email search (kept for backward compatibility)
function searchUserBookings() {
    const email = document.getElementById('searchEmail')?.value?.trim()?.toLowerCase();
    
    if (!email) {
        // Try loading by mobile instead
        const userMobile = localStorage.getItem('dkEditsUserMobile');
        if (userMobile) {
            loadUserBookingsByMobile(userMobile);
        } else {
            alert('Please login to see your bookings');
        }
        return;
    }
    
    const listContainer = document.getElementById('userBookingsList');
    listContainer.innerHTML = '<div class="loading">⏳ Loading your bookings...</div>';
    
    // Query Firebase for user's bookings
    bookingsRef.where('clientEmail', '==', email)
        .get()
        .then((snapshot) => {
            if (snapshot.empty) {
                listContainer.innerHTML = `
                    <div class="no-bookings">
                        <h3>📭 No Bookings Found</h3>
                        <p>No bookings found for ${email}</p>
                    </div>
                `;
                return;
            }
            
            const userBookings = [];
            snapshot.forEach((doc) => {
                userBookings.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            // Sort bookings by timestamp on client side (newest first)
            userBookings.sort((a, b) => {
                const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
                const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
                return dateB - dateA;
            });
            
            listContainer.innerHTML = userBookings.map(booking => createUserBookingCard(booking)).join('');
        })
        .catch((error) => {
            console.error('❌ Error fetching bookings:', error);
            listContainer.innerHTML = `
                <div class="no-bookings">
                    <h3>❌ Error</h3>
                    <p>Unable to load bookings. Please try again.</p>
                </div>
            `;
        });
}

function createUserBookingCard(booking) {
    const serviceText = booking.serviceType === 'editing' ? '🎬 Video Editing Only' : '🎥 Videography + Editing';
    const bookingDate = booking.timestamp?.toDate ? booking.timestamp.toDate().toLocaleDateString() : new Date(booking.timestamp).toLocaleDateString();
    
    let statusHTML = `<span class="booking-status-badge ${booking.status}">${booking.status.toUpperCase()}</span>`;
    
    let approvedDateHTML = '';
    if (booking.status === 'approved' && booking.approvedDate) {
        approvedDateHTML = `
            <div class="approved-date-highlight">
                ✅ APPROVED FOR: ${booking.approvedDate}
            </div>
        `;
    } else if (booking.status === 'rejected') {
        approvedDateHTML = `
            <div style="background: #fee2e2; color: #991b1b; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 600; margin-top: 1rem;">
                ❌ Sorry, this booking was not approved. Please try another time.
            </div>
        `;
    } else {
        approvedDateHTML = `
            <div style="background: #fef3c7; color: #92400e; padding: 1rem; border-radius: 8px; text-align: center; font-weight: 600; margin-top: 1rem;">
                ⏳ Waiting for approval...
            </div>
        `;
    }
    
    return `
        <div class="user-booking-card ${booking.status}">
            ${statusHTML}
            <div class="booking-detail">
                <span class="booking-detail-label">Service</span>
                <span class="booking-detail-value">${serviceText}</span>
            </div>
            <div class="booking-detail">
                <span class="booking-detail-label">Booked On</span>
                <span class="booking-detail-value">${bookingDate}</span>
            </div>
            <div class="booking-detail">
                <span class="booking-detail-label">Project Details</span>
                <span class="booking-detail-value">${booking.projectDetails}</span>
            </div>
            ${approvedDateHTML}
        </div>
    `;
}

// Check for notifications
// Real-time listener for notifications from Firebase
function setupNotificationListener() {
    const userMobile = localStorage.getItem('dkEditsUserMobile');
    if (!userMobile) return;
    
    // Real-time listener for user's bookings by mobile
    bookingsRef
        .where('clientPhone', '==', userMobile)
        .onSnapshot((snapshot) => {
            const notificationDot = document.getElementById('notificationDot');
            let hasUpdates = false;
            
            snapshot.forEach((doc) => {
                const booking = doc.data();
                if (booking.status === 'approved' || booking.status === 'rejected') {
                    hasUpdates = true;
                }
            });
            
            if (hasUpdates) {
                notificationDot.style.display = 'block';
                // Show browser notification if permission granted
                showBrowserNotification();
            } else {
                notificationDot.style.display = 'none';
            }
        }, (error) => {
            console.error('❌ Error checking notifications:', error);
        });
}

// Browser Push Notification
function showBrowserNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('DK EDITS - Booking Update! 🎬', {
            body: 'Your booking status has been updated. Click to check!',
            icon: 'icons/icon-192x192.png',
            badge: 'icons/icon-72x72.png'
        });
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Check notifications on page load
document.addEventListener('DOMContentLoaded', () => {
    loadVideosFromFirebase();
    setupNotificationListener();
    requestNotificationPermission();
    
    // Auto-fill email if exists
    const lastEmail = localStorage.getItem('lastBookingEmail');
    if (lastEmail) {
        document.getElementById('searchEmail').value = lastEmail;
    }
});

// Load Videos from Firebase with real-time updates
function loadVideosFromFirebase() {
    const videoPortfolio = document.getElementById('videoPortfolio');
    const emptyPortfolio = document.getElementById('emptyPortfolio');
    
    // Real-time listener for videos
    videosRef.orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        const videos = [];
        snapshot.forEach((doc) => {
            videos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        if (videos.length === 0) {
            videoPortfolio.style.display = 'none';
            emptyPortfolio.style.display = 'block';
            return;
        }
        
        videoPortfolio.style.display = 'grid';
        emptyPortfolio.style.display = 'none';
        
        videoPortfolio.innerHTML = videos.map(video => createVideoCard(video)).join('');
    }, (error) => {
        console.error('❌ Error loading videos:', error);
        videoPortfolio.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>❌ Error Loading Videos</h3>
                <p>${error.message}</p>
            </div>
        `;
    });
}

// Load Videos on Portfolio Page (Deprecated - using Firebase now)
function loadVideos() {
    loadVideosFromFirebase();
}

function createVideoCard(video) {
    const thumbnailHTML = video.thumbnailUrl 
        ? `<img src="${video.thumbnailUrl}" alt="${video.title}">`
        : `<div class="project-placeholder">🎬</div>`;
    
    return `
        <div class="project-card">
            <div class="project-image">
                ${thumbnailHTML}
                <div class="play-overlay">
                    <div class="play-icon">▶</div>
                </div>
            </div>
            <div class="project-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <a href="${video.instagramUrl}" target="_blank" class="view-on-instagram">
                    📸 View on Instagram
                </a>
            </div>
        </div>
    `;
}

// Remove localStorage video functions - now using Firebase
// function getVideos() - removed

console.log('✅ Portfolio loaded successfully with Firebase backend! 🚀');

