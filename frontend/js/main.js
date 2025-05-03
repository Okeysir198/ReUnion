// Main JavaScript for Reunion Website

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the navbar height to offset scrolling
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // FAQ accordion
    const questions = document.querySelectorAll('.question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
    
    // Initialize map if map element exists
    if (document.getElementById('map')) {
        initMap();
    }
    
    // Initialize classmate map if element exists
    if (document.getElementById('classmate-map')) {
        initClassmateMap();
    }
    
    // Initialize career chart if element exists
    if (document.querySelector('.career-chart')) {
        initCareerChart();
    }
    
    // Load photo gallery images
    loadPhotoGallery();
    
    // Load classmate spotlights
    loadClassmateSpotlights();
    
    // Handle form submissions
    setupFormSubmissions();
});

// Initialize venue map
function initMap() {
    // Create a map centered at venue location
    const venueLocation = [40.7128, -74.0060]; // Replace with actual venue coordinates
    const map = L.map('map').setView(venueLocation, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for venue
    L.marker(venueLocation)
        .addTo(map)
        .bindPopup('Grand Central Hotel<br>123 Main Street')
        .openPopup();
}

// Initialize world map showing classmate locations
function initClassmateMap() {
    // Create a map centered at school location
    const schoolLocation = [40.7128, -74.0060]; // Replace with actual school coordinates
    const map = L.map('classmate-map').setView(schoolLocation, 2);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Sample classmate locations - would be loaded from backend in production
    const classmateLocations = [
        { name: "Sarah Johnson", location: [34.0522, -118.2437], city: "Los Angeles" },
        { name: "Mike Peterson", location: [40.7128, -74.0060], city: "New York" },
        { name: "Jessica Lee", location: [51.5074, -0.1278], city: "London" },
        { name: "David Smith", location: [35.6762, 139.6503], city: "Tokyo" },
        { name: "Lisa Wong", location: [-33.8688, 151.2093], city: "Sydney" }
    ];
    
    // Add markers for each classmate
    classmateLocations.forEach(classmate => {
        L.marker(classmate.location)
            .addTo(map)
            .bindPopup(`<b>${classmate.name}</b><br>${classmate.city}`);
    });
}

// Initialize career fields chart
function initCareerChart() {
    // Sample career data - would be loaded from backend in production
    const careerData = {
        labels: ['Education', 'Healthcare', 'Technology', 'Business', 'Arts', 'Other'],
        datasets: [{
            label: 'Classmates by Career Field',
            data: [15, 20, 25, 18, 8, 14],
            backgroundColor: [
                '#3b5998',
                '#4c6db9',
                '#5d81da',
                '#6e95fb',
                '#7fa8ff',
                '#90bcff'
            ],
            borderWidth: 1
        }]
    };
    
    // Get the canvas element
    const ctx = document.querySelector('.career-chart').getContext('2d');
    
    // Create the chart
    new Chart(ctx, {
        type: 'pie',
        data: careerData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Class of 2005 Career Fields'
                }
            }
        }
    });
}

// Load photo gallery images
function loadPhotoGallery() {
    // Sample image data - would be loaded from backend in production
    const galleryImages = [
        { src: 'https://via.placeholder.com/300x200?text=Graduation+Day', alt: 'Graduation Day' },
        { src: 'https://via.placeholder.com/300x200?text=Senior+Prom', alt: 'Senior Prom' },
        { src: 'https://via.placeholder.com/300x200?text=Football+Game', alt: 'Football Game' },
        { src: 'https://via.placeholder.com/300x200?text=School+Trip', alt: 'School Trip' },
        { src: 'https://via.placeholder.com/300x200?text=Yearbook+Photo', alt: 'Yearbook Photo' },
        { src: 'https://via.placeholder.com/300x200?text=Spirit+Week', alt: 'Spirit Week' }
    ];
    
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (galleryContainer) {
        galleryImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            
            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
        });
    }
}

// Load classmate spotlights
function loadClassmateSpotlights() {
    // Sample spotlight data - would be loaded from backend in production
    const spotlights = [
        {
            name: 'Sarah Johnson',
            image: 'https://via.placeholder.com/100x100?text=SJ',
            location: 'Los Angeles, CA',
            career: 'School Principal',
            bio: 'After graduating from UC Berkeley, Sarah became a teacher and recently was promoted to principal at Lincoln Elementary.'
        },
        {
            name: 'Mike Peterson',
            image: 'https://via.placeholder.com/100x100?text=MP',
            location: 'New York, NY',
            career: 'Software Engineer',
            bio: 'Mike founded a successful tech startup after graduating from MIT and now works as a senior developer at Google.'
        },
        {
            name: 'Jessica Lee',
            image: 'https://via.placeholder.com/100x100?text=JL',
            location: 'London, UK',
            career: 'Journalist',
            bio: 'Jessica has traveled to over 50 countries as an international correspondent for the BBC, covering major world events.'
        }
    ];
    
    const spotlightContainer = document.querySelector('.spotlight-container');
    
    if (spotlightContainer) {
        spotlights.forEach(spotlight => {
            const spotlightItem = document.createElement('div');
            spotlightItem.className = 'spotlight-item';
            
            spotlightItem.innerHTML = `
                <img src="${spotlight.image}" alt="${spotlight.name}">
                <h4>${spotlight.name}</h4>
                <p><strong>Location:</strong> ${spotlight.location}</p>
                <p><strong>Career:</strong> ${spotlight.career}</p>
                <p>${spotlight.bio}</p>
            `;
            
            spotlightContainer.appendChild(spotlightItem);
        });
    }
}

// Setup form submissions
function setupFormSubmissions() {
    // Registration form
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(registrationForm);
            const formObject = Object.fromEntries(formData.entries());
            
            try {
                // This would send data to the backend in production
                // const response = await fetch('/api/register', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(formObject),
                // });
                
                // For demo purposes, just log the data and show success message
                console.log('Registration data:', formObject);
                alert('Registration submitted successfully! Check your email for confirmation.');
                registrationForm.reset();
            } catch (error) {
                console.error('Error submitting registration:', error);
                alert('There was an error processing your registration. Please try again.');
            }
        });
    }
    
    // Photo submission form
    const photoForm = document.getElementById('photo-form');
    if (photoForm) {
        photoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get file input
            const fileInput = document.getElementById('photo-upload');
            const files = fileInput.files;
            
            if (files.length === 0) {
                alert('Please select at least one photo to upload.');
                return;
            }
            
            try {
                // This would send files to the backend in production
                // const formData = new FormData();
                // for (let i = 0; i < files.length; i++) {
                //     formData.append('photos', files[i]);
                // }
                // 
                // const response = await fetch('/api/upload-photos', {
                //     method: 'POST',
                //     body: formData,
                // });
                
                // For demo purposes, just log the files and show success message
                console.log('Photo upload:', files);
                alert(`${files.length} photo(s) uploaded successfully!`);
                photoForm.reset();
            } catch (error) {
                console.error('Error uploading photos:', error);
                alert('There was an error uploading your photos. Please try again.');
            }
        });
    }
    
    // Volunteer button
    const volunteerBtn = document.getElementById('volunteer-btn');
    if (volunteerBtn) {
        volunteerBtn.addEventListener('click', () => {
            const roles = ['Setting up decorations', 'Registration table', 'Photography', 'Music and AV'];
            const role = prompt(`Which role would you like to volunteer for?\n\n${roles.join('\n')}`);
            
            if (role) {
                alert(`Thank you for volunteering! A committee member will contact you soon about the "${role}" role.`);
            }
        });
    }
    
    // Memorabilia button
    const memorabiliaBtn = document.getElementById('memorabilia-btn');
    if (memorabiliaBtn) {
        memorabiliaBtn.addEventListener('click', () => {
            const info = prompt('Please describe the memorabilia you would like to share:');
            
            if (info) {
                alert('Thank you! A committee member will contact you about your memorabilia contribution.');
            }
        });
    }
}