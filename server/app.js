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

// 3.5 Server-Side SEO Pre-rendering for single blog articles
// Guarantees Googlebot and social crawlers get full HTML, Title, Meta, and JSON-LD with ZERO client fetch delay
app.get(['/blog/:slug', '/blogs/:slug'], ensureDbConnected, async (req, res, next) => {
  const acceptHeader = req.headers.accept || '';
  // If the client explicitly requests JSON (e.g. direct API test), pass to next API handler
  if (acceptHeader.includes('application/json') && !acceptHeader.includes('text/html')) {
    return next();
  }

  try {
    const fs = require('fs');
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
    const coverUrl = (typeof blog.coverImage === 'object' ? blog.coverImage?.url : blog.coverImage) || `${siteUrl}/logo-512.png`;
    const title = `${blog.metaTitle || blog.title} | DLEducationConnect`;
    const description = blog.metaDescription || blog.excerpt || 'Verified distance education guides and university updates.';
    const keywords = (blog.tags && blog.tags.length > 0) ? blog.tags.join(', ') : (blog.focusKeyword || 'distance education, university');
    const authorName = blog.authorName || blog.author?.name || 'Aniket Kumar';

    const candidates = [
      path.join(__dirname, '../client/dist/index.html'),
      path.join(__dirname, 'client/dist/index.html'),
      path.join(__dirname, '../client/index.html'),
    ];
    let template = '';
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        template = fs.readFileSync(c, 'utf8');
        break;
      }
    }

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
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
    });

    // Fetch recent published blogs to create a strong internal linking network for Googlebot
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
        <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin-bottom:16px;">Latest Education Guides &amp; University Updates</h2>
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

    const preRenderedBody = `
      <article style="max-width:860px;margin:30px auto;padding:0 20px;">
        <h1 style="font-size:32px;font-weight:800;color:#0f172a;line-height:1.3;margin:0 0 10px 0;text-align:left;">${blog.title}</h1>
        <div style="font-size:14px;color:#64748b;margin-bottom:18px;">By <strong style="color:#0f172a;">${authorName}</strong> / ${new Date(blog.publishDate || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        <img src="${coverUrl}" alt="${blog.imageAlt || blog.title}" style="width:100%;max-height:480px;object-fit:cover;border-radius:8px;margin-bottom:24px;display:block;" />
        <div class="blog-rich-content" style="font-size:16px;color:#334155;">
          ${blog.content || ''}
        </div>
        ${recentLinksHtml}
      </article>
    `;

    if (template) {
      let html = template;
      html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`);
      html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${blogUrl}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`);
      html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${blogUrl}" />`);
      html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${coverUrl}" />`);

      const headInject = `
    <script type="application/ld+json">${jsonLd}</script>
    <script>window.__INITIAL_BLOG__ = ${JSON.stringify(blog)};</script>
`;
      html = html.replace('</head>', `${headInject}</head>`);
      html = html.replace('<div id="root">', `<div id="root">${preRenderedBody}`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}">
  <link rel="canonical" href="${blogUrl}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="${coverUrl}">
  <meta property="og:url" content="${blogUrl}">
  <script type="application/ld+json">${jsonLd}</script>
  <script>window.__INITIAL_BLOG__ = ${JSON.stringify(blog)};</script>
</head>
<body>
  <div id="root">${preRenderedBody}</div>
</body>
</html>`);
  } catch (err) {
    next(err);
  }
});

// 4. Dynamic Sitemap XML — Google uses this to discover all blog pages
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
      { url: siteUrl, priority: '1.0', changefreq: 'daily' },
      { url: `${siteUrl}/blogs`, priority: '0.9', changefreq: 'daily' },
      { url: `${siteUrl}/login`, priority: '0.3', changefreq: 'monthly' },
    ];

    const blogUrls = blogs.map((b) => {
      const cover = typeof b.coverImage === 'object' ? b.coverImage?.url : b.coverImage;
      return {
        url: `${siteUrl}/blog/${b.slug || b._id}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: b.updatedAt
          ? new Date(b.updatedAt).toISOString().split('T')[0]
          : today,
        imageUrl: cover || null,
        title: b.title || '',
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
        ? `\n    <image:image>\n      <image:loc>${u.imageUrl}</image:loc>\n      <image:title>${u.title.replace(/[<>&'"]/g, '')}</image:title>\n    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  }
});

// 4.5 RSS Feed for Instant Google & Search Engine Updates
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

// 5. Robots.txt — tells Google crawlers what to index
app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
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
