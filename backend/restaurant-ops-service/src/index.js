const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5556;
const MONGOURI = process.env.MONGOURI;

mongoose.connect(MONGOURI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    })

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server for restaurant-ops-service listening on port ${PORT}`);
});
