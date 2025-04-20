const express = require("express");
const router = express.Router();
const {
    createDelivery,
    updateStatus,
    getAssignedDeliveries,
} = require("../controllers/deliveryController");

router.post("/assign", createDelivery);
router.put("/status/:id", updateStatus);
router.get("/driver/:driverId", getAssignedDeliveries);

module.exports = router;
