const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 9999
const MONGOURI = process.env.MONGOURI;

const stripeRoutes = require('./routes/StripeRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');

app.use(cors());

mongoose.connect(MONGOURI)
    .then(() => {console.log('Connected to MongoDB...')})
    .catch((err) => {console.error('Error connecting to MongoDB...', err)})

app.use(express.json());
app.use('/stripe', stripeRoutes);
app.use('/payments', paymentRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'system-admin-service' });
});

module.exports = { app };

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});