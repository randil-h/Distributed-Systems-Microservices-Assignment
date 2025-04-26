const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');

// Protected route to get all users (requires admin role)
router.get('/',
    authenticate,
    authorizeRole(['system-admin']),
    getAllUsers
);

module.exports = router;