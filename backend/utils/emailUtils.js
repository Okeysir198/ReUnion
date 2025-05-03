// Email Utility Functions
const nodemailer = require('nodemailer');

// Create transporter object using SMTP transport
// In production, use environment variables for these credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'reunion@example.com',
    pass: process.env.EMAIL_PASS || 'password',
  },
});

// Send registration confirmation email
exports.sendRegistrationConfirmation = async (user) => {
  try {
    // Calculate ticket price based on type
    const ticketPrice = user.ticketType === 'early' ? 85 : 120;
    const guestPrice = 95;
    const totalGuestCost = user.guestTickets * guestPrice;
    const totalCost = ticketPrice + totalGuestCost;
    
    // HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #3b5998;">Class of 2005 Reunion Registration Confirmation</h2>
        
        <p>Dear ${user.name},</p>
        
        <p>Thank you for registering for our 20-year high school reunion! We're excited to see you there and catch up on the last two decades.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Registration Details:</h3>
          <p><strong>Name:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
          <p><strong>Ticket Type:</strong> ${user.ticketType === 'early' ? 'Early Bird' : 'Regular'}</p>
          <p><strong>Guest Tickets:</strong> ${user.guestTickets}</p>
          <p><strong>Dietary Restrictions:</strong> ${user.dietary || 'None specified'}</p>
        </div>
        
        <div style="background-color: #f2f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Information:</h3>
          <p><strong>Ticket Price:</strong> $${ticketPrice}</p>
          ${user.guestTickets > 0 ? `<p><strong>Guest Tickets:</strong> ${user.guestTickets} × $95 = $${totalGuestCost}</p>` : ''}
          <p style="font-size: 18px;"><strong>Total Amount:</strong> $${totalCost}</p>
          <p><strong>Payment Status:</strong> ${user.paymentStatus === 'completed' ? 'Paid' : 'Pending'}</p>
          
          ${user.paymentStatus !== 'completed' ? `
          <p>To complete your registration, please make your payment using the link below:</p>
          <p style="text-align: center;">
            <a href="https://reunionwebsite.com/payment/${user._id}" style="display: inline-block; background-color: #3b5998; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Make Payment</a>
          </p>
          ` : ''}
        </div>
        
        <h3>Event Details:</h3>
        <p><strong>Dates:</strong> September 24-26, 2025</p>
        <p><strong>Location:</strong> Grand Central Hotel, Downtown</p>
        
        <p>Mark your calendar and don't forget to upload your photos to our gallery!</p>
        
        <p>If you have any questions, please contact the reunion committee at <a href="mailto:reunion@classof2005.com">reunion@classof2005.com</a>.</p>
        
        <p>Looking forward to seeing you in September!</p>
        
        <p>Warm regards,<br>Class of 2005 Reunion Committee</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: '"Class of 2005 Reunion" <reunion@classof2005.com>',
      to: user.email,
      subject: 'Your Class of 2005 Reunion Registration Confirmation',
      html: htmlContent,
    });
    
    console.log('Registration confirmation email sent:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    return false;
  }
};

// Send payment confirmation email
exports.sendPaymentConfirmation = async (user) => {
  try {
    // HTML email template for payment confirmation
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #3b5998;">Class of 2005 Reunion Payment Confirmation</h2>
        
        <p>Dear ${user.name},</p>
        
        <p>Thank you for completing your payment for our 20-year high school reunion!</p>
        
        <div style="background-color: #f0f7e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #28a745;">Payment Successful</h3>
          <p><strong>Amount Paid:</strong> $${user.paymentAmount}</p>
          <p><strong>Payment Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> ${user._id}-${Date.now().toString().slice(-6)}</p>
        </div>
        
        <p>Your registration is now complete. We've added you to our attendee list, and we're looking forward to seeing you at the reunion!</p>
        
        <h3>Event Details:</h3>
        <p><strong>Dates:</strong> September 24-26, 2025</p>
        <p><strong>Location:</strong> Grand Central Hotel, Downtown</p>
        
        <p>We'll send more details as we get closer to the event. In the meantime, don't forget to upload your photos to our gallery and spread the word to other classmates!</p>
        
        <p>If you have any questions, please contact the reunion committee at <a href="mailto:reunion@classof2005.com">reunion@classof2005.com</a>.</p>
        
        <p>See you in September!</p>
        
        <p>Warm regards,<br>Class of 2005 Reunion Committee</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: '"Class of 2005 Reunion" <reunion@classof2005.com>',
      to: user.email,
      subject: 'Your Class of 2005 Reunion Payment Confirmation',
      html: htmlContent,
    });
    
    console.log('Payment confirmation email sent:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return false;
  }
};

// Send photo upload notification to admin
exports.sendPhotoUploadNotification = async (photos) => {
  try {
    // Get uploader info from first photo (they should all be from the same person)
    const { uploaderName, uploaderEmail } = photos[0];
    
    // HTML email template for admin notification
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #3b5998;">New Photos Uploaded</h2>
        
        <p>Hello Admin,</p>
        
        <p>${uploaderName} (${uploaderEmail}) has uploaded ${photos.length} new photo(s) to the reunion website.</p>
        
        <p>These photos are pending your approval and will not be visible on the website until you review and approve them.</p>
        
        <p style="text-align: center; margin: 25px 0;">
          <a href="https://reunionwebsite.com/admin/photos" style="display: inline-block; background-color: #3b5998; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Review Photos</a>
        </p>
        
        <p>Please review these photos at your earliest convenience.</p>
        
        <p>Thank you,<br>Reunion Website System</p>
      </div>
    `;
    
    // Send email to admin
    const info = await transporter.sendMail({
      from: '"Reunion Website" <noreply@classof2005.com>',
      to: 'admin@classof2005.com',
      subject: `New Photos Uploaded by ${uploaderName}`,
      html: htmlContent,
    });
    
    console.log('Admin notification email sent:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return false;
  }
};

// Send volunteer confirmation
exports.sendVolunteerConfirmation = async (volunteerData) => {
  try {
    const { name, email, phone, role } = volunteerData;
    
    // HTML email template for volunteer confirmation
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #3b5998;">Thank You for Volunteering!</h2>
        
        <p>Dear ${name},</p>
        
        <p>Thank you for volunteering to help with our 20-year high school reunion! Your support will help make this event a great success.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Volunteer Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Role:</strong> ${role}</p>
        </div>
        
        <p>A member of our committee will be in touch with you soon to discuss details about your role and schedule.</p>
        
        <p>If you have any questions in the meantime, please contact the volunteer coordinator at <a href="mailto:volunteers@classof2005.com">volunteers@classof2005.com</a>.</p>
        
        <p>We appreciate your willingness to help and look forward to working with you!</p>
        
        <p>Warm regards,<br>Class of 2005 Reunion Committee</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center;">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: '"Class of 2005 Reunion" <reunion@classof2005.com>',
      to: email,
      subject: 'Thank You for Volunteering - Class of 2005 Reunion',
      html: htmlContent,
    });
    
    console.log('Volunteer confirmation email sent:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error sending volunteer confirmation email:', error);
    return false;
  }
};

// Export the transporter for use in other modules if needed
exports.transporter = transporter;