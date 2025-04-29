const express = require("express");
const router = express.Router();
const {
    createDelivery,
    updateStatus,
    getAssignedDeliveries, updateDriverLocation,
} = require("../controllers/deliveryController");

router.post("/assign", createDelivery);
router.put("/status/:id", updateStatus);
router.get("/driver/:userId", getAssignedDeliveries);


module.exports = router;
