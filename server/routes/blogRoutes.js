const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
  getBlogCoverImage,
  submitAllToIndexNow,
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getAllBlogs);
router.get('/categories', getCategories);
router.get('/indexnow/submit-all', submitAllToIndexNow);
router.get('/:identifier/cover', getBlogCoverImage);
router.get('/:id', getBlogById);

// Protected admin routes
router.post('/indexnow/submit-all', protect, adminOnly, submitAllToIndexNow);
router.post('/', protect, adminOnly, upload.single('coverImage'), createBlog);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
