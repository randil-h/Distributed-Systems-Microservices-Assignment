// services/deliveryService.js
const Delivery = require("../models/Delivery");
const sendDriverAssignmentRequest = require("../services/publisher");

const createDeliveryService = async (orderId, customerAddress) => {
    const delivery = new Delivery({ orderId, customerAddress });
    await delivery.save();

    // Publish driver assignment request
    await sendDriverAssignmentRequest(orderId, customerAddress);

    return delivery;
};

module.exports = { createDeliveryService };
