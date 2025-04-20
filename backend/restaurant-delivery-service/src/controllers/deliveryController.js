const Delivery = require("../models/Delivery");
const sendDriverAssignmentRequest = require("../services/publisher");

exports.createDelivery = async (req, res) => {
    const { orderId, customerAddress } = req.body;

    try {
        const delivery = new Delivery({ orderId, customerAddress });
        await delivery.save();

        // Publish driver assignment request
        await sendDriverAssignmentRequest(orderId, customerAddress);

        res.status(201).json({
            message: "Delivery created. Driver assignment in progress.",
            delivery,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    try {
        const delivery = await Delivery.findByIdAndUpdate(id, { status}, { new: true});
        res.json(delivery);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
};

exports.getAssignedDeliveries = async (req, res) => {
    const { driverId } = req.params;
    try {
        const deliveries = await Delivery.find({ "assignedDriver.driverId": driverId });
        res.json(deliveries);
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
};