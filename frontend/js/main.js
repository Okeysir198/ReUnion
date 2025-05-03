// Main JavaScript for Reunion Website

document.addEventListener('DOMContentLoaded', () => {
    // Record visitor
    recordVisitor();
    
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
    
    // Initialize voting if elements exist
    if (document.getElementById('date-vote-form')) {
        setupVoting();
    }
    
    // Initialize budget voting if element exists
    if (document.getElementById('budget-vote-form')) {
        setupBudgetVoting();
    }
    
    // Initialize career chart if element exists
    if (document.querySelector('.dashboard-chart')) {
        initDashboardCharts();
    }
    
    // Load photo gallery images
    loadPhotoGallery();
    
    // Load classmate spotlights
    loadClassmateSpotlights();
    
    // Handle form submissions
    setupFormSubmissions();
});

// Record visitor for statistics
function recordVisitor() {
    // Send a request to record the visit
    fetch('/api/record-visitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .catch(error => console.error('Error recording visitor:', error));
}

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

// Setup voting functionality
function setupVoting() {
    const voteForm = document.getElementById('date-vote-form');
    const emailInput = document.getElementById('vote-email');
    
    // Check if user has already voted
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            fetch(`/api/vote/${email}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data) {
                        // Pre-fill form with existing vote
                        document.getElementById('vote-name').value = data.data.name;
                        if (data.data.dateVote) {
                            document.querySelector(`input[name="dateVote"][value="${data.data.dateVote}"]`).checked = true;
                        }
                        
                        // Show update message
                        document.getElementById('vote-status').textContent = 'You have already voted. You can update your vote below.';
                        document.getElementById('vote-status').style.display = 'block';
                        document.getElementById('vote-status').className = 'vote-status info';
                    }
                })
                .catch(error => console.error('Error checking previous vote:', error));
        }
    });
    
    // Handle vote submission
    voteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('vote-name').value.trim();
        const email = document.getElementById('vote-email').value.trim();
        const dateVote = document.querySelector('input[name="dateVote"]:checked')?.value;
        
        if (!name || !email) {
            alert('Please provide your name and email to vote.');
            return;
        }
        
        if (!dateVote) {
            alert('Please select a date option to vote.');
            return;
        }
        
        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    dateVote
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('vote-status').textContent = 'Thank you for your vote!';
                document.getElementById('vote-status').style.display = 'block';
                document.getElementById('vote-status').className = 'vote-status success';
                loadVoteResults();
            } else {
                document.getElementById('vote-status').textContent = 'Error: ' + result.message;
                document.getElementById('vote-status').style.display = 'block';
                document.getElementById('vote-status').className = 'vote-status error';
            }
        } catch (error) {
            console.error('Error submitting vote:', error);
            document.getElementById('vote-status').textContent = 'There was an error processing your vote. Please try again.';
            document.getElementById('vote-status').style.display = 'block';
            document.getElementById('vote-status').className = 'vote-status error';
        }
    });
    
    // Load current vote results
    loadVoteResults();
}

// Load and display vote results
function loadVoteResults() {
    fetch('/api/vote-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const resultsContainer = document.getElementById('vote-results');
                if (!resultsContainer) return;
                
                // Clear previous results
                resultsContainer.innerHTML = '';
                
                // Get date votes
                const dateVotes = data.data.dateVotes;
                if (!dateVotes || Object.keys(dateVotes).length === 0) {
                    resultsContainer.innerHTML = '<p>No votes yet. Be the first to vote!</p>';
                    return;
                }
                
                // Create results display
                const totalVotes = data.data.voteCount;
                const resultsList = document.createElement('div');
                resultsList.className = 'vote-results-list';
                
                // Sort dates by vote count (highest first)
                // Sort dates by vote count (highest first)
                const dateOptions = Object.entries(dateVotes)
                    .sort((a, b) => b[1] - a[1]);
                
                dateOptions.forEach(([date, votes]) => {
                    const percentage = Math.round((votes / totalVotes) * 100);
                    
                    const resultItem = document.createElement('div');
                    resultItem.className = 'vote-result-item';
                    resultItem.innerHTML = `
                        <div class="vote-option">${date}</div>
                        <div class="vote-progress-container">
                            <div class="vote-progress" style="width: ${percentage}%"></div>
                        </div>
                        <div class="vote-count">${votes} votes (${percentage}%)</div>
                    `;
                    
                    resultsList.appendChild(resultItem);
                });
                
                resultsContainer.appendChild(resultsList);
                
                // Add total votes info
                const totalInfo = document.createElement('p');
                totalInfo.className = 'vote-total-info';
                totalInfo.textContent = `Total votes: ${totalVotes}`;
                resultsContainer.appendChild(totalInfo);
            }
        })
        .catch(error => console.error('Error loading vote results:', error));
}

// Setup budget voting
function setupBudgetVoting() {
    const budgetForm = document.getElementById('budget-vote-form');
    const emailInput = document.getElementById('budget-email');
    
    // Check if user has already voted on budget
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            fetch(`/api/vote/${email}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.data) {
                        // Pre-fill form with existing vote
                        document.getElementById('budget-name').value = data.data.name;
                        document.getElementById('budget-amount').value = data.data.budgetAmount || '';
                        document.getElementById('sponsor-amount').value = data.data.sponsorAmount || '';
                        
                        // Show update message
                        document.getElementById('budget-status').textContent = 'You have already submitted budget information. You can update it below.';
                        document.getElementById('budget-status').style.display = 'block';
                        document.getElementById('budget-status').className = 'vote-status info';
                    }
                })
                .catch(error => console.error('Error checking previous budget vote:', error));
        }
    });
    
    // Handle budget submission
    budgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('budget-name').value.trim();
        const email = document.getElementById('budget-email').value.trim();
        const budgetAmount = document.getElementById('budget-amount').value;
        const sponsorAmount = document.getElementById('sponsor-amount').value;
        
        if (!name || !email) {
            alert('Please provide your name and email to submit budget information.');
            return;
        }
        
        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    budgetAmount,
                    sponsorAmount
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                document.getElementById('budget-status').textContent = 'Thank you for your budget submission!';
                document.getElementById('budget-status').style.display = 'block';
                document.getElementById('budget-status').className = 'vote-status success';
                loadBudgetResults();
            } else {
                document.getElementById('budget-status').textContent = 'Error: ' + result.message;
                document.getElementById('budget-status').style.display = 'block';
                document.getElementById('budget-status').className = 'vote-status error';
            }
        } catch (error) {
            console.error('Error submitting budget:', error);
            document.getElementById('budget-status').textContent = 'There was an error processing your submission. Please try again.';
            document.getElementById('budget-status').style.display = 'block';
            document.getElementById('budget-status').className = 'vote-status error';
        }
    });
    
    // Load current budget results
    loadBudgetResults();
}

// Load and display budget results
function loadBudgetResults() {
    fetch('/api/vote-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const budgetResultsContainer = document.getElementById('budget-results');
                if (!budgetResultsContainer) return;
                
                // Clear previous results
                budgetResultsContainer.innerHTML = '';
                
                // Get budget data
                const totalBudget = data.data.totalBudget || 0;
                const totalSponsorship = data.data.totalSponsorship || 0;
                const totalVotes = data.data.voteCount || 0;
                
                if (totalVotes === 0) {
                    budgetResultsContainer.innerHTML = '<p>No budget submissions yet. Be the first to submit!</p>';
                    return;
                }
                
                // Create results display
                const averageBudget = totalVotes > 0 ? Math.round(totalBudget / totalVotes) : 0;
                
                const budgetSummary = document.createElement('div');
                budgetSummary.className = 'budget-summary';
                budgetSummary.innerHTML = `
                    <div class="budget-stat">
                        <span class="stat-label">Average Budget per Person:</span>
                        <span class="stat-value">$${averageBudget}</span>
                    </div>
                    <div class="budget-stat">
                        <span class="stat-label">Total Budget Submissions:</span>
                        <span class="stat-value">${totalVotes}</span>
                    </div>
                    <div class="budget-stat">
                        <span class="stat-label">Total Sponsorship Offered:</span>
                        <span class="stat-value">$${totalSponsorship}</span>
                    </div>
                `;
                
                budgetResultsContainer.appendChild(budgetSummary);
            }
        })
        .catch(error => console.error('Error loading budget results:', error));
}

// Load photo gallery images
function loadPhotoGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (galleryContainer) {
        // Try to fetch approved photos from the server
        fetch('/api/photos')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.data.length > 0) {
                    // Clear container
                    galleryContainer.innerHTML = '';
                    
                    // Add each photo to the gallery
                    data.data.forEach(photo => {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item';
                        
                        const img = document.createElement('img');
                        // Use Cloudinary URL instead of local path
                        img.src = photo.cloudinaryUrl;
                        img.alt = photo.caption || 'Class photo';
                        
                        galleryItem.appendChild(img);
                        galleryContainer.appendChild(galleryItem);
                    });
                } else {
                    // Use placeholder images if no approved photos
                    galleryContainer.innerHTML = '';
                    
                    const placeholderImages = [
                        { src: 'https://via.placeholder.com/300x200?text=Graduation+Day', alt: 'Graduation Day' },
                        { src: 'https://via.placeholder.com/300x200?text=Senior+Prom', alt: 'Senior Prom' },
                        { src: 'https://via.placeholder.com/300x200?text=Football+Game', alt: 'Football Game' },
                        { src: 'https://via.placeholder.com/300x200?text=School+Trip', alt: 'School Trip' },
                        { src: 'https://via.placeholder.com/300x200?text=Yearbook+Photo', alt: 'Yearbook Photo' },
                        { src: 'https://via.placeholder.com/300x200?text=Spirit+Week', alt: 'Spirit Week' }
                    ];
                    
                    placeholderImages.forEach(image => {
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item';
                        
                        const img = document.createElement('img');
                        img.src = image.src;
                        img.alt = image.alt;
                        
                        galleryItem.appendChild(img);
                        galleryContainer.appendChild(galleryItem);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading photos:', error);
                
                // Use placeholder images on error
                const placeholderImages = [
                    { src: 'https://via.placeholder.com/300x200?text=Graduation+Day', alt: 'Graduation Day' },
                    { src: 'https://via.placeholder.com/300x200?text=Senior+Prom', alt: 'Senior Prom' },
                    { src: 'https://via.placeholder.com/300x200?text=Football+Game', alt: 'Football Game' },
                    { src: 'https://via.placeholder.com/300x200?text=School+Trip', alt: 'School Trip' },
                    { src: 'https://via.placeholder.com/300x200?text=Yearbook+Photo', alt: 'Yearbook Photo' },
                    { src: 'https://via.placeholder.com/300x200?text=Spirit+Week', alt: 'Spirit Week' }
                ];
                
                galleryContainer.innerHTML = '';
                
                placeholderImages.forEach(image => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    
                    const img = document.createElement('img');
                    img.src = image.src;
                    img.alt = image.alt;
                    
                    galleryItem.appendChild(img);
                    galleryContainer.appendChild(galleryItem);
                });
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
            career: 'School Principal',
            bio: 'After graduating from UC Berkeley, Sarah became a teacher and recently was promoted to principal at Lincoln Elementary.'
        },
        {
            name: 'Mike Peterson',
            image: 'https://via.placeholder.com/100x100?text=MP',
            career: 'Software Engineer',
            bio: 'Mike founded a successful tech startup after graduating from MIT and now works as a senior developer at Google.'
        },
        {
            name: 'Jessica Lee',
            image: 'https://via.placeholder.com/100x100?text=JL',
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
                <p><strong>Career:</strong> ${spotlight.career}</p>
                <p>${spotlight.bio}</p>
            `;
            
            spotlightContainer.appendChild(spotlightItem);
        });
    }
}

// Initialize dashboard charts
function initDashboardCharts() {
    fetch('/api/dashboard-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.data;
                
                // Update dashboard counters
                document.getElementById('visitor-count').textContent = stats.visitors;
                document.getElementById('registration-count').textContent = stats.registrations;
                document.getElementById('total-budget').textContent = `$${stats.totalBudget}`;
                document.getElementById('sponsorship-amount').textContent = `$${stats.totalSponsorshipBudget}`;
                
                // Create registration chart
                const registrationCtx = document.getElementById('registration-chart').getContext('2d');
                new Chart(registrationCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Registered', 'Expected'],
                        datasets: [{
                            label: 'Registrations',
                            data: [stats.registrations, 100 - stats.registrations], // Assuming 100 expected attendees
                            backgroundColor: [
                                '#3b5998',
                                '#f0f0f0'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            title: {
                                display: true,
                                text: 'Registration Progress'
                            }
                        }
                    }
                });
                
                // Create budget chart
                const budgetCtx = document.getElementById('budget-chart').getContext('2d');
                new Chart(budgetCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Registration Fees', 'Sponsorships'],
                        datasets: [{
                            label: 'Budget Sources',
                            data: [stats.totalRegistrationBudget, stats.totalSponsorshipBudget],
                            backgroundColor: [
                                '#3b5998',
                                '#f8c740'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'Budget Sources'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error loading dashboard stats:', error));
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
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert('Registration submitted successfully! Check your email for confirmation.');
                    registrationForm.reset();
                    
                    // Redirect to payment page (in a real app)
                    // window.location.href = `payment.html?userId=${result.data.userId}`;
                } else {
                    alert('Error: ' + result.message);
                }
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
                // Create FormData for file upload
                const formData = new FormData();
                
                // Add user info
                formData.append('name', document.getElementById('photo-name').value || 'Anonymous');
                formData.append('email', document.getElementById('photo-email').value || 'anonymous@example.com');
                formData.append('caption', document.getElementById('photo-caption').value || '');
                
                // Add files
                for (let i = 0; i < files.length; i++) {
                    formData.append('photos', files[i]);
                }
                const response = await fetch('/api/upload-photos', {
                    method: 'POST',
                    body: formData,
                });
                
                const result = await response.json();
                
                if (result.success) {
                    alert(`${result.data.length} photo(s) uploaded successfully! They will be visible after approval.`);
                    photoForm.reset();
                    
                    // Clear the file input
                    fileInput.value = '';
                } else {
                    alert('Error: ' + result.message);
                }
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

// Helper function to validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}