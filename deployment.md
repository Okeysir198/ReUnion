# Deployment Guide for the Reunion Website

This guide will help you deploy the reunion website on Heroku with MongoDB Atlas as the database and Cloudinary for image storage.

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

## Step 3: Deploy to Heroku

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

## Step 4: Verify Deployment

1. Open your app with:
   ```
   heroku open
   ```
   or click "Open App" on the Heroku Dashboard

2. Test the site functionality:
   - Registration
   - Photo uploads
   - Voting
   - Admin access

## Troubleshooting

If you encounter issues, check the Heroku logs:
```
heroku logs --tail
```

Common issues and solutions:

- **MongoDB connection errors**: Verify your connection string and ensure your IP is whitelisted in MongoDB Atlas
- **Cloudinary upload errors**: Check your Cloudinary credentials
- **Admin login issues**: The default login is username: `admin`, password: `reunion2025`

## Post-Deployment Steps

1. Change the default admin password for security
2. Set up custom domain (optional)
3. Configure email settings if you want to enable email notifications

## Backup and Maintenance

- MongoDB Atlas provides automated backups for your data
- Regularly check the Heroku dashboard for any required maintenance
- Monitor your Cloudinary usage to stay within the free tier limits

## Contact

If you need further assistance, please contact the development team at [your contact information].