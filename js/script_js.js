// js/script.js

// Global variables
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let currentRating = 0;
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Navigation functionality
    setupNavigation();
    
    // Review functionality
    setupReviews();
    
    // Booking functionality
    setupBooking();
    
    // Back to top functionality
    setupBackToTop();
    
    // Load existing reviews
    displayReviews();
    
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
}

// Navigation Setup
function setupNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Reviews Setup
function setupReviews() {
    const leaveReviewBtn = document.getElementById('leave-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeBtn = reviewModal.querySelector('.close');
    const reviewForm = document.getElementById('review-form');
    const starRating = document.getElementById('star-rating');
    
    // Open review modal
    leaveReviewBtn.addEventListener('click', function() {
        reviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Close review modal
    closeBtn.addEventListener('click', function() {
        closeModal(reviewModal);
    });
    
    // Close modal when clicking outside
    reviewModal.addEventListener('click', function(e) {
        if (e.target === reviewModal) {
            closeModal(reviewModal);
        }
    });
    
    // Star rating functionality
    const stars = starRating.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            updateStarDisplay(stars, currentRating);
        });
        
        star.addEventListener('mouseenter', function() {
            updateStarDisplay(stars, index + 1);
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        updateStarDisplay(stars, currentRating);
    });
    
    // Review form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });
}

function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitReview() {
    const reviewText = document.getElementById('review-text').value;
    const reviewerName = document.getElementById('reviewer-name').value;
    
    if (currentRating === 0) {
        alert('Please select a star rating');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        rating: currentRating,
        text: reviewText,
        name: reviewerName,
        date: new Date().toLocaleDateString()
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    displayReviews();
    closeModal(document.getElementById('review-modal'));
    
    // Reset form
    document.getElementById('review-form').reset();
    currentRating = 0;
    updateStarDisplay(document.querySelectorAll('.star'), 0);
    
    // Show success message
    showNotification('Thank you for your review!');
}

function displayReviews() {
    const reviewsContainer = document.getElementById('reviews-container');
    
    if (reviews.length === 0) {
        // Show placeholder review
        reviewsContainer.innerHTML = `
            <div class="review-card">
                <div class="stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <p>"Tell me how I did as your personal finance coach!"</p>
                <div class="reviewer">- Future Client</div>
            </div>
        `;
    } else {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="stars">
                    ${generateStars(review.rating)}
                </div>
                <p>"${review.text}"</p>
                <div class="reviewer">- ${review.name}</div>
            </div>
        `).join('');
    }
}

function generateStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    return starsHTML;
}

// Booking Setup
function setupBooking() {
    const bookBtn = document.getElementById('book-consultation');
    const calendarModal = document.getElementById('calendar-modal');
    const timeModal = document.getElementById('time-modal');
    const infoModal = document.getElementById('info-modal');
    
    // Setup calendar modal
    const calendarCloseBtn = calendarModal.querySelector('.close');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    // Setup time modal
    const timeCloseBtn = timeModal.querySelector('.close');
    const backToCalendarBtn = document.getElementById('back-to-calendar');
    
    // Setup info modal
    const infoCloseBtn = infoModal.querySelector('.close');
    const backToTimeBtn = document.getElementById('back-to-time');
    const consultationForm = document.getElementById('consultation-form');
    
    // Open calendar modal
    bookBtn.addEventListener('click', function() {
        calendarModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        generateCalendar();
    });
    
    // Calendar modal event listeners
    calendarCloseBtn.addEventListener('click', function() {
        closeModal(calendarModal);
    });
    
    calendarModal.addEventListener('click', function(e) {
        if (e.target === calendarModal) {
            closeModal(calendarModal);
        }
    });
    
    prevMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar();
    });
    
    // Time modal event listeners
    timeCloseBtn.addEventListener('click', function() {
        closeModal(timeModal);
    });
    
    timeModal.addEventListener('click', function(e) {
        if (e.target === timeModal) {
            closeModal(timeModal);
        }
    });
    
    backToCalendarBtn.addEventListener('click', function() {
        timeModal.style.display = 'none';
        calendarModal.style.display = 'block';
    });
    
    // Info modal event listeners
    infoCloseBtn.addEventListener('click', function() {
        closeModal(infoModal);
    });
    
    infoModal.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            closeModal(infoModal);
        }
    });
    
    backToTimeBtn.addEventListener('click', function() {
        infoModal.style.display = 'none';
        timeModal.style.display = 'block';
    });
    
    // Consultation form submission
    consultationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitConsultation();
    });
}

function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthDisplay = document.getElementById('current-month');
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Display current month and year
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthDisplay.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous calendar
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.classList.add('day-header');
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'other-month');
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        
        const currentDateCheck = new Date(year, month, day);
        
        // Disable past dates
        if (currentDateCheck < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        } else {
            // Make future dates clickable
            dayElement.addEventListener('click', function() {
                if (!dayElement.classList.contains('disabled')) {
                    selectDate(year, month, day);
                }
            });
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    
    // Update visual selection
    document.querySelectorAll('.calendar-day').forEach(dayEl => {
        dayEl.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Close calendar modal and open time modal
    document.getElementById('calendar-modal').style.display = 'none';
    document.getElementById('time-modal').style.display = 'block';
    
    // Update selected date display
    document.getElementById('selected-date-display').textContent = 
        selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    
    generateTimeSlots();
}

function generateTimeSlots() {
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '';
    
    // Available time slots (you can customize these)
    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', 
        '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
    ];
    
    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.classList.add('time-slot');
        timeSlot.textContent = time;
        
        timeSlot.addEventListener('click', function() {
            selectTime(time);
        });
        
        timeGrid.appendChild(timeSlot);
    });
}

function selectTime(time) {
    selectedTime = time;
    
    // Update visual selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.target.classList.add('selected');
    
    // Close time modal and open info modal
    document.getElementById('time-modal').style.display = 'none';
    document.getElementById('info-modal').style.display = 'block';
    
    // Update booking summary
    document.getElementById('booking-summary').textContent = 
        `${selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        })} at ${selectedTime}`;
}

// FIXED BOOKING FUNCTIONS - Replace your submitConsultation function with these
async function submitConsultation() {
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    // Validate required fields
    if (!firstName || !lastName || !phone || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (!selectedDate || !selectedTime) {
        alert('Please select a date and time');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validate phone format (basic validation)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number (e.g., 123-456-7890)');
        return;
    }
    
    try {
        await submitConsultationToAirtable(firstName, lastName, phone, email);
    } catch (error) {
        console.error('Error submitting consultation:', error);
        alert('Sorry, there was an error booking your consultation. Please try again or contact Matt directly at MattJEllis1@gmail.com');
    }
}

async function submitConsultationToAirtable(firstName, lastName, phone, email) {
    // Show loading state
    const submitButton = document.querySelector('#consultation-form button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Booking...';
    submitButton.disabled = true;
    
    try {
        // SECURITY WARNING: Move these to environment variables or server-side
        const AIRTABLE_API_KEY = 'patpEYivrHvjOwZsx.4218ff65d618c439f2e4eaa32751f48ef9c18c659eadcc2e8fd865eba51edd82';
        const AIRTABLE_BASE_ID = 'appBOTwiMUBKhnaw6';
        const AIRTABLE_TABLE_NAME = 'Consultations'; // Make sure this matches your table name exactly
        
        // Prepare data for Airtable - make sure field names match your Airtable exactly
        const consultationData = {
            "First Name": firstName,
            "Last Name": lastName,
            "Phone": phone,
            "Email": email,
            "Consultation Date": selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
            "Consultation Time": selectedTime,
            "Status": "Pending Confirmation",
            "Booking Date": new Date().toISOString().split('T')[0]
        };
        
        console.log('Sending data to Airtable:', consultationData); // Debug log
        
        // Send to Airtable
        const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: [{
                    fields: consultationData
                }]
            })
        });
        
        console.log('Airtable response status:', response.status); // Debug log
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Airtable API Error:', errorData);
            
            // More specific error handling
            if (response.status === 401) {
                throw new Error('Invalid API key or authentication failed');
            } else if (response.status === 404) {
                throw new Error('Base or table not found. Check your Base ID and Table name');
            } else if (response.status === 422) {
                throw new Error('Invalid field names or data format. Check your Airtable field names');
            } else {
                throw new Error(`Airtable API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }
        }
        
        const result = await response.json();
        console.log('Successfully saved to Airtable:', result);
        
        // Store booking locally as backup
        const bookingData = {
            date: selectedDate.toISOString(),
            time: selectedTime,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            timestamp: new Date().toISOString(),
            airtableId: result.records[0].id
        };
        
        // Store in localStorage as backup
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push(bookingData);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Close modal and reset form
        closeModal(document.getElementById('info-modal'));
        document.getElementById('consultation-form').reset();
        selectedDate = null;
        selectedTime = null;
        
        // Show success notification
        showNotification('Consultation booked successfully! Matt will contact you to confirm your appointment.');
        
    } catch (error) {
        console.error('Error booking consultation:', error);
        // Re-throw the error so the calling function can handle it
        throw error;
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Test function to verify Airtable connection
async function testAirtableConnection() {
    const AIRTABLE_API_KEY = 'patpEYivrHvjOwZsx.4218ff65d618c439f2e4eaa32751f48ef9c18c659eadcc2e8fd865eba51edd82';
    const AIRTABLE_BASE_ID = 'appBOTwiMUBKhnaw6';
    
    try {
        // First, let's get the base schema to see what tables exist
        const response = await fetch(`https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Available tables:', data.tables.map(t => t.name));
            return data.tables;
        } else {
            console.error('Error fetching base info:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Connection test failed:', error);
        return null;
    }
}
// Optional email notification function
async function sendEmailNotification(data) {
    try {
        console.log('Email notification would be sent for:', data);
        // Email implementation would go here
    } catch (error) {
        console.error('Failed to send email notification:', error);
    }
}

// Back to Top Setup
function setupBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility Functions
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--huntington-green);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}
