const express = require('express');
const path = require('path');
const formData = require('form-data');
const Mailgun = require('mailgun.js');


const MAILGUN_API_KEY = '496146b492c806ffdc8a46538c8d1d5f-c02fd0ba-57d0f3ec';
const MAILGUN_DOMAIN = 'sandboxa972d152d9e34307a78960cb20a3a993.mailgun.org';

// Initialize Mailgun
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: '496146b492c806ffdc8a46538c8d1d5f-c02fd0ba-57d0f3ec'
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/subscribe', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const emailData = {
            from: 'DevLink Marketplace <noreply@devlink.deakin.edu.au>',
            to: email,
            subject: 'Welcome to DevLink Marketplace!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1>Welcome to DevLink Marketplace, ${name || 'Developer'}!</h1>
                    <p>Thank you for subscribing to our platform.</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
                        <h3>What You'll Get:</h3>
                        <ul>
                            <li>🌐 Exclusive Developer Resources</li>
                            <li>💼 Career Opportunity Alerts</li>
                            <li>🤝 Community Networking Invites</li>
                        </ul>
                    </div>
                    <p>We're excited to have you join our developer community!</p>
                    <br>
                    <p>Best regards,<br>DevLink Marketplace Team</p>
                </div>
            `
        };

        // Send the email
        await mg.messages.create('sandboxa972d152d9e34307a78960cb20a3a993.mailgun.org', emailData);

        res.status(200).json({ 
            message: 'Subscription successful! Welcome email sent.',
            email: email
        });
    } catch (error) {
        console.error('Email send error:', error);
        res.status(500).json({ 
            error: 'Failed to process subscription',
            details: error.message 
        });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});