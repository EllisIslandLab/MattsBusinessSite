// Copy the entire BookingSystem class from the original artifact
// Plus add this initialization function:

function initializeBookingSystem() {
    // Only initialize if not already done
    if (window.bookingSystemInstance) {
        return;
    }
    
    // Wait a moment for DOM to be ready
    setTimeout(function() {
        window.bookingSystemInstance = new BookingSystem();
        
        // Add close functionality
        const closeBtn = document.getElementById('closeBooking');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeBookingSystem();
            });
        }
    }, 100);
}

function closeBookingSystem() {
    const container = document.getElementById('booking-container');
    container.classList.remove('show');
    
    // Clean up the instance
    window.bookingSystemInstance = null;
}

document.getElementById('booking-container').addEventListener('click', function(e) {
    if (e.target === this) {
        closeBookingSystem();
    }
});
