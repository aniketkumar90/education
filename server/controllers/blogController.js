const mongoose = require('mongoose');
const Blog = require('../models/blogModel');
const { uploadToCloudinary, isCloudinaryConfigured } = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');

// @desc    Get all blogs (with pagination, category & search filtering, draft safety)
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const category = req.query.category || '';
    const search = req.query.search || '';
    const statusParam = req.query.status || '';

    const andConditions = [];

    // Status filter: Public only sees Published; admin can pass status=all or status=Draft
    if (statusParam && statusParam !== 'all') {
      andConditions.push({ status: statusParam });
    } else if (!statusParam) {
      andConditions.push({
        $or: [{ status: 'Published' }, { published: true }],
      });
    }

    if (category && category !== 'All') {
      andConditions.push({ category: { $regex: new RegExp(`^${category}$`, 'i') } });
    }

    if (search) {
      andConditions.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { focusKeyword: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ publishDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      blogs,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID or Slug
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res, next) => {
  try {
    const identifier = req.params.id;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findById(identifier);
    }

    if (!blog) {
      const cleanSlug = identifier.replace(/^\/?blog\/?/i, '').toLowerCase();
      blog = await Blog.findOne({ slug: cleanSlug });
    }

    if (!blog) {
      res.status(404);
      return next(new Error('Blog post not found'));
    }

    // Atomically increment views without VersionError concurrency issues
    const updatedBlog = await Blog.findByIdAndUpdate(
      blog._id,
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    ).populate('author', 'name avatar bio');

    res.json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new SEO blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      category,
      tags,
      featuredImageUrl,
      imageAlt,
      excerpt,
      content,
      authorName,
      publishDate,
      status,
    } = req.body;

    if (!title || !excerpt || !content) {
      res.status(400);
      return next(new Error('Title, excerpt, and content are required fields'));
    }

    let coverImage = { url: featuredImageUrl || '', publicId: '' };

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'education-blogs', req.file.originalname);
      coverImage = { url: result.secure_url, publicId: result.public_id };
    }

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string' && tags.trim()
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const isPublished = status !== 'Draft';

    // Generate clean slug cut at 'education' keyword if present
    let rawSlug = (slug && slug.trim()) ? slug : title;
    let cleanSlug = rawSlug
      .replace(/^\/?blog\/?/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const eduMatch = cleanSlug.match(/^(.*?education)/i);
    if (eduMatch && eduMatch[1]) {
      cleanSlug = eduMatch[1];
    }
    cleanSlug = cleanSlug.replace(/^-|-$/g, '');
    if (!cleanSlug) cleanSlug = 'post-' + Date.now();

    // Check if slug already exists to prevent duplicate key error crash
    let finalSlug = cleanSlug;
    let counter = 1;
    while (await Blog.findOne({ slug: finalSlug })) {
      counter++;
      finalSlug = `${cleanSlug}-${counter}`;
    }

    const blog = await Blog.create({
      title,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      focusKeyword: focusKeyword || '',
      slug: finalSlug,
      category: category || 'University',
      tags: parsedTags,
      coverImage,
      imageAlt: imageAlt || focusKeyword || title,
      excerpt,
      content,
      authorName: authorName || (req.user && req.user.name) || 'Aniket Kumar',
      author: req.user?._id || undefined,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      status: isPublished ? 'Published' : 'Draft',
      published: isPublished,
    });

    const populated = await blog.populate('author', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      return next(new Error('Blog not found'));
    }

    const {
      title,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      category,
      tags,
      featuredImageUrl,
      imageAlt,
      excerpt,
      content,
      authorName,
      publishDate,
      status,
      published,
    } = req.body;

    if (req.file) {
      if (blog.coverImage?.publicId && isCloudinaryConfigured()) {
        try {
          await cloudinary.uploader.destroy(blog.coverImage.publicId);
        } catch {}
      }
      const result = await uploadToCloudinary(req.file.buffer, 'education-blogs', req.file.originalname);
      blog.coverImage = { url: result.secure_url, publicId: result.public_id };
    } else if (featuredImageUrl) {
      blog.coverImage = { url: featuredImageUrl, publicId: blog.coverImage?.publicId || '' };
    }

    if (title !== undefined) blog.title = title;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) blog.metaDescription = metaDescription;
    if (focusKeyword !== undefined) blog.focusKeyword = focusKeyword;
    if (slug !== undefined) {
      let rawSlug = slug.trim() || blog.title;
      let cleanSlug = rawSlug
        .replace(/^\/?blog\/?/i, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      const eduMatch = cleanSlug.match(/^(.*?education)/i);
      if (eduMatch && eduMatch[1]) {
        cleanSlug = eduMatch[1];
      }
      cleanSlug = cleanSlug.replace(/^-|-$/g, '');

      if (cleanSlug && cleanSlug !== blog.slug) {
        let candidateSlug = cleanSlug;
        let counter = 1;
        while (await Blog.findOne({ slug: candidateSlug, _id: { $ne: blog._id } })) {
          counter++;
          candidateSlug = `${cleanSlug}-${counter}`;
        }
        blog.slug = candidateSlug;
      }
    }
    if (category !== undefined) blog.category = category;
    if (imageAlt !== undefined) blog.imageAlt = imageAlt;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (authorName !== undefined) blog.authorName = authorName;
    if (publishDate !== undefined) blog.publishDate = new Date(publishDate);

    if (tags !== undefined) {
      blog.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : blog.tags;
    }

    if (status !== undefined) {
      blog.status = status;
      blog.published = status === 'Published';
    } else if (published !== undefined) {
      blog.published = published === 'true' || published === true;
      blog.status = blog.published ? 'Published' : 'Draft';
    }

    const updated = await blog.save();
    const populated = await updated.populate('author', 'name avatar');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404);
      return next(new Error('Blog not found'));
    }

    // Remove cover image from Cloudinary if configured
    if (blog.coverImage?.publicId && isCloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(blog.coverImage.publicId);
      } catch {}
    }

    await blog.deleteOne();
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending categories with counts
// @route   GET /api/blogs/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { $or: [{ status: 'Published' }, { published: true }] } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getCategories };
