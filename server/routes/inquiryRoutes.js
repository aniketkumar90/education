const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  getInquiryStats,
  exportInquiries,
  updateInquiry,
  deleteInquiry,
  verifyLeadsLockPassword,
} = require('../controllers/inquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { verifyLeadsLock } = require('../middleware/leadsLockMiddleware');

// Public route: Students / Visitors submitting admission form
router.post('/', createInquiry);

// Password verification route to unlock leads in admin panel
router.post('/verify-lock', protect, adminOnly, verifyLeadsLockPassword);

// Protected Admin routes: Gated by admin auth AND leads lock password
router.get('/export', protect, adminOnly, verifyLeadsLock, exportInquiries);
router.get('/', protect, adminOnly, verifyLeadsLock, getInquiries);
router.get('/stats', protect, adminOnly, verifyLeadsLock, getInquiryStats);
router.post('/admin', protect, adminOnly, verifyLeadsLock, createInquiry);
router.put('/:id', protect, adminOnly, verifyLeadsLock, updateInquiry);
router.delete('/:id', protect, adminOnly, verifyLeadsLock, deleteInquiry);

module.exports = router;

