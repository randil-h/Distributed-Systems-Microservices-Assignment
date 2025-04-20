const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    orderId: String,
    customerAddress: String,
    status: { type: String, default: "Pending"},
    assignedDriver: {
        driverId: String,
        name: String,
        location: String,
    },
    createdAt: { type: Date, default: Date.now},
});

module.exports = mongoose.model("Delivery", deliverySchema);