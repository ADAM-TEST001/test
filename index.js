const express = require('express');
const cors = require('cors');
const connect_db = require('./connect_db/connect_db');
const dotenv = require('dotenv').config();
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
connect_db();



app.use(morgan("dev"));
app.use(express.json());



app.get('/test', async (req, res) => {
     return res.json(process.env);
});

app.use("/user", require("./Routes/UserRoutes"));

// Define schema and model for token
const tokenSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, expires: '2m', default: Date.now } // Expires after 2 minutes
});
const Token = mongoose.model('Token', tokenSchema);

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
     service: 'gmail',
    auth: {
        user: 'test.adam011@gmail.com',
        pass: 'bxpu mmxl begv xdti '
    },
});

// Generate a unique token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Function to send verification email
async function sendVerificationEmail(email, token) {
    const verificationLink = `http://localhost:5000/verify?token=${token}`;
    const mailOptions = {
        from: 'your_gmail_address@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Please click the following link to verify your email: ${verificationLink}`
    };

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });
}

// Route to register a new user
app.post('/register', async (req, res) => {
    const { email } = req.body.userDetails;

    // Generate token
    const token = generateToken();

    // Save token in MongoDB
    try {
        await Token.create({ email, token });
        // Send verification email
        await sendVerificationEmail(email, token);
        res.json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error saving token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to verify email
app.get('/verify', async (req, res) => {
    const { token } = req.query;

    try {
        const tokenData = await Token.findOneAndDelete({ token });
        if (!tokenData) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        // Perform verification actions (e.g., mark email as verified)
        // Here, we're just responding with a success message
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5000, async () => {
     
    console.log("server is up");
});
