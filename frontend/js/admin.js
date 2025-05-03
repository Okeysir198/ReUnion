// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize sidebar navigation
    initSidebar();
    
    // Load dashboard data
    loadDashboardData();
    
    // Initialize admin event listeners
    initEventListeners();
});

// Check authentication status
function checkAuthStatus() {
    // In a real application, this would verify the JWT token
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        // If no token, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // For demo purposes, just set the admin username
    document.getElementById('admin-username').textContent = 'Admin User';
    
    // In a real application, you would verify the token with the server
    // fetch('/auth/verify', {
    //     headers: {
    //         'x-auth-token': token
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (!data.success) {
    //         window.location.href = 'login.html';
    //     } else {
    //         document.getElementById('admin-username').textContent = data.user.username;
    //     }
    // })
    // .catch(error => {
    //     console.error('Auth verification error:', error);
    //     window.location.href = 'login.html';
    // });
}

// Initialize sidebar navigation
function initSidebar() {
    const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
    const sections = document.querySelectorAll('.admin-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Show corresponding section
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Load section data if needed
            if (sectionId === 'registrations') {
                loadRegistrations();
            } else if (sectionId === 'photos') {
                loadPhotos();
            } else if (sectionId === 'volunteers') {
                loadVolunteers();
            } else if (sectionId === 'votes') {
                loadVotes();
            } else if (sectionId === 'settings') {
                loadSettings();
            }
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    // Fetch real data from the API
    fetch('/api/dashboard-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.data;
                
                // Update card values
                document.getElementById('total-registrations').textContent = stats.registrations;
                document.getElementById('total-revenue').textContent = `$${stats.totalBudget}`;
                document.getElementById('pending-photos').textContent = document.querySelector('#photo-status-filter').value === 'pending' ? document.querySelectorAll('.photo-card').length : '0';
                document.getElementById('total-visitors').textContent = stats.visitors;
                
                // Initialize charts with real data
                initRegistrationChart(stats);
                initBudgetChart(stats);
            } else {
                // Use mock data if API call fails
                useMockDashboardData();
            }
        })
        .catch(error => {
            console.error('Error loading dashboard stats:', error);
            useMockDashboardData();
        });
}

// Use mock data if API call fails
function useMockDashboardData() {
    // Update card values with mock data
    document.getElementById('total-registrations').textContent = '87';
    document.getElementById('total-revenue').textContent = '$9,380';
    document.getElementById('pending-photos').textContent = '12';
    document.getElementById('total-visitors').textContent = '245';
    
    // Initialize charts with mock data
    initRegistrationChartMock();
    initTicketChartMock();
}

// Initialize registration timeline chart with real data
function initRegistrationChart(stats) {
    const ctx = document.getElementById('registration-chart').getContext('2d');
    
    // Create chart with registration data
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Registered', 'Expected'],
            datasets: [{
                label: 'Registrations',
                data: [stats.registrations, 100 - stats.registrations], // Assuming 100 expected attendees
                backgroundColor: [
                    '#3b5998',
                    '#f0f0f0'
                ],
                borderWidth: 1
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
}

// Initialize budget chart with real data
function initBudgetChart(stats) {
    const ctx = document.getElementById('ticket-chart').getContext('2d');
    
    // Create chart with budget data
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Registration Fees', 'Sponsorships'],
            datasets: [{
                label: 'Budget Sources',
                data: [stats.totalRegistrationBudget, stats.totalSponsorshipBudget],
                backgroundColor: [
                    '#3b5998',
                    '#f8c740'
                ],
                borderWidth: 1
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

// Initialize registration timeline chart with mock data
function initRegistrationChartMock() {
    const ctx = document.getElementById('registration-chart').getContext('2d');
    
    // Sample data
    const registrationData = {
        labels: ['April', 'May', 'June', 'July', 'August', 'September'],
        datasets: [{
            label: 'Registrations',
            data: [12, 19, 15, 22, 14, 5],
            backgroundColor: 'rgba(59, 89, 152, 0.2)',
            borderColor: 'rgba(59, 89, 152, 1)',
            borderWidth: 2,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: registrationData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize ticket types chart with mock data
function initTicketChartMock() {
    const ctx = document.getElementById('ticket-chart').getContext('2d');
    
    // Sample data
    const ticketData = {
        labels: ['Early Bird', 'Regular', 'Guest'],
        datasets: [{
            label: 'Ticket Types',
            data: [45, 28, 14],
            backgroundColor: [
                'rgba(59, 89, 152, 0.7)',
                'rgba(59, 89, 152, 0.5)',
                'rgba(59, 89, 152, 0.3)'
            ],
            borderColor: [
                'rgba(59, 89, 152, 1)',
                'rgba(59, 89, 152, 1)',
                'rgba(59, 89, 152, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: ticketData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Load registrations data
function loadRegistrations() {
    // Get registrations from the API
    fetch('/api/registrations')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRegistrations(data.data);
            } else {
                console.error('Error fetching registrations:', data.message);
                displayMockRegistrations();
            }
        })
        .catch(error => {
            console.error('Failed to fetch registrations:', error);
            displayMockRegistrations();
        });
}

// Display registrations in the table
function displayRegistrations(registrations) {
    const tableBody = document.querySelector('#registrations-table tbody');
    tableBody.innerHTML = '';
    
    registrations.forEach(reg => {
        const row = document.createElement('tr');
        
        // Format date
        const regDate = new Date(reg.createdAt);
        const formattedDate = regDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create status badge class
        const statusClass = `status-${reg.paymentStatus}`;
        
        row.innerHTML = `
            <td>${reg.name}</td>
            <td>${reg.email}</td>
            <td>${reg.phone || 'N/A'}</td>
            <td>${reg.ticketType === 'early' ? 'Early Bird' : 'Regular'}</td>
            <td>${reg.guestTickets}</td>
            <td>$${reg.paymentAmount}</td>
            <td><span class="payment-status ${statusClass}">${capitalizeFirst(reg.paymentStatus)}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" data-id="${reg._id}" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${reg._id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${reg._id}" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => viewRegistration(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editRegistration(btn.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteRegistration(btn.getAttribute('data-id')));
    });
}

// Display mock registrations if API fails
function displayMockRegistrations() {
    const mockRegistrations = [
        {
            _id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            ticketType: 'early',
            guestTickets: 1,
            paymentAmount: 180,
            paymentStatus: 'completed',
            createdAt: '2025-04-15T14:30:00'
        },
        {
            _id: '2',
            name: 'Lisa Johnson',
            email: 'lisa@example.com',
            phone: '(555) 987-6543',
            ticketType: 'early',
            guestTickets: 0,
            paymentAmount: 85,
            paymentStatus: 'completed',
            createdAt: '2025-04-18T09:15:00'
        },
        {
            _id: '3',
            name: 'Michael Brown',
            email: 'michael@example.com',
            phone: '(555) 456-7890',
            ticketType: 'regular',
            guestTickets: 1,
            paymentAmount: 215,
            paymentStatus: 'pending',
            createdAt: '2025-04-20T16:45:00'
        },
        {
            _id: '4',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            phone: '(555) 555-5555',
            ticketType: 'early',
            guestTickets: 2,
            paymentAmount: 275,
            paymentStatus: 'completed',
            createdAt: '2025-04-22T11:20:00'
        },
        {
            _id: '5',
            name: 'David Lee',
            email: 'david@example.com',
            phone: '(555) 333-4444',
            ticketType: 'regular',
            guestTickets: 0,
            paymentAmount: 120,
            paymentStatus: 'failed',
            createdAt: '2025-04-23T13:10:00'
        }
    ];
    
    displayRegistrations(mockRegistrations);
}

// Load photos
function loadPhotos() {
    // Determine which photos to load based on filter
    const photoFilter = document.getElementById('photo-status-filter').value;
    const endpoint = photoFilter === 'approved' ? '/api/photos' : '/api/photos/pending';
    
    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayPhotos(data.data, photoFilter);
            } else {
                console.error('Error fetching photos:', data.message);
                displayMockPhotos(photoFilter);
            }
        })
        .catch(error => {
            console.error('Failed to fetch photos:', error);
            displayMockPhotos(photoFilter);
        });
}

// Display photos in the grid
function displayPhotos(photos, filterType) {
    const photosContainer = document.getElementById('photos-container');
    photosContainer.innerHTML = '';
    
    if (photos.length === 0) {
        photosContainer.innerHTML = `<p class="no-content">No ${filterType === 'approved' ? 'approved' : 'pending'} photos found.</p>`;
        return;
    }
    
    photos.forEach(photo => {
        // Format date
        const uploadDate = new Date(photo.uploadDate);
        const formattedDate = uploadDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-id', photo._id);
        
        // Use Cloudinary URL
        photoCard.innerHTML = `
            <div style="position: relative;">
                <img src="${photo.cloudinaryUrl}" alt="${photo.caption || 'Uploaded photo'}">
                <span class="status-badge status-${photo.approved ? 'approved' : 'pending'}">
                    ${photo.approved ? 'Approved' : 'Pending'}
                </span>
            </div>
            <div class="photo-info">
                <div class="photo-uploader">${photo.uploaderName}</div>
                <div class="photo-date">${formattedDate}</div>
            </div>
        `;
        
        photoCard.addEventListener('click', () => showPhotoPreview(photo));
        
        photosContainer.appendChild(photoCard);
    });
    
    // Add filter change event
    document.getElementById('photo-status-filter').addEventListener('change', loadPhotos);
}

// Display mock photos if API fails
function displayMockPhotos(filterType) {
    const mockPhotos = [
        {
            _id: '1',
            cloudinaryId: 'photo-1',
            cloudinaryUrl: 'https://via.placeholder.com/300x200?text=Graduation+Day',
            uploaderName: 'John Smith',
            uploaderEmail: 'john@example.com',
            caption: 'Graduation day 2005',
            uploadDate: '2025-04-15T14:30:00',
            approved: false
        },
        {
            _id: '2',
            cloudinaryId: 'photo-2',
            cloudinaryUrl: 'https://via.placeholder.com/300x200?text=Football+Game',
            uploaderName: 'Lisa Johnson',
            uploaderEmail: 'lisa@example.com',
            caption: 'Football game vs. Central High',
            uploadDate: '2025-04-18T09:15:00',
            approved: true
        },
        {
            _id: '3',
            cloudinaryId: 'photo-3',
            cloudinaryUrl: 'https://via.placeholder.com/300x200?text=Senior+Prom',
            uploaderName: 'Michael Brown',
            uploaderEmail: 'michael@example.com',
            caption: 'Senior prom group photo',
            uploadDate: '2025-04-20T16:45:00',
            approved: false
        },
        {
            _id: '4',
            cloudinaryId: 'photo-4',
            cloudinaryUrl: 'https://via.placeholder.com/300x200?text=School+Trip',
            uploaderName: 'Sarah Wilson',
            uploaderEmail: 'sarah@example.com',
            caption: 'School trip to Washington D.C.',
            uploadDate: '2025-04-22T11:20:00',
            approved: true
        },
        {
            _id: '5',
            cloudinaryId: 'photo-5',
            cloudinaryUrl: 'https://via.placeholder.com/300x200?text=Spirit+Week',
            uploaderName: 'David Lee',
            uploaderEmail: 'david@example.com',
            caption: 'Spirit week costume day',
            uploadDate: '2025-04-23T13:10:00',
            approved: false
        }
    ];
    
    // Filter photos based on selected option
    const filteredPhotos = filterType === 'all' 
        ? mockPhotos 
        : mockPhotos.filter(photo => photo.approved === (filterType === 'approved'));
    
    displayPhotos(filteredPhotos, filterType);
}

// Show photo preview modal
function showPhotoPreview(photo) {
    const modal = document.getElementById('photo-preview-modal');
    const previewImage = document.getElementById('preview-image');
    const previewUploader = document.getElementById('preview-uploader');
    const previewCaption = document.getElementById('preview-caption');
    const previewDate = document.getElementById('preview-date');
    const approveBtn = document.getElementById('approve-photo');
    const rejectBtn = document.getElementById('reject-photo');
    
    // Set preview data - Use Cloudinary URL
    previewImage.src = photo.cloudinaryUrl;
    previewUploader.textContent = `${photo.uploaderName} (${photo.uploaderEmail})`;
    previewCaption.textContent = photo.caption || 'No caption provided';
    
    const uploadDate = new Date(photo.uploadDate);
    previewDate.textContent = uploadDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Show/hide approve button based on approval status
    if (photo.approved) {
        approveBtn.style.display = 'none';
    } else {
        approveBtn.style.display = 'block';
        approveBtn.onclick = () => approvePhoto(photo._id);
    }
    
    // Set reject button action
    rejectBtn.onclick = () => rejectPhoto(photo._id);
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking on X
    document.querySelector('.close-modal').onclick = () => {
        modal.style.display = 'none';
    };
    
    // Close modal when clicking outside the content
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Approve photo
function approvePhoto(photoId) {
    fetch(`/api/photo/${photoId}/approve`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Photo approved successfully!');
            document.getElementById('photo-preview-modal').style.display = 'none';
            loadPhotos();
        } else {
            alert('Error approving photo: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error approving photo:', error);
        alert('There was an error approving the photo. Please try again.');
        
        // For demo purposes, just reload photos
        document.getElementById('photo-preview-modal').style.display = 'none';
        loadPhotos();
    });
}

// Reject photo
function rejectPhoto(photoId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to reject and delete this photo?')) {
        return;
    }
    
    fetch(`/api/photo/${photoId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Photo rejected and deleted successfully!');
            document.getElementById('photo-preview-modal').style.display = 'none';
            loadPhotos();
        } else {
            alert('Error deleting photo: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error deleting photo:', error);
        alert('There was an error deleting the photo. Please try again.');
        
        // For demo purposes, just reload photos
        document.getElementById('photo-preview-modal').style.display = 'none';
        loadPhotos();
    });
}

// Load volunteers
function loadVolunteers() {
    // For demo purposes, using mock data
    const volunteers = [
        {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            role: 'decorations'
        },
        {
            id: '2',
            name: 'Lisa Johnson',
            email: 'lisa@example.com',
            phone: '(555) 987-6543',
            role: 'photography'
        },
        {
            id: '3',
            name: 'Michael Brown',
            email: 'michael@example.com',
            phone: '(555) 456-7890',
            role: 'music'
        },
        {
            id: '4',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            phone: '(555) 555-5555',
            role: 'registration'
        },
        {
            id: '5',
            name: 'David Lee',
            email: 'david@example.com',
            phone: '(555) 333-4444',
            role: 'decorations'
        }
    ];
    
    // Clear all volunteer lists
    document.querySelectorAll('.volunteers-list').forEach(list => {
        list.innerHTML = '';
    });
    
    // Group volunteers by role
    volunteers.forEach(volunteer => {
        const roleList = document.querySelector(`.volunteers-list[data-role="${volunteer.role}"]`);
        
        if (roleList) {
            const volunteerItem = document.createElement('div');
            volunteerItem.className = 'volunteer-item';
            volunteerItem.innerHTML = `
                <div class="volunteer-name">${volunteer.name}</div>
                <div class="volunteer-contact">
                    ${volunteer.email} | ${volunteer.phone}
                </div>
            `;
            roleList.appendChild(volunteerItem);
        }
    });
    
    // Add event listeners for volunteer management buttons
    document.getElementById('assign-tasks').addEventListener('click', assignTasks);
    document.getElementById('email-volunteers').addEventListener('click', emailAllVolunteers);
}

// Load votes
function loadVotes() {
    // Fetch votes from the API
    fetch('/api/votes')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayVotes(data.data);
            } else {
                console.error('Error fetching votes:', data.message);
                displayMockVotes();
            }
        })
        .catch(error => {
            console.error('Failed to fetch votes:', error);
            displayMockVotes();
        });
    
    // Fetch vote statistics
    fetch('/api/vote-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayVoteStats(data.data);
            } else {
                console.error('Error fetching vote stats:', data.message);
                displayMockVoteStats();
            }
        })
        .catch(error => {
            console.error('Failed to fetch vote stats:', error);
            displayMockVoteStats();
        });
}

// Display votes in the table
function displayVotes(votes) {
    const tableBody = document.querySelector('#votes-table tbody');
    tableBody.innerHTML = '';
    
    votes.forEach(vote => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${vote.name}</td>
            <td>${vote.email}</td>
            <td>${vote.dateVote || 'Not voted'}</td>
            <td>$${vote.budgetAmount || 0}</td>
            <td>$${vote.sponsorAmount || 0}</td>
            <td>${new Date(vote.createdAt).toLocaleDateString()}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Display mock votes if API fails
function displayMockVotes() {
    const mockVotes = [
        {
            name: 'John Smith',
            email: 'john@example.com',
            dateVote: 'July 25-27, 2025',
            budgetAmount: 100,
            sponsorAmount: 50,
            createdAt: '2025-04-15T14:30:00'
        },
        {
            name: 'Lisa Johnson',
            email: 'lisa@example.com',
            dateVote: 'September 5-7, 2025',
            budgetAmount: 120,
            sponsorAmount: 0,
            createdAt: '2025-04-18T09:15:00'
        },
        {
            name: 'Michael Brown',
            email: 'michael@example.com',
            dateVote: 'July 25-27, 2025',
            budgetAmount: 85,
            sponsorAmount: 25,
            createdAt: '2025-04-20T16:45:00'
        },
        {
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            dateVote: 'August 15-17, 2025',
            budgetAmount: 150,
            sponsorAmount: 100,
            createdAt: '2025-04-22T11:20:00'
        },
        {
            name: 'David Lee',
            email: 'david@example.com',
            dateVote: 'September 26-28, 2025',
            budgetAmount: 90,
            sponsorAmount: 0,
            createdAt: '2025-04-23T13:10:00'
        }
    ];
    
    displayVotes(mockVotes);
}

// Display vote statistics
function displayVoteStats(stats) {
    const votesChartContainer = document.getElementById('votes-chart');
    const budgetChartContainer = document.getElementById('budget-results-chart');
    
    // Create date votes chart
    if (votesChartContainer) {
        const dateVotes = stats.dateVotes;
        const dates = Object.keys(dateVotes);
        const votes = Object.values(dateVotes);
        
        new Chart(votesChartContainer.getContext('2d'), {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Votes',
                    data: votes,
                    backgroundColor: 'rgba(59, 89, 152, 0.7)',
                    borderColor: 'rgba(59, 89, 152, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Date Votes'
                    }
                }
            }
        });
    }
    
    // Create budget results chart
    if (budgetChartContainer) {
        new Chart(budgetChartContainer.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Average Budget', 'Total Sponsorship'],
                datasets: [{
                    label: 'Budget Information',
                    data: [
                        stats.totalBudget / stats.voteCount || 0, 
                        stats.totalSponsorship || 0
                    ],
                    backgroundColor: [
                        'rgba(59, 89, 152, 0.7)',
                        'rgba(248, 199, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 89, 152, 1)',
                        'rgba(248, 199, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Budget Information'
                    }
                }
            }
        });
    }
    
    // Update statistics text
    document.getElementById('total-votes').textContent = stats.voteCount || 0;
    document.getElementById('average-budget').textContent = `$${Math.round((stats.totalBudget / stats.voteCount) || 0)}`;
    document.getElementById('total-sponsorship').textContent = `$${stats.totalSponsorship || 0}`;
}

// Display mock vote statistics if API fails
function displayMockVoteStats() {
    const votesChartContainer = document.getElementById('votes-chart');
    const budgetChartContainer = document.getElementById('budget-results-chart');
    
    // Create date votes chart with mock data
    if (votesChartContainer) {
        const mockDateVotes = {
            'July 25-27, 2025': 12,
            'August 15-17, 2025': 8,
            'September 5-7, 2025': 15,
            'September 26-28, 2025': 5
        };
        const dates = Object.keys(mockDateVotes);
        const votes = Object.values(mockDateVotes);
        
        new Chart(votesChartContainer.getContext('2d'), {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Votes',
                    data: votes,
                    backgroundColor: 'rgba(59, 89, 152, 0.7)',
                    borderColor: 'rgba(59, 89, 152, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Date Votes'
                    }
                }
            }
        });
    }
    
    // Create budget results chart with mock data
    if (budgetChartContainer) {
        new Chart(budgetChartContainer.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Average Budget', 'Total Sponsorship'],
                datasets: [{
                    label: 'Budget Information',
                    data: [110, 1750],
                    backgroundColor: [
                        'rgba(59, 89, 152, 0.7)',
                        'rgba(248, 199, 64, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 89, 152, 1)',
                        'rgba(248, 199, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Budget Information'
                    }
                }
            }
        });
    }
    
    // Update statistics text with mock data
    document.getElementById('total-votes').textContent = '40';
    document.getElementById('average-budget').textContent = '$110';
    document.getElementById('total-sponsorship').textContent = '$1,750';
}

// Load settings
function loadSettings() {
    // In a real application, you would fetch current settings from the server
    // For demo purposes, just set some default values
    
    document.getElementById('smtp-host').value = 'smtp.example.com';
    document.getElementById('smtp-port').value = '587';
    document.getElementById('smtp-user').value = 'reunion@example.com';
    document.getElementById('from-email').value = 'reunion@classof2005.com';
    
    document.getElementById('reunion-date').value = '2025-07-25';
    document.getElementById('reunion-start-time').value = '18:00';
    document.getElementById('early-bird-date').value = '2025-06-01';
    document.getElementById('early-bird-price').value = '85';
    document.getElementById('regular-price').value = '120';
    document.getElementById('guest-price').value = '95';
    
    // Add form submission handlers
    document.getElementById('admin-password-form').addEventListener('submit', updateAdminPassword);
    document.getElementById('email-settings-form').addEventListener('submit', saveEmailSettings);
    document.getElementById('website-settings-form').addEventListener('submit', saveWebsiteSettings);
    document.getElementById('test-email').addEventListener('click', sendTestEmail);
}

// Initialize admin event listeners
function initEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });
    
    // Registration search
    document.getElementById('registration-search').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const tableRows = document.querySelectorAll('#registrations-table tbody tr');
        
        tableRows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const email = row.cells[1].textContent.toLowerCase();
            
            if (name.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    
    // Registration filters
    document.getElementById('payment-filter').addEventListener('change', applyRegistrationFilters);
    document.getElementById('ticket-filter').addEventListener('change', applyRegistrationFilters);
    
    // Export to CSV
    document.getElementById('export-csv').addEventListener('click', exportRegistrationsToCSV);
}

// Apply registration filters
function applyRegistrationFilters() {
    const paymentFilter = document.getElementById('payment-filter').value;
    const ticketFilter = document.getElementById('ticket-filter').value;
    const tableRows = document.querySelectorAll('#registrations-table tbody tr');
    
    tableRows.forEach(row => {
        const ticketType = row.cells[3].textContent.toLowerCase();
        const paymentStatus = row.cells[6].querySelector('.payment-status').textContent.toLowerCase();
        
        const ticketMatch = ticketFilter === 'all' || 
            (ticketFilter === 'early' && ticketType.includes('early')) ||
            (ticketFilter === 'regular' && ticketType.includes('regular'));
            
        const paymentMatch = paymentFilter === 'all' || paymentStatus === paymentFilter;
        
        if (ticketMatch && paymentMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export registrations to CSV
function exportRegistrationsToCSV() {
    // Get table data
    const table = document.getElementById('registrations-table');
    const rows = table.querySelectorAll('tbody tr');
    
    // Create CSV header
    let csv = 'Name,Email,Phone,Ticket Type,Guests,Total,Payment Status,Date Registered\n';
    
    // Add each row of data
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const name = row.cells[0].textContent;
            const email = row.cells[1].textContent;
            const phone = row.cells[2].textContent;
            const ticketType = row.cells[3].textContent;
            const guests = row.cells[4].textContent;
            const total = row.cells[5].textContent;
            const paymentStatus = row.cells[6].textContent.trim();
            const dateRegistered = row.cells[7].textContent;
            
            // Escape fields that might contain commas
            const formatField = (field) => `"${field.replace(/"/g, '""')}"`;
            
            csv += `${formatField(name)},${formatField(email)},${formatField(phone)},${formatField(ticketType)},${guests},${total},${formatField(paymentStatus)},${formatField(dateRegistered)}\n`;
        }
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'reunion-registrations.csv');
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// View registration details
function viewRegistration(id) {
    fetch(`/api/registration/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayRegistrationDetails(data.data);
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error fetching registration details:', error);
            alert('There was an error retrieving the registration details. Please try again.');
            
            // For demo purposes, just show an alert
            alert(`Viewing registration details for ID: ${id}`);
        });
}

// Display registration details in a modal
function displayRegistrationDetails(registration) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Registration Details</h3>
            <div class="registration-details">
                <p><strong>Name:</strong> ${registration.name}</p>
                <p><strong>Email:</strong> ${registration.email}</p>
                <p><strong>Phone:</strong> ${registration.phone || 'N/A'}</p>
                <p><strong>Ticket Type:</strong> ${registration.ticketType === 'early' ? 'Early Bird' : 'Regular'}</p>
                <p><strong>Guest Tickets:</strong> ${registration.guestTickets}</p>
                <p><strong>Dietary Restrictions:</strong> ${registration.dietary || 'None'}</p>
                <p><strong>Payment Amount:</strong> $${registration.paymentAmount}</p>
                <p><strong>Payment Status:</strong> ${capitalizeFirst(registration.paymentStatus)}</p>
                <p><strong>Registration Date:</strong> ${new Date(registration.createdAt).toLocaleString()}</p>
            </div>
            <div class="modal-actions">
                <button class="edit-registration secondary-button">Edit</button>
                <button class="close-details secondary-button">Close</button>
            </div>
        </div>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'details-modal';
    modal.innerHTML = modalHTML;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.close-details').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.edit-registration').addEventListener('click', () => {
        document.body.removeChild(modal);
        editRegistration(registration._id);
    });
    
    // Close modal when clicking outside the content
    window.onclick = (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Edit registration
function editRegistration(id) {
    fetch(`/api/registration/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayEditRegistrationForm(data.data);
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error fetching registration for edit:', error);
            alert('There was an error retrieving the registration. Please try again.');
            
            // For demo purposes, just show an alert
            alert(`Editing registration with ID: ${id}`);
        });
}

// Display edit registration form in a modal
function displayEditRegistrationForm(registration) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Edit Registration</h3>
            <form id="edit-registration-form">
                <input type="hidden" id="edit-id" value="${registration._id}">
                
                <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input type="text" id="edit-name" value="${registration.name}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" value="${registration.email}" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-phone">Phone</label>
                    <input type="tel" id="edit-phone" value="${registration.phone || ''}">
                </div>
                
                <div class="form-group">
                    <label for="edit-ticket-type">Ticket Type</label>
                    <select id="edit-ticket-type" required>
                        <option value="early" ${registration.ticketType === 'early' ? 'selected' : ''}>Early Bird - $85</option>
                        <option value="regular" ${registration.ticketType === 'regular' ? 'selected' : ''}>Regular - $120</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-guest-tickets">Guest Tickets</label>
                    <select id="edit-guest-tickets">
                        <option value="0" ${registration.guestTickets === 0 ? 'selected' : ''}>No guests</option>
                        <option value="1" ${registration.guestTickets === 1 ? 'selected' : ''}>1 guest - $95</option>
                        <option value="2" ${registration.guestTickets === 2 ? 'selected' : ''}>2 guests - $190</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-dietary">Dietary Restrictions</label>
                    <textarea id="edit-dietary">${registration.dietary || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit-payment-status">Payment Status</label>
                    <select id="edit-payment-status">
                        <option value="pending" ${registration.paymentStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="completed" ${registration.paymentStatus === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="failed" ${registration.paymentStatus === 'failed' ? 'selected' : ''}>Failed</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="cta-button">Save Changes</button>
                    <button type="button" class="cancel-edit secondary-button">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = modalHTML;
    
    // Add modal to the page
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('.cancel-edit').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#edit-registration-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveRegistrationChanges();
    });
    
    // Close modal when clicking outside the content
    window.onclick = (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Save registration changes
function saveRegistrationChanges() {
    const id = document.getElementById('edit-id').value;
    const updatedRegistration = {
        name: document.getElementById('edit-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        ticketType: document.getElementById('edit-ticket-type').value,
        guestTickets: parseInt(document.getElementById('edit-guest-tickets').value),
        dietary: document.getElementById('edit-dietary').value,
        paymentStatus: document.getElementById('edit-payment-status').value
    };
    
    fetch(`/api/registration/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRegistration),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration updated successfully!');
            const modal = document.querySelector('.edit-modal');
            if (modal) {
                document.body.removeChild(modal);
            }
            loadRegistrations();
        } else {
            alert('Error updating registration: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating registration:', error);
        alert('There was an error updating the registration. Please try again.');
        
        // For demo purposes, still close modal and reload
        const modal = document.querySelector('.edit-modal');
        if (modal) {
            document.body.removeChild(modal);
        }
        loadRegistrations();
    });
}

// Delete registration
function deleteRegistration(id) {
    if (confirm('Are you sure you want to delete this registration?')) {
        fetch(`/api/registration/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registration deleted successfully!');
                loadRegistrations();
            } else {
                alert('Error deleting registration: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting registration:', error);
            alert('There was an error deleting the registration. Please try again.');
            
            // For demo purposes, still reload
            loadRegistrations();
        });
    }
}

// Assign tasks to volunteers
function assignTasks() {
    alert('This would open a form to assign specific tasks to volunteers');
    // In a real application, this would open a modal for task assignment
}

// Email all volunteers
function emailAllVolunteers() {
    alert('This would open a form to send an email to all volunteers');
    // In a real application, this would open an email composition form
}

// Update admin password
function updateAdminPassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('All password fields are required');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    // In a real application, this would verify the current password and update
    // For demo purposes, just show success message
    alert('Password updated successfully!');
    
    // Clear form
    e.target.reset();
}

// Save email settings
function saveEmailSettings(e) {
    e.preventDefault();
    
    // Get form values
    const smtpHost = document.getElementById('smtp-host').value;
    const smtpPort = document.getElementById('smtp-port').value;
    const smtpUser = document.getElementById('smtp-user').value;
    const smtpPass = document.getElementById('smtp-pass').value;
    const fromEmail = document.getElementById('from-email').value;
    
    // Validate required fields
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In a real application, this would send settings to the server
    console.log('Saving email settings:', { smtpHost, smtpPort, smtpUser, fromEmail });
    
    // Show success message
    alert('Email settings saved successfully!');
}

// Send test email
function sendTestEmail() {
    // Get email settings
    const smtpHost = document.getElementById('smtp-host').value;
    const smtpPort = document.getElementById('smtp-port').value;
    const smtpUser = document.getElementById('smtp-user').value;
    const smtpPass = document.getElementById('smtp-pass').value;
    const fromEmail = document.getElementById('from-email').value;
    
    // Validate required fields
    if (!smtpHost || !smtpPort || !smtpUser || !fromEmail) {
        alert('Please fill in all required email settings first');
        return;
    }
    
    // In a real application, this would send a test email
    console.log('Sending test email with settings:', { smtpHost, smtpPort, smtpUser, fromEmail });
    
    // Show success message after a brief delay to simulate sending
    setTimeout(() => {
        alert('Test email sent successfully!');
    }, 1000);
}

// Save website settings
function saveWebsiteSettings(e) {
    e.preventDefault();
    
    // Get form values
    const reunionDate = document.getElementById('reunion-date').value;
    const reunionStartTime = document.getElementById('reunion-start-time').value;
    const earlyBirdDate = document.getElementById('early-bird-date').value;
    const earlyBirdPrice = document.getElementById('early-bird-price').value;
    const regularPrice = document.getElementById('regular-price').value;
    const guestPrice = document.getElementById('guest-price').value;
    
    // Validate required fields
    if (!reunionDate || !reunionStartTime || !earlyBirdDate || !earlyBirdPrice || !regularPrice || !guestPrice) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In a real application, this would send settings to the server
    console.log('Saving website settings:', {
        reunionDate,
        reunionStartTime,
        earlyBirdDate,
        earlyBirdPrice,
        regularPrice,
        guestPrice
    });
    
    // Show success message
    alert('Website settings saved successfully!');
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}