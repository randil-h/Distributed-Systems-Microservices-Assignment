// models/menuItemModel.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    // ingredients: [{ type: String }],
    dietaryRestrictions: [{ type: String }],
    preparationTime: { type: Number }, // in minutes
    image: { type: String }, // Base64 string or URL
    isAvailable: { type: Boolean, default: true },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;