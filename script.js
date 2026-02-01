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
});

closeModal.addEventListener('click', () => {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

notificationBtn.addEventListener('click', () => {
    notificationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('searchEmail').value = '';
    document.getElementById('userBookingsList').innerHTML = '';
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

// Booking Form Handler
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = '⏳ Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = {
            clientName: document.getElementById('clientName').value,
            clientEmail: document.getElementById('clientEmail').value,
            clientPhone: document.getElementById('clientPhone').value,
            serviceType: document.getElementById('serviceType').value,
            projectDetails: document.getElementById('projectDetails').value,
            status: 'pending',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            approvedDate: null
        };
        
        // Save to Firestore
        await bookingsRef.add(formData);
        
        // Save user's email for quick access
        localStorage.setItem('lastBookingEmail', formData.clientEmail);
        
        // Show success message
        formMessage.className = 'form-message success';
        formMessage.textContent = '✅ Booking submitted successfully! Check notifications (🔔) to track your booking status.';
        formMessage.style.display = 'block';
        
        // Reset form
        bookingForm.reset();
        
        // Close modal after 3 seconds
        setTimeout(() => {
            bookingModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            formMessage.style.display = 'none';
        }, 3000);
        
        console.log('📩 New booking submitted to Firestore');
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

// Search user bookings from Firebase
function searchUserBookings() {
    const email = document.getElementById('searchEmail').value.trim().toLowerCase();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    const listContainer = document.getElementById('userBookingsList');
    listContainer.innerHTML = '<div class="loading">⏳ Loading your bookings...</div>';
    
    // Query Firebase for user's bookings
    bookingsRef.where('clientEmail', '==', email)
        .orderBy('timestamp', 'desc')
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
            
            listContainer.innerHTML = userBookings.map(booking => createUserBookingCard(booking)).join('');
        })
        .catch((error) => {
            console.error('❌ Error fetching bookings:', error);
            listContainer.innerHTML = `
                <div class="no-bookings">
                    <h3>❌ Error</h3>
                    <p>${error.message}</p>
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
// Check for new notifications from Firebase
function checkNotifications() {
    const lastEmail = localStorage.getItem('lastBookingEmail');
    if (!lastEmail) return;
    
    // Query Firebase for user's updated bookings
    bookingsRef
        .where('clientEmail', '==', lastEmail.toLowerCase())
        .where('status', 'in', ['approved', 'rejected'])
        .get()
        .then((snapshot) => {
            const notificationDot = document.getElementById('notificationDot');
            if (!snapshot.empty) {
                notificationDot.style.display = 'block';
            } else {
                notificationDot.style.display = 'none';
            }
        })
        .catch((error) => {
            console.error('❌ Error checking notifications:', error);
        });
}

// Check notifications on page load
document.addEventListener('DOMContentLoaded', () => {
    loadVideosFromFirebase();
    
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

