// server.js - Node.js backend
const express = require('express');
const nodemailer = require('nodemailer');
const Airtable = require('airtable');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML, CSS, JS files

// Configure Airtable
const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// Configure email transporter
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use app-specific password for Gmail
    }
});

// API endpoint for booking consultations
app.post('/api/book-consultation', async (req, res) => {
    try {
        const { firstName, lastName, phone, email, date, time, timestamp } = req.body;
        
        // Save to Airtable
        const airtableRecord = await base('Consultations').create([
            {
                fields: {
                    'First Name': firstName,
                    'Last Name': lastName,
                    'Phone': phone,
                    'Email': email,
                    'Consultation Date': date,
                    'Consultation Time': time,
                    'Status': 'Pending Confirmation',
                    'Booking Date': new Date().toISOString().split('T')[0],
                    'Timestamp': timestamp
                }
            }
        ]);
        
        // Send email notification to you
        await sendNotificationEmail({
            firstName,
            lastName,
            phone,
            email,
            date,
            time
        });
        
        // Send confirmation email to client
        await sendConfirmationEmail({
            firstName,
            lastName,
            email,
            date,
            time
        });
        
        res.json({
            success: true,
            message: 'Consultation booked successfully',
            recordId: airtableRecord[0].id
        });
        
    } catch (error) {
        console.error('Error booking consultation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book consultation'
        });
    }
});

// Function to send notification email to you
async function sendNotificationEmail(data) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'MattJEllis1@gmail.com',
        subject: '🎯 New Consultation Booking - Power of The Purse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00694A;">New Consultation Booking!</h2>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #00694A; margin-top: 0;">Client Information:</h3>
                    <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone}</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #00694A; margin-top: 0;">Appointment Details:</h3>
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ul>
                    <li>Contact the client to confirm the appointment</li>
                    <li>Send them your meeting link or location details</li>
                    <li>Update the status in your Airtable</li>
                </ul>
                
                <p style="margin-top: 30px; color: #666;">
                    This booking was automatically saved to your Airtable base.
                </p>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

// Function to send confirmation email to client
async function sendConfirmationEmail(data) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: 'Consultation Booking Confirmation - Power of The Purse',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00694A;">Thank You for Booking Your Free Consultation!</h2>
                
                <p>Hi ${data.firstName},</p>
                
                <p>Thank you for scheduling your free financial consultation with Matt Ellis. I'm excited to help you take control of your financial future!</p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #00694A; margin-top: 0;">Your Appointment Details:</h3>
                    <p><strong>Date:</strong> ${data.date}</p>
                    <p><strong>Time:</strong> ${data.time}</p>
                    <p><strong>Duration:</strong> 30-45 minutes</p>
                </div>
                
                <h3 style="color: #00694A;">What to Bring:</h3>
                <ul>
                    <li>Recent bank statements</li>
                    <li>List of current debts and monthly payments</li>
                    <li>Your financial goals and concerns</li>
                    <li>Any questions about your financial future</li>
                </ul>
                
                <p><strong>I'll be contacting you soon to confirm the appointment and provide meeting details.</strong></p>
                
                <p>If you have any questions or need to reschedule, please reply to this email or call me at (440) 527-4500.</p>
                
                <p>Looking forward to our conversation!</p>
                
                <div style="margin-top: 30px; padding: 20px; background: #00694A; color: white; border-radius: 10px;">
                    <p style="margin: 0;"><strong>Matt Ellis</strong><br>
                    Power of The Purse<br>
                    Personal Finance Coach<br>
                    MattJEllis1@gmail.com<br>
                    (440) 527-4500</p>
                </div>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;