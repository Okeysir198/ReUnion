I'll provide you with updated English versions of the readme, folder structure documentation, and deployment guide to reflect the changes made to the project.

# High School Math Class Reunion Website

A complete, customizable website for a 20-year high school math class reunion, featuring event details, registration, photo sharing, event voting, budget planning, and an administrative interface.

![Math Class Reunion Banner](frontend/images/logo.svg)

## 🌟 Features

- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Dynamic Content**: Countdown timer, photo gallery, and interactive venue map
- **Online Registration**: Registration for adults and children with multiple pricing tiers
- **Photo Sharing**: Allow classmates to upload and share photos, like and comment
- **Event Voting**: Vote on reunion dates and express budget preferences
- **Budget Planning**: Propose budget levels and sponsorships for fellow classmates
- **Dashboard**: Track registrations, website visits, budget, and more
- **Admin Dashboard**: Secure interface for managing all aspects of the reunion
- **Payment Integration**: Ready to connect with payment processors
- **Email Notifications**: Automated emails for registrations and updates
- **Persistent Data Storage**: MongoDB integration for reliable data storage
- **Cloud Image Storage**: Cloudinary integration for scalable image hosting

## 📋 Project Structure

The project follows a modern JavaScript architecture:

- **Frontend**: HTML, CSS, and vanilla JavaScript for a lightweight experience
- **Backend**: Node.js with Express for the API server
- **Data Storage**: MongoDB for database storage
- **Image Storage**: Cloudinary for cloud-based image storage
- **Authentication**: JWT-based authentication for admin access

```
reunion-website/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js       # Cloudinary configuration
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/
│   │   ├── photoController.js  # Photo upload and social features
│   │   ├── registrationController.js # User and family registration
│   │   ├── statsController.js  # Website statistics with improved visitor tracking
│   │   └── voteController.js   # Event date and budget voting with change tracking
│   ├── models/
│   │   ├── Photo.js            # Photo MongoDB schema with social features
│   │   ├── Stats.js            # Stats MongoDB schema with attendee breakdowns
│   │   ├── User.js             # User registration MongoDB schema with family attendees
│   │   └── Vote.js             # Vote MongoDB schema with change tracking
│   ├── routes/
│   │   ├── api.js              # API routes with new social and tracking endpoints
│   │   └── auth.js             # Authentication routes
│   ├── utils/
│   │   ├── auth.js             # Authentication utilities
│   │   └── emailUtils.js       # Email sending utilities with Vietnamese templates
│   └── server.js               # Main Express server
├── frontend/
│   ├── css/
│   │   ├── admin.css           # Admin dashboard styles
│   │   ├── responsive.css      # Responsive design styles
│   │   └── style.css           # Main website styles with Vietnamese layout
│   ├── images/
│   │   ├── logo.svg            # Math class logo
│   │   └── ... (other images)
│   ├── js/
│   │   ├── admin.js            # Admin dashboard functionality
│   │   ├── countdown.js        # Countdown timer logic
│   │   └── main.js             # Main website functionality with VND formatting
│   ├── admin.html              # Admin dashboard HTML
│   ├── index.html              # Main website HTML in Vietnamese
│   └── login.html              # Admin login HTML
├── node_modules/               # npm packages (not tracked in git)
├── .env                        # Environment variables (not tracked in git)
├── .env.example                # Example environment variables template
├── .gitignore                  # Git ignore configuration
├── DEPLOYMENT.md               # Deployment guide
├── LICENSE                     # Project license
├── package.json                # npm dependencies and scripts
├── package-lock.json           # npm lock file
└── README.md                   # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)

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
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
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

1. **Update Class Information**
   - Edit class name, logo, and colors in `frontend/css/style.css`
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

This project is ready for deployment on Heroku with MongoDB Atlas:

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

5. **Configure environment variables on Heroku**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_cloudinary_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   heroku config:set NODE_ENV=production
   ```

6. **Push to Heroku**
   ```bash
   git push heroku main
   ```

7. **Open your app**
   ```bash
   heroku open
   ```

For more detailed deployment instructions, see the [Deployment Guide](DEPLOYMENT.md).

## 🔐 Security Considerations

1. **Authentication**: JWT-based admin authentication
2. **Password Storage**: Secure password hashing with bcrypt
3. **Input Validation**: Server-side validation for all user inputs
4. **Environment Variables**: Sensitive configuration stored in `.env`
5. **Change Tracking**: History tracking for all user modifications

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
  - MongoDB
  - Mongoose ODM
  - JWT for authentication
  - Multer for file uploads
  - Cloudinary for image storage
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

---

# Deployment Guide

This guide will help you deploy the Math Class Reunion website on Heroku with MongoDB Atlas as the database and Cloudinary for image storage.

## Prerequisites

- [Git](https://git-scm.com/downloads) installed
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Node.js](https://nodejs.org/) installed (v16+)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
- A [Cloudinary](https://cloudinary.com/) account (free tier available)

## Step 1: Set Up MongoDB Atlas

1. Create a MongoDB Atlas account or sign in at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (the free shared cluster is sufficient)
3. Set up a database user with read/write permissions
4. Add your IP address to the IP access list or set to allow access from anywhere (0.0.0.0/0)
5. Get your connection string by clicking "Connect" > "Connect your application"
6. Note your connection string - it should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/reunion-website?retryWrites=true&w=majority
   ```

## Step 2: Set Up Cloudinary

1. Create a Cloudinary account or sign in at https://cloudinary.com/
2. From your dashboard, note your:
   - Cloud name
   - API Key
   - API Secret

## Step 3: Configure Project for Production

1. Make sure your database schema models include the correct changes for:
   - Enhanced user registration with adult/child/infant attendees
   - Budget voting with the new VND pricing tiers
   - Photo social features (likes and comments)
   - Change tracking for both registrations and votes

2. Update email templates in `backend/utils/emailUtils.js` with the Vietnamese translations

3. Ensure the frontend is properly formatted for VND currency in:
   - Chart.js visualizations
   - Registration price displays
   - Budget voting options

4. Test all features locally before deploying:
   ```bash
   npm run dev
   ```

## Step 4: Deploy to Heroku

### Option 1: Deploy using Heroku CLI

1. Login to Heroku:
   ```
   heroku login
   ```

2. Create a new Heroku app:
   ```
   heroku create your-reunion-app-name
   ```

3. Set up environment variables:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   heroku config:set CLOUDINARY_API_KEY=your_cloudinary_api_key
   heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   heroku config:set NODE_ENV=production
   ```

4. Push your code to Heroku:
   ```
   git push heroku main
   ```

### Option 2: Deploy with Heroku Dashboard

1. Create a new app on the [Heroku Dashboard](https://dashboard.heroku.com/)
2. Connect your GitHub repository in the "Deploy" tab
3. In the "Settings" tab, add the following Config Vars:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret string for JWT token signing
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: Set to "production"
4. Enable automatic deploys from your main branch

## Step 5: Verify Deployment

1. Open your app with:
   ```
   heroku open
   ```
   or click "Open App" on the Heroku Dashboard

2. Test the site functionality:
   - Registration for adults, children, and infants
   - Photo uploads with social features
   - Voting with VND budget options
   - Change tracking for user modifications
   - Admin access

## Step 6: Production Considerations

1. **Change Admin Password**: Update the default credentials immediately after deployment
2. **Set Up Custom Domain**: Configure a custom domain if desired
3. **Email Configuration**: Set up a production email provider
4. **Regular Backups**: Set up automated MongoDB Atlas backups
5. **Usage Monitoring**: Monitor your Cloudinary and MongoDB usage to stay within free tier limits
6. **Analytics**: Consider adding Google Analytics or a similar service

## Troubleshooting

If you encounter issues, check the Heroku logs:
```
heroku logs --tail
```

Common issues and solutions:

- **MongoDB connection errors**: Verify your connection string and ensure your IP is whitelisted
- **Cloudinary upload errors**: Check your Cloudinary credentials
- **Currency format issues**: Check for correct VND formatting throughout the application
- **Admin login issues**: Ensure the JWT secret is properly set

## Maintenance

- Regularly update Node.js dependencies
- Monitor MongoDB Atlas and Cloudinary usage
- Back up your MongoDB database regularly
- Test all features after any significant updates

For additional support, refer to:
- [Heroku Documentation](https://devcenter.heroku.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)