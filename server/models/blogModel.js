const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    // 1. Blog Title
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    // 2. Meta Title (SERP Title)
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [250, 'Meta title should be under 250 characters'],
      default: '',
    },
    // 3. Meta Description (SERP Description)
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [500, 'Meta description should be under 500 characters'],
      default: '',
    },
    // 4. Focus Keyword
    focusKeyword: {
      type: String,
      trim: true,
      default: '',
    },
    // 5. Slug / URL
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // 6. Category (e.g., SEO Basics, University, Courses)
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      default: 'University',
    },
    // 7. Tags
    tags: [{ type: String, trim: true }],
    // 8. Featured Image
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    // 9. Image Alt Text (SEO Alt attribute)
    imageAlt: {
      type: String,
      trim: true,
      default: '',
    },
    // 10. Short Description / Excerpt
    excerpt: {
      type: String,
      required: [true, 'Short description / excerpt is required'],
      maxlength: [1000, 'Excerpt must be under 1000 characters'],
    },
    // 11. Blog Content
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    // 12. Author (Display Name & User Reference)
    authorName: {
      type: String,
      trim: true,
      default: 'Aniket Kumar',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // 13. Publish Date
    publishDate: {
      type: Date,
      default: Date.now,
    },
    // 14. Status (Draft / Published)
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Published',
    },
    published: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Slug sanitizer & auto-generator hook
blogSchema.pre('save', function () {
  // Sync published boolean with status
  this.published = this.status === 'Published';

  // Fallback defaults for meta if not explicitly provided
  if (!this.metaTitle) {
    this.metaTitle = this.title;
  }
  if (!this.metaDescription) {
    this.metaDescription = this.excerpt;
  }
  if (!this.imageAlt) {
    this.imageAlt = this.focusKeyword ? `${this.focusKeyword} - ${this.title}` : this.title;
  }

  // Handle slug
  if (this.slug) {
    // Sanitize user-provided slug (strip /blog/ prefix if present)
    let cleanSlug = this.slug
      .replace(/^\/?blog\/?/i, '')
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    this.slug = cleanSlug || 'post-' + Date.now();
  } else if (this.isModified('title') || this.isNew) {
    let clean = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
    this.slug = clean || 'post-' + Date.now();
  }
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
