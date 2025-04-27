const express = require('express');
const router = express.Router();
const { getAllUsers, updateBlockStatus, updateDriverLocation} = require('../controllers/userController');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');

// Protected route to get all users (requires admin role)
router.get('/',
    authenticate,
    authorizeRole(['system-admin']),
    getAllUsers
);

router.put('/suspend/:id',
    authenticate,
    authorizeRole(['system-admin']),
    updateBlockStatus
);

router.put('/update-location/:id', updateDriverLocation);

module.exports = router;