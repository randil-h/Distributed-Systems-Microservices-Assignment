const twilio = require('twilio');

async function sendSMS(to, body) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromPhone) {
        console.error('Missing Twilio environment variables.');
        throw new Error('Missing Twilio credentials.');
    }

    const client = twilio(accountSid, authToken);

    // 📌 Format the 'to' number properly
    let formattedTo = to;
    if (!to.startsWith('+')) {
        formattedTo = '+94' + to; // Add Sri Lanka country code
    }

    try {
        const message = await client.messages.create({
            body,
            from: fromPhone,
            to: formattedTo,
        });
        console.log('SMS sent:', message.sid);
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

module.exports = sendSMS;
