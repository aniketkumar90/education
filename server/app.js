const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const validateEnv = require('./config/validateEnv');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Validate environment variables safely without printing secret values
validateEnv();

const app = express();

// Standard parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration supporting local development, Vercel production domains, and custom domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'https://dleducationconnect.in',
  'https://www.dleducationconnect.in',
  'http://dleducationconnect.in',
  'http://www.dleducationconnect.in',
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, '');
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/+$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('dleducationconnect.in') ||
        (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
      ) {
        return callback(null, true);
      }

      callback(new Error(`CORS error: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Serve local uploads folder if available
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. Health check endpoint (always accessible, handles both /api/health and /health)
app.get(['/api/health', '/health'], async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;
  let host = null;
  const hasMongoUri = Boolean(process.env.MONGO_URI);

  try {
    if (hasMongoUri) {
      const conn = await connectDB();
      dbStatus = 'connected';
      host = conn.host;
    } else {
      dbStatus = 'missing_env';
      dbError = 'MONGO_URI is not set in environment variables.';
    }
  } catch (err) {
    dbStatus = 'error';
    const serverErrors = [];
    if (err.reason && err.reason.servers) {
      try {
        for (const [address, serverDesc] of err.reason.servers.entries()) {
          serverErrors.push({
            address,
            type: serverDesc.type,
            error: serverDesc.error ? serverDesc.error.message : (serverDesc.reason || null),
          });
        }
      } catch {}
    }
    dbError = {
      message: err.message ? err.message.replace(/:([^:@]+)@/, ':****@') : 'Connection failed',
      servers: serverErrors,
    };
  }

  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    message: isHealthy ? 'DLEducationConnect API is running 🚀' : 'API is running but database is not connected',
    database: {
      status: dbStatus,
      hasMongoUri,
      host,
      error: dbError,
    },
    config: {
      mongoUriConfigured: hasMongoUri,
      jwtSecretConfigured: Boolean(process.env.JWT_SECRET),
      clientUrlConfigured: Boolean(process.env.CLIENT_URL),
      cloudinaryConfigured: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
      ),
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 2. Database connection assurance middleware for data routes
const ensureDbConnected = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    const safeError = err.message ? err.message.replace(/:([^:@]+)@/, ':****@') : 'Unknown DB error';
    console.error('Database connection failed on request:', safeError);
    res.status(500).json({
      message: 'Database connection failed. Please ensure MongoDB Atlas is connected and IP is whitelisted.',
      details: safeError,
    });
  }
};

// 3. Mount routes (supporting both with and without /api prefix for Vercel routing flexibility)
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

app.use('/api/auth', ensureDbConnected, userRoutes);
app.use('/auth', ensureDbConnected, userRoutes);

app.use('/api/blogs', ensureDbConnected, blogRoutes);
app.use('/blogs', ensureDbConnected, blogRoutes);

app.use('/api/inquiries', ensureDbConnected, inquiryRoutes);
app.use('/inquiries', ensureDbConnected, inquiryRoutes);

// 3.4 301 Permanent Redirects for legacy/changed URLs
app.get([
  '/blog/kashmir-university-distance-education-2',
  '/blogs/kashmir-university-distance-education-2'
], (req, res) => {
  return res.redirect(301, '/blog/kashmir-university-distance-education');
});

// Helper: load client index.html template from dist or source
const getHtmlTemplate = () => {
  const fs = require('fs');
  const candidates = [
    path.join(__dirname, '../client/dist/index.html'),
    path.join(__dirname, 'client/dist/index.html'),
    path.join(__dirname, '../client/index.html'),
    path.join(__dirname, 'client/index.html'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return fs.readFileSync(c, 'utf8');
    }
  }
  return '';
};

// Helper: assemble complete HTML page replacing <div id="root"> and head metadata cleanly
const buildHtmlPage = ({ template, title, description, canonicalUrl, ogType = 'website', ogImage, jsonLd, bodyContent }) => {
  let html = template;
  if (!html) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-RHXY1C7TF8"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-RHXY1C7TF8');
  </script>
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}">
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${ogImage}">
  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
</head>
<body>
  <div id="root">${bodyContent}</div>
</body>
</html>`;
  }

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  // Replace Description
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);
  // Replace Canonical
  html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*?["']\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  // Replace OG tags
  html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta property="og:image" content="${ogImage}" />`);
  if (ogType !== 'website') {
    html = html.replace(/<meta\s+property=["']og:type["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta property="og:type" content="${ogType}" />`);
  }
  // Replace Twitter tags
  html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][^"']*?["']\s*\/?>/i, `<meta name="twitter:image" content="${ogImage}" />`);

  // Inject JSON-LD Schema
  if (jsonLd) {
    html = html.replace('</head>', `  <script type="application/ld+json">${jsonLd}</script>\n</head>`);
  }

  // Replace existing <div id="root">...</div> completely (removes duplicate H1 and static placeholders)
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${bodyContent}</div>`);

  return html;
};

// 3.5 Blog Cover Image Binary Asset Endpoint
// Converts base64 stored in DB into lightweight, fast, CDN-cacheable binary HTTP image
const { getBlogCoverImage } = require('./controllers/blogController');
app.get([
  '/blog-cover/:identifier',
  '/blogs/:identifier/cover',
  '/api/blogs/:identifier/cover'
], ensureDbConnected, getBlogCoverImage);

// 3.6 Server-Side SEO Pre-rendering for single blog articles
app.get(['/blog/:slug', '/blogs/:slug'], ensureDbConnected, async (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return next();
  }

  try {
    const Blog = require('./models/blogModel');
    const mongoose = require('mongoose');
    const identifier = req.params.slug;
    let blog = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findById(identifier).populate('author', 'name avatar bio');
    }
    if (!blog) {
      const cleanSlug = identifier.replace(/^\/?blog\/?/i, '').toLowerCase();
      blog = await Blog.findOne({ slug: cleanSlug }).populate('author', 'name avatar bio');
    }

    if (!blog) {
      return res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Article Not Found | DLEducationConnect</title>
</head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;">
  <h1>Article Not Found</h1>
  <p>The requested education article was not found or is no longer published.</p>
  <a href="/blogs" style="color:#2563eb;font-weight:600;">← Browse All Articles</a>
</body>
</html>`);
    }

    const siteUrl = 'https://dleducationconnect.in';
    const blogUrl = `${siteUrl}/blog/${blog.slug || blog._id}`;
    const rawCover = (typeof blog.coverImage === 'object' ? blog.coverImage?.url : blog.coverImage) || '';
    const isExternalCover = rawCover.startsWith('http://') || rawCover.startsWith('https://');
    const coverUrl = isExternalCover ? rawCover : `${siteUrl}/blog-cover/${blog.slug || blog._id}`;
    const title = `${blog.metaTitle || blog.title} | DLEducationConnect`;
    const description = blog.metaDescription || blog.excerpt || 'Verified distance education guides and university updates.';
    const keywords = (blog.tags && blog.tags.length > 0) ? blog.tags.join(', ') : (blog.focusKeyword || 'distance education, university');
    const authorName = blog.authorName || blog.author?.name || 'Aniket Kumar';

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: blog.title,
          description: description,
          image: coverUrl,
          author: { '@type': 'Person', name: authorName },
          publisher: {
            '@type': 'Organization',
            name: 'DLEducationConnect',
            logo: { '@type': 'ImageObject', url: `${siteUrl}/logo-512.png` },
          },
          datePublished: new Date(blog.publishDate || blog.createdAt).toISOString(),
          dateModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
          mainEntityOfPage: { '@type': 'WebPage', '@id': blogUrl },
          url: blogUrl,
          keywords: keywords,
          articleSection: blog.category || 'Education',
          inLanguage: 'en-IN',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'All Articles',
              item: `${siteUrl}/blogs`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: blog.title,
              item: blogUrl,
            },
          ],
        },
      ],
    });

    // Fetch related/recent published blogs for internal link equity
    const recentBlogs = await Blog.find(
      {
        _id: { $ne: blog._id },
        $or: [{ status: 'Published' }, { published: true }],
      },
      'title slug _id excerpt publishDate createdAt'
    )
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(6)
      .lean();

    const recentLinksHtml =
      recentBlogs && recentBlogs.length > 0
        ? `
      <section style="margin-top:40px;padding-top:24px;border-top:2px solid #e2e8f0;">
        <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin-bottom:16px;">Latest Distance Education Guides &amp; University Notifications</h2>
        <ul style="list-style:disc;padding-left:22px;line-height:2.2;font-size:16px;">
          ${recentBlogs
            .map(
              (rb) => `
            <li>
              <a href="/blog/${rb.slug || rb._id}" style="color:#2563eb;text-decoration:underline;font-weight:600;">
                ${rb.title}
              </a>
            </li>`
            )
            .join('')}
        </ul>
      </section>`
        : '';

    const cleanContent = (blog.content || '')
      .replace(/text-align:\s*justify;?/gi, 'text-align: left;')
      .replace(/width:\s*([4-9]\d{2,}|[1-9]\d{3,})px;?/gi, 'max-width: 100%;');

    const preRenderedBody = `
      <article style="max-width:860px;margin:30px auto;padding:0 20px;">
        <nav style="font-size:14px;color:#64748b;margin-bottom:14px;">
          <a href="/" style="color:#2563eb;text-decoration:none;">Home</a> &rsaquo;
          <a href="/blogs" style="color:#2563eb;text-decoration:none;">Articles</a> &rsaquo;
          <span>${blog.title}</span>
        </nav>
        <h1 style="font-size:32px;font-weight:800;color:#0f172a;line-height:1.3;margin:0 0 10px 0;text-align:left;">${blog.title}</h1>
        <div style="font-size:14px;color:#64748b;margin-bottom:18px;">By <strong style="color:#0f172a;">${authorName}</strong> / ${new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <img src="${coverUrl}" alt="${blog.imageAlt || blog.title}" style="width:100%;max-height:480px;object-fit:cover;border-radius:8px;margin-bottom:24px;display:block;" />
        <div class="blog-rich-content rich-blog-body" style="font-size:16px;color:#334155;line-height:1.8;text-align:left;">
          ${cleanContent}
        </div>
        ${recentLinksHtml}
      </article>
    `;

    // Build sanitized initial blog payload without massive base64 image strings
    const sanitizedBlog = {
      _id: blog._id,
      title: blog.title,
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
      focusKeyword: blog.focusKeyword,
      slug: blog.slug,
      category: blog.category,
      tags: blog.tags,
      coverImage: { url: coverUrl, publicId: blog.coverImage?.publicId || '' },
      imageAlt: blog.imageAlt,
      excerpt: blog.excerpt,
      content: blog.content,
      authorName: authorName,
      publishDate: blog.publishDate,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      status: blog.status,
      published: blog.published,
    };

    const template = getHtmlTemplate();
    let finalHtml = buildHtmlPage({
      template,
      title,
      description,
      canonicalUrl: blogUrl,
      ogType: 'article',
      ogImage: coverUrl,
      jsonLd,
      bodyContent: preRenderedBody,
    });

    // Inject sanitized window.__INITIAL_BLOG__ so client hydrates instantaneously without refetching
    finalHtml = finalHtml.replace(
      '</head>',
      `  <script>window.__INITIAL_BLOG__ = ${JSON.stringify(sanitizedBlog)};</script>\n</head>`
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(finalHtml);
  } catch (err) {
    next(err);
  }
});

// 3.7 Server-Side SEO Pre-rendering for Homepage (/)
app.get('/', ensureDbConnected, async (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return next();
  }

  try {
    const Blog = require('./models/blogModel');
    const blogs = await Blog.find(
      { $or: [{ status: 'Published' }, { published: true }] },
      'title slug _id excerpt coverImage publishDate createdAt category'
    )
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(12)
      .lean();

    const siteUrl = 'https://dleducationconnect.in';
    const title = 'DLEducationConnect - Distance Education & University Admissions Guide 2026';
    const description = 'Verified distance education admission guides, university notifications, fee structures, syllabus, eligibility, and course updates for top Indian universities.';

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'DLEducationConnect',
          url: siteUrl,
          logo: `${siteUrl}/logo-512.png`,
          description: description,
          sameAs: [siteUrl],
        },
        {
          '@type': 'WebSite',
          name: 'DLEducationConnect',
          url: siteUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/blogs?search={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    });

    const bodyContent = `
      <header style="padding: 30px 20px; font-family: sans-serif; max-width: 1200px; margin: 0 auto; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.3;">
          DLEducationConnect - Distance Education &amp; University Admissions Guide
        </h1>
        <p style="font-size: 17px; color: #475569; line-height: 1.6; max-width: 820px; margin: 0 auto;">
          Your trusted national education portal for verified distance learning degree admissions, UGC-DEB notifications, course eligibility, fees, last dates, and verified university updates.
        </p>
      </header>
      <main style="padding: 20px; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
        <h2 style="font-size: 24px; color: #1e293b; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
          Latest Distance Education Articles &amp; University Updates
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          ${blogs
            .map((b) => {
              const rawCover = typeof b.coverImage === 'object' ? b.coverImage?.url : b.coverImage;
              const isExt = rawCover && (rawCover.startsWith('http://') || rawCover.startsWith('https://'));
              const cUrl = isExt ? rawCover : `${siteUrl}/blog-cover/${b.slug || b._id}`;
              return `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <a href="/blog/${b.slug || b._id}" style="text-decoration:none; color:inherit;">
                <img src="${cUrl}" alt="${b.title}" style="width: 100%; height: 180px; object-fit: cover; display: block;" loading="lazy" />
                <div style="padding: 18px;">
                  <span style="display: inline-block; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px;">
                    ${b.category || 'Education'}
                  </span>
                  <h3 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; line-height: 1.4;">
                    ${b.title}
                  </h3>
                  <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 12px 0;">
                    ${b.excerpt ? b.excerpt.substring(0, 130) + '...' : ''}
                  </p>
                  <span style="color: #2563eb; font-weight: 600; font-size: 14px; text-decoration: underline;">Read Full Guide &rarr;</span>
                </div>
              </a>
            </article>`;
            })
            .join('')}
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <a href="/blogs" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
            Browse All Education Articles &rarr;
          </a>
        </div>
      </main>
    `;

    const template = getHtmlTemplate();
    const finalHtml = buildHtmlPage({
      template,
      title,
      description,
      canonicalUrl: `${siteUrl}/`,
      ogType: 'website',
      ogImage: `${siteUrl}/logo-512.png`,
      jsonLd,
      bodyContent,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(finalHtml);
  } catch (err) {
    next(err);
  }
});

// 3.8 Server-Side SEO Pre-rendering for /blogs (Articles Directory)
app.get('/blogs', ensureDbConnected, async (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return next();
  }

  try {
    const Blog = require('./models/blogModel');
    const blogs = await Blog.find(
      { $or: [{ status: 'Published' }, { published: true }] },
      'title slug _id excerpt coverImage publishDate createdAt category'
    )
      .sort({ publishDate: -1, createdAt: -1 })
      .lean();

    const siteUrl = 'https://dleducationconnect.in';
    const title = 'All Distance Education Blogs & University Admission Guides | DLEducationConnect';
    const description = 'Browse all verified distance education guides, admission notifications, university courses, fees, syllabus, eligibility, and last dates.';

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: title,
          description: description,
          url: `${siteUrl}/blogs`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${siteUrl}/`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'All Articles',
              item: `${siteUrl}/blogs`,
            },
          ],
        },
      ],
    });

    const bodyContent = `
      <header style="padding: 30px 20px; font-family: sans-serif; max-width: 1200px; margin: 0 auto; text-align: center;">
        <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px;">All Education Articles &amp; University Guides</h1>
        <p style="font-size: 16px; color: #475569; max-width: 800px; margin: 0 auto;">
          Comprehensive repository of verified admission updates, distance learning degree comparisons, syllabus outlines, and application guides.
        </p>
      </header>
      <main style="padding: 20px; font-family: sans-serif; max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px;">
          ${blogs
            .map((b) => {
              const rawCover = typeof b.coverImage === 'object' ? b.coverImage?.url : b.coverImage;
              const isExt = rawCover && (rawCover.startsWith('http://') || rawCover.startsWith('https://'));
              const cUrl = isExt ? rawCover : `${siteUrl}/blog-cover/${b.slug || b._id}`;
              return `
            <article style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
              <a href="/blog/${b.slug || b._id}" style="text-decoration:none; color:inherit;">
                <img src="${cUrl}" alt="${b.title}" style="width: 100%; height: 180px; object-fit: cover; display: block;" loading="lazy" />
                <div style="padding: 18px;">
                  <span style="display: inline-block; background: #eff6ff; color: #2563eb; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-bottom: 8px;">
                    ${b.category || 'Education'}
                  </span>
                  <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; line-height: 1.4;">
                    ${b.title}
                  </h2>
                  <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 12px 0;">
                    ${b.excerpt ? b.excerpt.substring(0, 130) + '...' : ''}
                  </p>
                  <span style="color: #2563eb; font-weight: 600; font-size: 14px; text-decoration: underline;">Read Full Article &rarr;</span>
                </div>
              </a>
            </article>`;
            })
            .join('')}
        </div>
      </main>
    `;

    const template = getHtmlTemplate();
    const finalHtml = buildHtmlPage({
      template,
      title,
      description,
      canonicalUrl: `${siteUrl}/blogs`,
      ogType: 'website',
      ogImage: `${siteUrl}/logo-512.png`,
      jsonLd,
      bodyContent,
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(finalHtml);
  } catch (err) {
    next(err);
  }
});

// 4. Dynamic Sitemap XML — 100% compliant with Google Search Engine & Image Sitemap specs
app.get(['/sitemap.xml', '/api/sitemap.xml'], async (req, res) => {
  try {
    await connectDB();
    const Blog = require('./models/blogModel');
    const blogs = await Blog.find(
      { $or: [{ status: 'Published' }, { published: true }] },
      'slug _id updatedAt createdAt title coverImage'
    )
      .sort({ createdAt: -1, updatedAt: -1 })
      .lean();

    const siteUrl = 'https://dleducationconnect.in';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { url: `${siteUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
      { url: `${siteUrl}/blogs`, priority: '0.9', changefreq: 'daily', lastmod: today },
    ];

    const blogUrls = blogs.map((b) => {
      const rawCover = typeof b.coverImage === 'object' ? b.coverImage?.url : b.coverImage;
      const isExternalUrl = rawCover && (rawCover.startsWith('http://') || rawCover.startsWith('https://'));
      const coverUrl = isExternalUrl ? rawCover : `${siteUrl}/blog-cover/${b.slug || b._id}`;
      return {
        url: `${siteUrl}/blog/${b.slug || b._id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: b.updatedAt
          ? new Date(b.updatedAt).toISOString().split('T')[0]
          : today,
        imageUrl: coverUrl,
        title: (b.title || '').replace(/[<>&'"]/g, ''),
      };
    });

    const allUrls = [...staticPages, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.imageUrl
        ? `\n    <image:image>\n      <image:loc>${u.imageUrl}</image:loc>\n      <image:title>${u.title}</image:title>\n    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

// 4.5 RSS Feed for Instant Search Engine Discovery
app.get(['/rss.xml', '/feed.xml', '/api/rss.xml'], async (req, res) => {
  try {
    await connectDB();
    const Blog = require('./models/blogModel');
    const blogs = await Blog.find(
      { $or: [{ status: 'Published' }, { published: true }] }
    )
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(50)
      .lean();

    const siteUrl = 'https://dleducationconnect.in';
    const rssItems = blogs
      .map((b) => {
        const bUrl = `${siteUrl}/blog/${b.slug || b._id}`;
        const pubDate = new Date(b.publishDate || b.createdAt).toUTCString();
        const safeTitle = (b.title || '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
        const safeDesc = (b.excerpt || b.metaDescription || '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
        const category = (b.category || 'Education').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
        return `    <item>
      <title>${safeTitle}</title>
      <link>${bUrl}</link>
      <guid isPermaLink="true">${bUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${safeDesc}</description>
      <category>${category}</category>
    </item>`;
      })
      .join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DLEducationConnect - Education Blogs &amp; University Admissions</title>
    <link>${siteUrl}</link>
    <description>Verified distance education blogs, university admission guides, and course updates.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/xml; charset=utf-8');
    res.set('Cache-Control', 'public, max-age=1800');
    res.send(rssXml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><rss version="2.0"><channel><title>DLEducationConnect</title></channel></rss>');
  }
});

// 5. Robots.txt — tells Google crawlers what to index and explicitly allows blog images
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Allow: /blog-cover/
Allow: /blogs/*/cover
Allow: /api/blogs/*/cover
Allow: /sitemap.xml
Allow: /rss.xml
Disallow: /admin
Disallow: /login
Disallow: /api/

Sitemap: https://dleducationconnect.in/sitemap.xml
Sitemap: https://dleducationconnect.in/rss.xml
`);
});

// 6. 404 & Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
