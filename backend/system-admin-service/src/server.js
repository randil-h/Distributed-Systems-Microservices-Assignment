const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const PORT = process.env.PORT || 5555
// const MONGOURI = process.env.MONGOURI;

const stripeRoutes = require('./routes/StripeRoutes');

dotenv.config();

app.use(cors());

// mongoose.connect(MONGOURI)
//     .then(() => {console.log('Connected to MongoDB...')})
//     .catch((err) => {console.error('Error connecting to MongoDB...', err)})

app.use(express.json());
app.use('/stripe', stripeRoutes );

module.exports = { app};

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});