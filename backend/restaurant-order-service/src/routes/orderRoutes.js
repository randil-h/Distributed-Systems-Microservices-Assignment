const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, orderController.createOrder); // now needs token
router.get("/:restaurantId", authenticate, orderController.getOrders);
router.patch("/:orderId", authenticate, orderController.updateOrder);

module.exports = router;
