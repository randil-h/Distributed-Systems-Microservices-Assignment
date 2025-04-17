const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config();

const PORT = process.env.PORT || 3270
const MONGOURI = process.env.MONGOURI;

const stripeRoutes = require('./routes/StripeRoutes');

app.use(cors());

mongoose.connect(MONGOURI)
    .then(() => {console.log('Connected to MongoDB...')})
    .catch((err) => {console.error('Error connecting to MongoDB...', err)})

app.use(express.json());
app.use('/stripe', stripeRoutes );

module.exports = { app};

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});