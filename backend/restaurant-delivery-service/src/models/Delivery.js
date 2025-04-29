const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    orderId: String,
    customerAddress: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    status: { type: String, default: "Pending"},
    assignedDriver: {
        driverId: String,
        name: String,
        location: {
            lat: {
                type: Number,
                required: false
            },
            lng: {
                type: Number,
                required: false
            }
        }
    },
    createdAt: { type: Date, default: Date.now},
});

module.exports = mongoose.model("Delivery", deliverySchema);