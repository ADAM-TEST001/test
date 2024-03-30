const express = require('express')

const cors = require('cors')
const connect_db = require('./connect_db/connect_db')

const dotenv = require('dotenv').config()

const morgan = require('morgan')

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(morgan("dev"))

app.use(express.json())

app.get('/test', async (req, res) => {
     return   res.json("done");
   
});


app.use("/user", require("./Routes/UserRoutes"))

// Route to register a new user
app.post('/register', async (req, res) => {
    const { email } = req.body.userDetails;

    // Generate token
    const token = generateToken();

    // Save token in MongoDB
    try {
        // await Token.create({ email, token });
        // Send verification email
        sendVerificationEmail(email, token);
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


const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const crypto = require('crypto');

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
    tls: {
        rejectUnauthorized: false
    },
});

// Generate a unique token
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Function to send verification email
function sendVerificationEmail(email, token) {
    const verificationLink = `http://localhost:5000/verify?token=${token}`;
    const mailOptions = {
         secure: true,
        from: 'test.adam011@gmail.com',
        to: email,
        subject: 'Verify Your Email',
        text: `Please click the following link to verify your email: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}



app.listen(5000, async () => {
    await connect_db()
    console.log("server is up");
})
