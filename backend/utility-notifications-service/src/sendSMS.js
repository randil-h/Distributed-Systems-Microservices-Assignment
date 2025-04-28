const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, body) {
    try {
        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER, // Twilio verified phone number
            to, // Driver's phone number
        });
        console.log('SMS sent:', message.sid);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
}

module.exports = sendSMS;
