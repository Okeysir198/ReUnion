# High School Reunion Website

A complete, customizable website for a 20-year high school reunion, featuring event details, registration, photo sharing, and an administrative interface.

![High School Reunion Banner](frontend/images/logo.png)

## 🌟 Features

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Dynamic Content**: Countdown timer, photo gallery, and interactive map
- **Online Registration**: Early bird and regular pricing with guest options
- **Photo Sharing**: Allow classmates to upload and share photos
- **Payment Integration**: Ready to connect with payment processors
- **Admin Dashboard**: Secure interface for managing registrations, photos, and event settings
- **Email Notifications**: Automated emails for registrations and updates

## 📋 Project Structure

The project follows a modern full-stack JavaScript architecture:

- **Frontend**: HTML, CSS, and vanilla JavaScript for a lightweight experience
- **Backend**: Node.js with Express for the API server
- **Database**: MongoDB for data storage
- **Authentication**: JWT-based authentication for admin access

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/reunion-website.git
   cd reunion-website
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/reunion-website
   JWT_SECRET=your_jwt_secret
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=reunion@example.com
   EMAIL_PASS=your_email_password
   EMAIL_FROM=reunion@classof2005.com
   ```

5. **Start the development server**
   ```bash
   # Start backend server
   npm run dev
   
   # In a separate terminal, start frontend server
   cd frontend
   npm start
   ```

6. **Access the application**
   - Main website: http://localhost:3000
   - Admin login: http://localhost:3000/login.html

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

## 👩‍💻 Admin Access

The admin dashboard provides tools to manage all aspects of the reunion:

1. **Default Login Credentials**
   - Username: `admin`
   - Password: `reunion2025`
   - **Important**: Change these credentials before deployment!

2. **Dashboard Features**
   - View and manage registrations
   - Approve uploaded photos
   - Organize volunteer assignments
   - Configure website settings
   - Export registration data to CSV

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

## 🔐 Security Considerations

1. **Authentication**: JWT-based admin authentication
2. **Password Storage**: Secure password hashing with bcrypt
3. **Input Validation**: Server-side validation for all user inputs
4. **Environment Variables**: Sensitive configuration stored in `.env`
5. **Photo Approval**: Admin review required before photos are public

## 📦 Deployment

See the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to:
- Traditional web hosting
- Heroku
- DigitalOcean
- AWS

## 🧩 Technology Stack

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Chart.js for analytics
  - Leaflet.js for maps

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Multer for file uploads
  - Nodemailer for emails

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com/) for icons
- [Chart.js](https://www.chartjs.org/) for data visualization
- [Leaflet](https://leafletjs.com/) for maps
- [Multer](https://github.com/expressjs/multer) for file uploads