const express = require("express");
const router = express.Router();
const { authenticate, authorizeRole } = require("../middleware/authMiddleware");
const menuController = require("../controllers/menuController");

router.post("/menu", authenticate, authorizeRole(["restaurant-admin"]), menuController.createMenuItem);
router.get("/menu/:restaurantId", authenticate, menuController.getMenu);
router.put("/menu/:id", authenticate, authorizeRole(["restaurant-admin"]), menuController.updateMenuItem);
router.delete("/menu/:id", authenticate, authorizeRole(["restaurant-admin"]), menuController.deleteMenuItem);

module.exports = router;
