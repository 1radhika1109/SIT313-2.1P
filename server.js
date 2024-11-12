const express = require('express');
const bodyParser = require('body-parser');
const mailgun = require('mailgun-js');
const path = require('path');

// Mailgun configuration
const DOMAIN = 'sandboxcd7ac281349c4ce3bef27704c2b89750.mailgun.org'; // Replace with your Mailgun domain
const mg = mailgun({ apiKey: '6d31f83ac26b610f752898fe0e80211f-f6fe91d3-62cc1df5', domain: DOMAIN });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/signup', (req, res) => {
    const { firstName, lastName, email } = req.body; // Use 'email' instead of 'Email'

    const data = {
        from: 'Deakin Newsletter <newsletter@sandboxcd7ac281349c4ce3bef27704c2b89750.mailgun.org>',
        to: email,  // Use email here
        subject: 'Newsletter Subscription',
        text: `Hello ${firstName} ${lastName},\n\nThank you for subscribing to our newsletter!
        We'll keep you updated with the latest news and events from Deakin University.
    
        If you have any questions, feel free to contact us at newsletter@deakin.edu.au
        Follow us on Facebook and Twitter
        Cheers,
        The Deakin Newsletter Team`
    };

    mg.messages().send(data, (error, body) => {
        if (error) {
            return res.status(500).send('Error sending email: ' + error.message);
        }
        res.send('Subscription successful! Check your email.');
    });
});

// Start the server
const PORT = process.env.PORT || 3050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
