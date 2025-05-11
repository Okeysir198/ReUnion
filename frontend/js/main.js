// Main JavaScript for Reunion Website

document.addEventListener('DOMContentLoaded', () => {
    // Record visitor with improved tracking
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
    
    // Initialize dashboard charts if elements exist
    if (document.querySelector('.dashboard-chart')) {
        initDashboardCharts();
    }
    
    // Load photo gallery images
    loadPhotoGallery();
    
    // Load classmate spotlights
    loadClassmateSpotlights();
    
    // Handle form submissions
    setupFormSubmissions();
    
    // Photo upload preview
    setupPhotoUploadPreview();
});

// Record visitor for statistics with 30-minute inactivity as new visit
function recordVisitor() {
    // Check for previous visit time in localStorage
    const lastVisit = localStorage.getItem('lastVisitTime');
    const currentTime = Date.now();
    
    // If no previous visit or more than 30 minutes since last visit
    if (!lastVisit || (currentTime - lastVisit) > 30 * 60 * 1000) {
        // Send a request to record the visit
        fetch('/api/record-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .catch(error => console.error('Lỗi khi ghi lại người truy cập:', error));
        
        // Update last visit time
        localStorage.setItem('lastVisitTime', currentTime);
    }
}

// Initialize venue map
function initMap() {
    // Create a map centered at venue location
    const venueLocation = [10.779168232835389, 106.69733093173164]; 
    const map = L.map('map').setView(venueLocation, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add marker for venue
    L.marker(venueLocation)
        .addTo(map)
        .bindPopup('Sẽ cập nhật địa điểm cụ thể sau.')
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
                        document.getElementById('vote-status').textContent = 'Bạn đã bình chọn rồi. Bạn có thể cập nhật bình chọn của mình dưới đây.';
                        document.getElementById('vote-status').style.display = 'block';
                        document.getElementById('vote-status').className = 'vote-status info';
                    }
                })
                .catch(error => console.error('Lỗi khi kiểm tra bình chọn trước đó:', error));
        }
    });
    
    // Handle vote submission
    voteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('vote-name').value.trim();
        const email = document.getElementById('vote-email').value.trim();
        const dateVote = document.querySelector('input[name="dateVote"]:checked')?.value;
        
        if (!name || !email) {
            alert('Vui lòng cung cấp tên và email của bạn để bình chọn.');
            return;
        }
        
        if (!dateVote) {
            alert('Vui lòng chọn một ngày để bình chọn.');
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
                document.getElementById('vote-status').textContent = 'Cảm ơn bạn đã bình chọn!';
                document.getElementById('vote-status').style.display = 'block';
                document.getElementById('vote-status').className = 'vote-status success';
                loadVoteResults();
            } else {
                document.getElementById('vote-status').textContent = 'Lỗi: ' + result.message;
                document.getElementById('vote-status').style.display = 'block';
                document.getElementById('vote-status').className = 'vote-status error';
            }
        } catch (error) {
            console.error('Lỗi khi gửi bình chọn:', error);
            document.getElementById('vote-status').textContent = 'Đã xảy ra lỗi khi xử lý bình chọn của bạn. Vui lòng thử lại.';
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
                    resultsContainer.innerHTML = '<p>Chưa có bình chọn nào. Hãy là người đầu tiên bình chọn!</p>';
                    return;
                }
                
                // Create results display
                const totalVotes = data.data.voteCount;
                const resultsList = document.createElement('div');
                resultsList.className = 'vote-results-list';
                
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
                        <div class="vote-count">${votes} phiếu (${percentage}%)</div>
                    `;
                    
                    resultsList.appendChild(resultItem);
                });
                
                resultsContainer.appendChild(resultsList);
                
                // Add total votes info
                const totalInfo = document.createElement('p');
                totalInfo.className = 'vote-total-info';
                totalInfo.textContent = `Tổng số phiếu bầu: ${totalVotes}`;
                resultsContainer.appendChild(totalInfo);
            }
        })
        .catch(error => console.error('Lỗi khi tải kết quả bình chọn:', error));
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
                        
                        // Check the appropriate radio button based on budget amount
                        const budgetAmount = data.data.budgetAmount || 0;
                        if (budgetAmount >= 2000000 && budgetAmount < 3000000) {
                            document.querySelector('input[name="budgetAmount"][value="3000000"]').checked = true;
                        } else if (budgetAmount >= 3000000 && budgetAmount < 4000000) {
                            document.querySelector('input[name="budgetAmount"][value="4000000"]').checked = true;
                        } else if (budgetAmount >= 4000000) {
                            document.querySelector('input[name="budgetAmount"][value="5000000"]').checked = true;
                        }
                        
                        document.getElementById('sponsor-amount').value = data.data.sponsorAmount || '';
                        
                        // Show update message
                        document.getElementById('budget-status').textContent = 'Bạn đã gửi thông tin ngân sách. Bạn có thể cập nhật lựa chọn của mình dưới đây.';
                        document.getElementById('budget-status').style.display = 'block';
                        document.getElementById('budget-status').className = 'vote-status info';
                    }
                })
                .catch(error => console.error('Lỗi khi kiểm tra thông tin ngân sách trước đó:', error));
        }
    });
    
    // Handle budget submission
    budgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('budget-name').value.trim();
        const email = document.getElementById('budget-email').value.trim();
        const budgetAmount = document.querySelector('input[name="budgetAmount"]:checked')?.value;
        const sponsorAmount = parseInt(document.getElementById('sponsor-amount').value.replace(/,/g, '')) || 0;
        
        if (!name || !email) {
            alert('Vui lòng cung cấp tên và email của bạn để gửi thông tin ngân sách.');
            return;
        }
        
        if (!budgetAmount) {
            alert('Vui lòng chọn một mức ngân sách.');
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
                document.getElementById('budget-status').textContent = 'Cảm ơn bạn đã gửi thông tin ngân sách!';
                document.getElementById('budget-status').style.display = 'block';
                document.getElementById('budget-status').className = 'vote-status success';
                loadBudgetResults();
            } else {
                document.getElementById('budget-status').textContent = 'Lỗi: ' + result.message;
                document.getElementById('budget-status').style.display = 'block';
                document.getElementById('budget-status').className = 'vote-status error';
            }
        } catch (error) {
            console.error('Lỗi khi gửi thông tin ngân sách:', error);
            document.getElementById('budget-status').textContent = 'Đã xảy ra lỗi khi xử lý thông tin của bạn. Vui lòng thử lại.';
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
                    budgetResultsContainer.innerHTML = '<p>Chưa có thông tin ngân sách nào được gửi. Hãy là người đầu tiên gửi!</p>';
                    return;
                }
                
                // Create results display
                const averageBudget = totalVotes > 0 ? Math.round(totalBudget / totalVotes) : 0;
                console.log(data);
                const budgetSummary = document.createElement('div');
                budgetSummary.className = 'budget-summary';
                budgetSummary.innerHTML = `
                    <div class="budget-stat">
                        <span class="stat-label">Ngân sách trung bình mỗi người:</span>
                        <span class="stat-value">${formatCurrency(averageBudget)} VND</span>
                    </div>
                    <div class="budget-stat">
                        <span class="stat-label">Tổng số người gửi thông tin ngân sách:</span>
                        <span class="stat-value">${totalVotes}</span>
                    </div>
                    <div class="budget-stat">
                        <span class="stat-label">Tổng số tiền tài trợ đã đề xuất:</span>
                        <span class="stat-value">${formatCurrency(totalSponsorship)} VND</span>
                    </div>
                `;
                
                budgetResultsContainer.appendChild(budgetSummary);
            }
        })
        .catch(error => console.error('Lỗi khi tải kết quả ngân sách:', error));
}

// Format currency in Vietnamese format
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Load photo gallery images
// Updated loadPhotoGallery function with simplified social interactions
function loadPhotoGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (galleryContainer) {
        // Try to fetch photos from the server
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
                        
                        // Create photo element
                        const img = document.createElement('img');
                        img.src = photo.cloudinaryUrl;
                        img.alt = photo.caption || 'Ảnh lớp học';
                        
                        // Create caption element if available
                        if (photo.caption) {
                            const caption = document.createElement('div');
                            caption.className = 'gallery-caption';
                            caption.textContent = photo.caption;
                            galleryItem.appendChild(caption);
                        }
                        
                        // Create social features
                        const socialSection = document.createElement('div');
                        socialSection.className = 'photo-social';
                        
                        // Like button
                        const likeButton = document.createElement('button');
                        likeButton.className = 'like-button';
                        likeButton.setAttribute('data-id', photo._id);
                        likeButton.innerHTML = `
                            <i class="far fa-heart"></i>
                            <span class="like-count">${photo.likes || 0}</span>
                        `;
                        
                        // Comment section
                        const commentSection = document.createElement('div');
                        commentSection.className = 'comment-section';
                        commentSection.innerHTML = `
                            <div class="comments-list" data-id="${photo._id}">
                                ${photo.comments && photo.comments.length > 0 ? 
                                    photo.comments.map(comment => `
                                        <div class="comment">
                                            <div class="comment-author">${comment.name}</div>
                                            <div class="comment-text">${comment.text}</div>
                                        </div>
                                    `).join('') : 
                                    '<p>Chưa có bình luận.</p>'
                                }
                            </div>
                            <form class="comment-form" data-id="${photo._id}">
                                <input type="text" placeholder="Thêm bình luận..." required>
                                <button type="submit">Gửi</button>
                            </form>
                        `;
                        
                        socialSection.appendChild(likeButton);
                        galleryItem.appendChild(img);
                        galleryItem.appendChild(socialSection);
                        galleryItem.appendChild(commentSection);
                        galleryContainer.appendChild(galleryItem);
                    });
                    
                    // Setup social feature interactions
                    setupPhotoSocialFeatures();
                } else {
                    // Use placeholder images if no photos
                    galleryContainer.innerHTML = '';
                    
                    const placeholderImages = [
                        { src: 'https://via.placeholder.com/300x200?text=Lễ+Tốt+Nghiệp', alt: 'Lễ Tốt Nghiệp' },
                        { src: 'https://via.placeholder.com/300x200?text=Dạ+Hội+Cuối+Năm', alt: 'Dạ Hội Cuối Năm' },
                        { src: 'https://via.placeholder.com/300x200?text=Trận+Bóng+Đá', alt: 'Trận Bóng Đá' },
                        { src: 'https://via.placeholder.com/300x200?text=Chuyến+Đi+Trường', alt: 'Chuyến Đi Trường' },
                        { src: 'https://via.placeholder.com/300x200?text=Hình+Kỷ+Yếu', alt: 'Hình Kỷ Yếu' },
                        { src: 'https://via.placeholder.com/300x200?text=Tuần+Lễ+Hội', alt: 'Tuần Lễ Hội' }
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
                console.error('Lỗi khi tải ảnh:', error);
                
                // Use placeholder images on error
                const placeholderImages = [
                    { src: 'https://via.placeholder.com/300x200?text=Lễ+Tốt+Nghiệp', alt: 'Lễ Tốt Nghiệp' },
                    { src: 'https://via.placeholder.com/300x200?text=Dạ+Hội+Cuối+Năm', alt: 'Dạ Hội Cuối Năm' },
                    { src: 'https://via.placeholder.com/300x200?text=Trận+Bóng+Đá', alt: 'Trận Bóng Đá' },
                    { src: 'https://via.placeholder.com/300x200?text=Chuyến+Đi+Trường', alt: 'Chuyến Đi Trường' },
                    { src: 'https://via.placeholder.com/300x200?text=Hình+Kỷ+Yếu', alt: 'Hình Kỷ Yếu' },
                    { src: 'https://via.placeholder.com/300x200?text=Tuần+Lễ+Hội', alt: 'Tuần Lễ Hội' }
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
            name: 'Nguyễn Thị Hương',
            image: 'https://via.placeholder.com/100x100?text=NTH',
            career: 'Hiệu trưởng trường học',
            bio: 'Sau khi tốt nghiệp Đại học Sư phạm Hà Nội, Hương trở thành giáo viên và gần đây được bổ nhiệm làm hiệu trưởng tại Trường Tiểu học Thăng Long.'
        },
        {
            name: 'Trần Văn Minh',
            image: 'https://via.placeholder.com/100x100?text=TVM',
            career: 'Kỹ sư phần mềm',
            bio: 'Minh đã thành lập một công ty khởi nghiệp công nghệ thành công sau khi tốt nghiệp Đại học Bách Khoa và hiện đang làm việc như một nhà phát triển cấp cao tại Google.'
        },
        {
            name: 'Hoàng Thị Lan',
            image: 'https://via.placeholder.com/100x100?text=HTL',
            career: 'Nhà báo',
            bio: 'Lan đã đi đến hơn 50 quốc gia với tư cách là phóng viên quốc tế cho VTV, đưa tin về các sự kiện quan trọng trên thế giới.'
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
                <p><strong>Nghề nghiệp:</strong> ${spotlight.career}</p>
                <p>${spotlight.bio}</p>
            `;
            
            spotlightContainer.appendChild(spotlightItem);
        });
    }
}

// Setup photo upload preview
// Photo upload preview
function setupPhotoUploadPreview() {
    const photoUpload = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview-container');
    const fileNameDisplay = document.getElementById('file-name-display');
    
    if (photoUpload && previewContainer) {
        photoUpload.addEventListener('change', function() {
            // Clear previous previews
            previewContainer.innerHTML = '';
            
            // Update file name display
            if (this.files && this.files.length > 0) {
                if (this.files.length === 1) {
                    fileNameDisplay.textContent = this.files[0].name;
                } else {
                    fileNameDisplay.textContent = `${this.files.length} tệp đã được chọn`;
                }
                
                // Create previews for each file
                for (let i = 0; i < this.files.length; i++) {
                    const file = this.files[i];
                    
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            const preview = document.createElement('img');
                            preview.src = e.target.result;
                            preview.className = 'photo-preview';
                            previewContainer.appendChild(preview);
                        }
                        
                        reader.readAsDataURL(file);
                    }
                }
            } else {
                fileNameDisplay.textContent = 'Chưa có tệp nào được chọn';
            }
        });
    }
}

// Initialize dashboard charts with enhanced attendee metrics
function initDashboardCharts() {
    fetch('/api/dashboard-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.data;
                
                // Update dashboard counters with attendee breakdown
                document.getElementById('adult-count').textContent = stats.adultCount || 0;
                document.getElementById('child-count').textContent = stats.childCount || 0;
                document.getElementById('infant-count').textContent = stats.infantCount || 0;
                document.getElementById('visitor-count').textContent = stats.visitors || 0;
                
                // Create registration chart
                const registrationCtx = document.getElementById('registration-chart').getContext('2d');
                new Chart(registrationCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Đã đăng ký', 'Dự kiến'],
                        datasets: [{
                            label: 'Số lượng đăng ký',
                            data: [stats.registrations, 60 - stats.registrations], // Assuming 100 expected attendees
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
                                text: 'Tiến độ đăng ký'
                            }
                        }
                    }
                });
                
                // Create budget chart with VND formatting
                const budgetCtx = document.getElementById('budget-chart').getContext('2d');
                new Chart(budgetCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Phí đăng ký', 'Tài trợ'],
                        datasets: [{
                            label: 'Nguồn ngân sách',
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
                                text: 'Nguồn ngân sách'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += formatCurrency(context.parsed.y) + ' VND';
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatCurrency(value) + ' VND';
                                    }
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Lỗi khi tải thống kê bảng điều khiển:', error));
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
            
            // Validate fields
            if (!formObject.name || !formObject.email || !formObject.adultTickets) {
                alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
                return;
            }
            
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
                    alert('Đăng ký thành công!');
                    registrationForm.reset();
                    
                    // Update dashboard counts immediately
                    updateDashboardCounts();
                } else {
                    alert('Lỗi: ' + result.message);
                }
            } catch (error) {
                console.error('Lỗi khi gửi đăng ký:', error);
                alert('Đã xảy ra lỗi khi xử lý đăng ký của bạn. Vui lòng thử lại.');
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
                alert('Vui lòng chọn ít nhất một ảnh để tải lên.');
                return;
            }
            
            try {
                // Create FormData for file upload
                const formData = new FormData();
                
                // Add user info
                formData.append('name', document.getElementById('photo-name').value || 'Không tên');
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
                    alert(`${result.data.length} ảnh đã được tải lên thành công!`);
                    photoForm.reset();
                    
                    // Clear the file input and preview
                    fileInput.value = '';
                    document.getElementById('photo-preview-container').innerHTML = '';
                    
                    // Reload photo gallery to show new photos
                    loadPhotoGallery();
                } else {
                    alert('Lỗi: ' + result.message);
                }
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên:', error);
                alert('Đã xảy ra lỗi khi tải ảnh của bạn. Vui lòng thử lại.');
            }
        });
    }
    
    // Volunteer button
    const volunteerBtn = document.getElementById('volunteer-btn');
    if (volunteerBtn) {
        volunteerBtn.addEventListener('click', () => {
            const roles = ['Trang trí', 'Bàn đăng ký', 'Chụp ảnh', 'Âm nhạc và thiết bị AV'];
            const role = prompt(`Bạn muốn đăng ký làm tình nguyện viên cho vai trò nào?\n\n${roles.join('\n')}`);
            
            if (role) {
                alert(`Cảm ơn bạn đã đăng ký làm tình nguyện viên! Một thành viên ban tổ chức sẽ liên hệ với bạn sớm về vai trò "${role}".`);
            }
        });
    }
    
    // Memorabilia button
    const memorabiliaBtn = document.getElementById('memorabilia-btn');
    if (memorabiliaBtn) {
        memorabiliaBtn.addEventListener('click', () => {
            const info = prompt('Vui lòng mô tả kỷ vật bạn muốn chia sẻ:');
            
            if (info) {
                alert('Cảm ơn bạn! Một thành viên ban tổ chức sẽ liên hệ với bạn về kỷ vật này.');
            }
        });
    }
}

// Update dashboard counts after registration
function updateDashboardCounts() {
    fetch('/api/dashboard-stats')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const stats = data.data;
                
                // Update dashboard counters
                document.getElementById('adult-count').textContent = stats.adultCount || 0;
                document.getElementById('child-count').textContent = stats.childCount || 0;
                document.getElementById('infant-count').textContent = stats.infantCount || 0;
            }
        })
        .catch(error => console.error('Lỗi khi cập nhật số liệu thống kê:', error));
}

// Helper function to validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Social features for photos
// Social features for photos with simplified interaction
function setupPhotoSocialFeatures() {
    // Like button functionality
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const photoId = this.getAttribute('data-id');
            const likeCount = this.querySelector('.like-count');
            const currentLikes = parseInt(likeCount.textContent);
            const heartIcon = this.querySelector('i');
            
            // Toggle like status
            const isLiked = heartIcon.classList.contains('fas');
            
            // Get user name only - simplified interaction
            const userName = prompt('Nhập tên của bạn để thích ảnh này:');
            
            if (!userName || userName.trim() === '') {
                alert('Vui lòng nhập tên của bạn.');
                return;
            }
            
            // Send like/unlike request to server
            fetch(`/api/photo/${photoId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: userName }),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Update UI based on like status
                    if (result.data.liked) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        heartIcon.style.color = 'red';
                    } else {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        heartIcon.style.color = '';
                    }
                    
                    // Update like count
                    likeCount.textContent = result.data.likes;
                } else {
                    alert('Lỗi: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Lỗi khi thích/bỏ thích ảnh:', error);
                
                // Fallback for demo without backend
                if (isLiked) {
                    heartIcon.classList.remove('fas');
                    heartIcon.classList.add('far');
                    heartIcon.style.color = '';
                    likeCount.textContent = currentLikes - 1;
                } else {
                    heartIcon.classList.remove('far');
                    heartIcon.classList.add('fas');
                    heartIcon.style.color = 'red';
                    likeCount.textContent = currentLikes + 1;
                }
            });
        });
    });
    
    // Comment submission
    document.querySelectorAll('.comment-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const photoId = this.getAttribute('data-id');
            const commentInput = this.querySelector('input');
            const commentText = commentInput.value.trim();
            
            if (!commentText) {
                return;
            }
            
            // Get user name only - simplified interaction
            const userName = prompt('Nhập tên của bạn để bình luận:');
            
            if (!userName || userName.trim() === '') {
                alert('Vui lòng nhập tên của bạn.');
                return;
            }
            
            // Send comment to server
            fetch(`/api/photo/${photoId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    text: commentText
                }),
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Add comment to UI
                    const commentsContainer = document.querySelector(`.comments-list[data-id="${photoId}"]`);
                    
                    // Clear "no comments" message if it exists
                    if (commentsContainer.innerHTML.includes('Chưa có bình luận.')) {
                        commentsContainer.innerHTML = '';
                    }
                    
                    const newComment = document.createElement('div');
                    newComment.className = 'comment';
                    newComment.innerHTML = `
                        <div class="comment-author">${userName}</div>
                        <div class="comment-text">${commentText}</div>
                    `;
                    
                    commentsContainer.appendChild(newComment);
                    
                    // Clear input
                    commentInput.value = '';
                } else {
                    alert('Lỗi: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Lỗi khi thêm bình luận:', error);
                
                // Fallback for demo without backend
                const commentsContainer = document.querySelector(`.comments-list[data-id="${photoId}"]`);
                
                // Clear "no comments" message if it exists
                if (commentsContainer.innerHTML.includes('Chưa có bình luận.')) {
                    commentsContainer.innerHTML = '';
                }
                
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-author">${userName}</div>
                    <div class="comment-text">${commentText}</div>
                `;
                
                commentsContainer.appendChild(newComment);
                
                // Clear input
                commentInput.value = '';
            });
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const moneyInput = document.getElementById('sponsor-amount');
    
    // Set input type to text and inputmode to numeric
    moneyInput.setAttribute('inputmode', 'numeric');
    
    // Format when value changes
    moneyInput.addEventListener('input', function() {
      // Remove non-digits and format
      const value = this.value.replace(/\D/g, '');
      // Format the number with commas
      if (value) {
        // this.value = new Intl.NumberFormat('vi-VN').format(value);
        this.value = new Intl.NumberFormat('en-US').format(parseInt(value) || 0);
      }
    });
    
    // Handle form submission (if needed)
    const form = moneyInput.closest('form');
    if (form) {
      form.addEventListener('submit', function() {
        // Remove commas before submitting
        moneyInput.value = moneyInput.value.replace(/,/g, '');
      });
    }
    
  });
