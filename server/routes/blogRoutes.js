const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getCategories,
} = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getAllBlogs);
router.get('/categories', getCategories);
router.get('/:id', getBlogById);

// Protected admin routes
router.post('/', protect, adminOnly, upload.single('coverImage'), createBlog);
router.put('/:id', protect, adminOnly, upload.single('coverImage'), updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
