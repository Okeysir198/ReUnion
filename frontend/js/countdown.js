// Countdown Timer for Reunion Website

// Set the reunion date - July 25, 2025
const reunionDate = new Date('July 4, 2025 18:00:00').getTime();

// Update the countdown every second
const countdownTimer = setInterval(function() {
    // Get today's date and time
    const now = new Date().getTime();
    
    // Find the distance between now and the reunion date
    const distance = reunionDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Display the results
    document.getElementById('days').textContent = formatTime(days);
    document.getElementById('hours').textContent = formatTime(hours);
    document.getElementById('minutes').textContent = formatTime(minutes);
    document.getElementById('seconds').textContent = formatTime(seconds);
    
    // If the countdown is finished, display a message
    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "<h3>Hội ngộ đã bắt đầu!</h3>";
    }
}, 1000);

// Add leading zero to numbers less than 10
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}