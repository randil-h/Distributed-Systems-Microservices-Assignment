const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    // Basic Business Information
    name: { type: String, required: true },
    legalBusinessName: { type: String },
    registrationNumber: { type: String },
    description: { type: String },
    cuisineType: { type: String, required: true },
    restaurantCategory: { type: String, required: true },
    // Location and Contact
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    // Operational Details
    operatingHours: { type: String, required: true },
    deliveryOptions: [{ type: String }],
    paymentMethods: [{ type: String }],
    // Owner Information
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    // Image
    logo: { type: String },
    coverImage: { type: String },
    // Reference to owner
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //system admin configurations
    registrationStatus: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
    rejectionReason: { type: String },


});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;