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
            } else if (sectionId === 'settings') {
                loadSettings();
            }
        });
    });
}

// Load dashboard data
function loadDashboardData() {
    // For demo purposes, using mock data
    // In a real application, you would fetch this from the server
    
    // Update card values
    document.getElementById('total-registrations').textContent = '87';
    document.getElementById('total-revenue').textContent = '$9,380';
    document.getElementById('pending-photos').textContent = '12';
    document.getElementById('total-volunteers').textContent = '15';
    
    // Initialize charts
    initRegistrationChart();
    initTicketChart();
}

// Initialize registration timeline chart
function initRegistrationChart() {
    const ctx = document.getElementById('registration-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from the server
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

// Initialize ticket types chart
function initTicketChart() {
    const ctx = document.getElementById('ticket-chart').getContext('2d');
    
    // Sample data - in a real application, this would come from the server
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
    // For demo purposes, using mock data
    // In a real application, you would fetch this from the server
    
    const registrations = [
        {
            id: '1',
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
            id: '2',
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
            id: '3',
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
            id: '4',
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
            id: '5',
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
            <td>${reg.phone}</td>
            <td>${reg.ticketType === 'early' ? 'Early Bird' : 'Regular'}</td>
            <td>${reg.guestTickets}</td>
            <td>$${reg.paymentAmount}</td>
            <td><span class="payment-status ${statusClass}">${capitalizeFirst(reg.paymentStatus)}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" data-id="${reg.id}" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn" data-id="${reg.id}" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${reg.id}" title="Delete"><i class="fas fa-trash"></i></button>
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

// Load photos
function loadPhotos() {
    // For demo purposes, using mock data
    // In a real application, you would fetch this from the server
    
    const photos = [
        {
            id: '1',
            filename: 'photo-1.jpg',
            uploaderName: 'John Smith',
            uploaderEmail: 'john@example.com',
            caption: 'Graduation day 2005',
            uploadDate: '2025-04-15T14:30:00',
            approved: false
        },
        {
            id: '2',
            filename: 'photo-2.jpg',
            uploaderName: 'Lisa Johnson',
            uploaderEmail: 'lisa@example.com',
            caption: 'Football game vs. Central High',
            uploadDate: '2025-04-18T09:15:00',
            approved: true
        },
        {
            id: '3',
            filename: 'photo-3.jpg',
            uploaderName: 'Michael Brown',
            uploaderEmail: 'michael@example.com',
            caption: 'Senior prom group photo',
            uploadDate: '2025-04-20T16:45:00',
            approved: false
        },
        {
            id: '4',
            filename: 'photo-4.jpg',
            uploaderName: 'Sarah Wilson',
            uploaderEmail: 'sarah@example.com',
            caption: 'School trip to Washington D.C.',
            uploadDate: '2025-04-22T11:20:00',
            approved: true
        },
        {
            id: '5',
            filename: 'photo-5.jpg',
            uploaderName: 'David Lee',
            uploaderEmail: 'david@example.com',
            caption: 'Spirit week costume day',
            uploadDate: '2025-04-23T13:10:00',
            approved: false
        }
    ];
    
    const photoFilter = document.getElementById('photo-status-filter').value;
    const photosContainer = document.getElementById('photos-container');
    photosContainer.innerHTML = '';
    
    const filteredPhotos = photoFilter === 'all' 
        ? photos 
        : photos.filter(photo => photo.approved === (photoFilter === 'approved'));
    
    filteredPhotos.forEach(photo => {
        // Format date
        const uploadDate = new Date(photo.uploadDate);
        const formattedDate = uploadDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-id', photo.id);
        
        photoCard.innerHTML = `
            <div style="position: relative;">
                <img src="https://via.placeholder.com/300x200?text=${encodeURIComponent(photo.caption)}" alt="${photo.caption}">
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

// Show photo preview modal
function showPhotoPreview(photo) {
    const modal = document.getElementById('photo-preview-modal');
    const previewImage = document.getElementById('preview-image');
    const previewUploader = document.getElementById('preview-uploader');
    const previewCaption = document.getElementById('preview-caption');
    const previewDate = document.getElementById('preview-date');
    const approveBtn = document.getElementById('approve-photo');
    const rejectBtn = document.getElementById('reject-photo');
    
    // Set preview data
    previewImage.src = `https://via.placeholder.com/800x500?text=${encodeURIComponent(photo.caption)}`;
    previewUploader.textContent = `${photo.uploaderName} (${photo.uploaderEmail})`;
    previewCaption.textContent = photo.caption;
    
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
        approveBtn.onclick = () => approvePhoto(photo.id);
    }
    
    // Set reject button action
    rejectBtn.onclick = () => rejectPhoto(photo.id);
    
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
    // In a real application, you would send this to the server
    console.log(`Approving photo ID: ${photoId}`);
    
    // For demo purposes, just reload photos and close modal
    alert('Photo approved successfully!');
    document.getElementById('photo-preview-modal').style.display = 'none';
    loadPhotos();
}

// Reject photo
function rejectPhoto(photoId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to reject and delete this photo?')) {
        return;
    }
    
    // In a real application, you would send this to the server
    console.log(`Rejecting photo ID: ${photoId}`);
    
    // For demo purposes, just reload photos and close modal
    alert('Photo rejected and deleted successfully!');
    document.getElementById('photo-preview-modal').style.display = 'none';
    loadPhotos();
}

// Load volunteers
function loadVolunteers() {
    // For demo purposes, using mock data
    // In a real application, you would fetch this from the server
    
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

// Load settings
function loadSettings() {
    // In a real application, you would fetch current settings from the server
    // For demo purposes, just set some default values
    
    document.getElementById('smtp-host').value = 'smtp.example.com';
    document.getElementById('smtp-port').value = '587';
    document.getElementById('smtp-user').value = 'reunion@example.com';
    document.getElementById('from-email').value = 'reunion@classof2005.com';
    
    document.getElementById('reunion-date').value = '2025-09-24';
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
    alert(`Viewing registration details for ID: ${id}`);
    // In a real application, this would open a modal with full details
}

// Edit registration
function editRegistration(id) {
    alert(`Editing registration with ID: ${id}`);
    // In a real application, this would open an edit form/modal
}

// Delete registration
function deleteRegistration(id) {
    if (confirm('Are you sure you want to delete this registration?')) {
        // In a real application, this would send a delete request to the server
        console.log(`Deleting registration ID: ${id}`);
        alert('Registration deleted successfully!');
        loadRegistrations();
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