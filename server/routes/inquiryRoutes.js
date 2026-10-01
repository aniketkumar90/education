const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryStats,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route: Students / Visitors submitting admission form
router.post('/', createInquiry);

// Protected Admin routes: View, filter, update status, and delete leads
router.get('/', protect, adminOnly, getInquiries);
router.get('/stats', protect, adminOnly, getInquiryStats);
router.post('/admin', protect, adminOnly, createInquiry);
router.put('/:id', protect, adminOnly, updateInquiry);
router.delete('/:id', protect, adminOnly, deleteInquiry);

module.exports = router;
