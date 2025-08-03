// To run this code, you need to have Node.js installed.
// First, initialize a new project in your directory:
// npm init -y
// Then install the required packages:
// npm install express nodemailer body-parser dotenv

// For security, create a file named `.env` in the same directory and add your credentials:
// EMAIL_USER="iankwalia@gmail.com"
// EMAIL_PASS="GICF" 
// (Note: This file should NOT be committed to version control like Git)

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '')));

// Create a Nodemailer transporter using your email credentials from environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' as your email service
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your App Password
    }
});

// A simple GET route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The POST endpoint for handling contact form submissions
app.post('/submit-form', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validate the incoming data
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All form fields are required.' });
    }

    // Email message content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // The recipient is your own email
        subject: `New Contact Form Submission: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Nodemailer Error:', error);
            return res.status(500).json({ success: false, message: 'Failed to send message. Please try again later.' });
        }
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
