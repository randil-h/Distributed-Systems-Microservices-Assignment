const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    operatingHours: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to owner
    registrationStatus: { type: String, default: 'pending' },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;