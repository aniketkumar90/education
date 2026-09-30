const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
// Logout should not be blocked if token has expired or is invalid
router.post('/logout', logout);
// Support both /profile and /me routes for full frontend compatibility
router.get('/profile', protect, getProfile);
router.get('/me', protect, getProfile);

module.exports = router;
