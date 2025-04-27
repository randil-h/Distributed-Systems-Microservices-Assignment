const Delivery = require("../models/Delivery");
const sendDriverAssignmentRequest = require("../services/publisher");

const { createDeliveryService } = require("../services/deliveryService");

exports.createDelivery = async (req, res) => {
    const { orderId, customerAddress } = req.body;

    try {
        const delivery = await createDeliveryService(orderId, customerAddress);

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
    try {
        const driverId = req.params.userId;  // Assuming driverId is passed in URL params

        console.log(driverId);

        const delivery = await Delivery.findOne({
            "assignedDriver.driverId": driverId,
            status: 'Assigned'
        });

        if (!delivery) {
            return res.status(404).json({ message: 'No assigned delivery found for this driver.' });
        }

        res.status(200).json(delivery);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};