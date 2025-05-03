# High School Reunion Website

A complete, customizable website for a 20-year high school reunion, featuring event details, registration, photo sharing, event voting, budget planning, and an administrative interface.

![High School Reunion Banner](frontend/images/logo.svg)

## 🌟 Features

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Dynamic Content**: Countdown timer, photo gallery, and interactive venue map
- **Online Registration**: Early bird and regular pricing with guest options
- **Photo Sharing**: Allow classmates to upload and share photos
- **Event Voting**: Vote on reunion dates and express budget preferences
- **Budget Planning**: Input budget preferences and offer sponsorships
- **Dashboard**: Track registrations, website visits, budget, and more
- **Admin Dashboard**: Secure interface for managing all aspects of the reunion
- **Payment Integration**: Ready to connect with payment processors
- **Email Notifications**: Automated emails for registrations and updates

## 📋 Project Structure

The project follows a modern JavaScript architecture:

- **Frontend**: HTML, CSS, and vanilla JavaScript for a lightweight experience
- **Backend**: Node.js with Express for the API server
- **Data Storage**: Local JSON file-based storage for easy deployment
- **Authentication**: JWT-based authentication for admin access

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/reunion-website.git
   cd reunion-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=reunion@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=reunion@classof2005.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main website: http://localhost:5000
   - Admin login: http://localhost:5000/login.html (username: admin, password: reunion2025)

## 🎨 Customization

### Basic Customization

1. **Update School Information**
   - Edit the school name, logo, and colors in `frontend/css/style.css`
   - Replace images in the `frontend/images` directory

2. **Event Details**
   - Update event dates, venue, and schedule in `frontend/index.html`
   - Modify the countdown date in `frontend/js/countdown.js`

3. **Pricing and Registration**
   - Adjust ticket prices and options in `frontend/index.html`
   - Modify backend price calculations in `backend/models/User.js`

### Advanced Customization

1. **Adding New Sections**
   - Add new HTML sections to `frontend/index.html`
   - Create corresponding styling in `frontend/css/style.css`
   - Add any required JavaScript functionality in `frontend/js/main.js`

2. **Custom Email Templates**
   - Modify email templates in `backend/utils/emailUtils.js`

3. **Payment Integration**
   - Implement a payment gateway in `backend/controllers/registrationController.js`

## 📱 Mobile Responsiveness

The website is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones

The responsive design automatically adjusts layouts, font sizes, and navigation based on screen size.

## 📧 Email Functionality

The system can send automated emails for:
- Registration confirmation
- Payment confirmation
- Photo submission notification
- Volunteer signup confirmation
- Admin notifications

To enable emails, configure the SMTP settings in the `.env` file.

## 🌐 Heroku Deployment

This project is ready for deployment on Heroku:

1. **Create a Heroku account**
   Sign up at [heroku.com](https://heroku.com) if you don't have an account.

2. **Install Heroku CLI**
   Follow the instructions at [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli).

3. **Login to Heroku**
   ```bash
   heroku login
   ```

4. **Create a new Heroku app**
   ```bash
   heroku create your-reunion-app-name
   ```

5. **Push to Heroku**
   ```bash
   git push heroku main
   ```

6. **Open your app**
   ```bash
   heroku open
   ```

## 🔐 Security Considerations

1. **Authentication**: JWT-based admin authentication
2. **Password Storage**: Secure password hashing with bcrypt
3. **Input Validation**: Server-side validation for all user inputs
4. **Environment Variables**: Sensitive configuration stored in `.env`
5. **Photo Approval**: Admin review required before photos are public

## 📦 Technology Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Chart.js for analytics
  - Leaflet.js for maps

- **Backend**:
  - Node.js
  - Express.js
  - JSON file-based data storage
  - JWT for authentication
  - Multer for file uploads
  - Nodemailer for emails

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👥 Admin Access

Default login credentials:
- Username: `admin`
- Password: `reunion2025`

**Important**: Change these credentials before deployment!