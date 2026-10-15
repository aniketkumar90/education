const https = require('https');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Blog = require('../models/blogModel');

function decodeEntities(encodedString) {
  if (!encodedString) return '';
  return encodedString
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&hellip;/g, '...')
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

function cleanContentLinks(content) {
  if (!content) return '';
  // Replace links pointing to dl.educationiconnect.com with internal /blog/ links or remove href
  return content.replace(/https?:\/\/dl\.educationiconnect\.com\/([a-zA-Z0-9_-]+)\/?/gi, '/blog/$1');
}

function fetchPost(slug) {
  return new Promise((resolve, reject) => {
    const url = `https://dl.educationiconnect.com/wp-json/wp/v2/posts?slug=${slug}`;
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (Array.isArray(json) && json.length > 0) {
            resolve(json[0]);
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

const TARGET_POSTS = [
  {
    slug: 'one-year-mba-distance-education',
    category: 'Management',
    focusKeyword: 'One Year MBA Distance Education',
    tags: ['One Year MBA', 'MBA Distance Education', 'Distance Education', 'Admission 2026', 'Management Courses'],
  },
  {
    slug: 'bangalore-university-distance-education',
    category: 'University',
    focusKeyword: 'Bangalore University Distance Education',
    tags: ['Bangalore University', 'Distance Education', 'UG Courses', 'PG Courses', 'Admission 2026'],
  },
  {
    slug: 'pune-university-distance-education',
    category: 'University',
    focusKeyword: 'Pune University Distance Education',
    tags: ['Pune University', 'UniPune', 'Distance Education', 'Admission 2026', 'UG PG Admission'],
  },
  {
    slug: 'diploma-in-ntt-distance-education',
    category: 'Diploma',
    focusKeyword: 'Diploma in NTT Distance Education',
    tags: ['NTT Course', 'Diploma in NTT', 'Distance Education', 'Teaching Courses', 'Admission 2026'],
  },
  {
    slug: 'kumaun-university-distance-education',
    category: 'University',
    focusKeyword: 'Kumaun University Distance Education',
    tags: ['Kumaun University', 'Distance Education', 'Admission 2026', 'UG PG Courses'],
  },
];

async function runImport() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully.');

  let insertedCount = 0;

  for (const item of TARGET_POSTS) {
    console.log(`\nFetching post: ${item.slug}...`);
    const wpPost = await fetchPost(item.slug);
    if (!wpPost) {
      console.warn(`Post not found on dl.educationiconnect.com for slug: ${item.slug}`);
      continue;
    }

    const rawTitle = wpPost.title && wpPost.title.rendered ? wpPost.title.rendered : item.slug;
    const cleanTitle = decodeEntities(rawTitle).trim();

    const rawExcerpt = wpPost.excerpt && wpPost.excerpt.rendered ? wpPost.excerpt.rendered : '';
    const cleanExcerptText = decodeEntities(stripHtml(rawExcerpt)).replace(/\[\.\.\.\]/g, '...').trim();
    const finalExcerpt = cleanExcerptText.slice(0, 500) || `${cleanTitle} admission guidelines, eligibility, and fee details.`;

    const rawContent = wpPost.content && wpPost.content.rendered ? wpPost.content.rendered : '';
    const cleanedContent = cleanContentLinks(rawContent);

    // Check if already in DB
    const existing = await Blog.findOne({
      $or: [{ slug: item.slug }, { title: cleanTitle }],
    });

    if (existing) {
      console.log(`Blog already exists in DB: "${existing.title}" (ID: ${existing._id}). Skipping.`);
      continue;
    }

    const newBlog = new Blog({
      title: cleanTitle,
      metaTitle: `${cleanTitle} | DLEducationConnect`,
      metaDescription: finalExcerpt.slice(0, 300),
      focusKeyword: item.focusKeyword,
      slug: item.slug,
      category: item.category,
      tags: item.tags,
      coverImage: {
        url: '',
        publicId: '',
      },
      imageAlt: item.focusKeyword,
      excerpt: finalExcerpt,
      content: cleanedContent,
      authorName: 'Aniket Kumar',
      publishDate: new Date(),
      status: 'Draft',
      published: false,
      views: 0,
    });

    await newBlog.save();
    console.log(`[SAVED AS DRAFT] "${cleanTitle}" (Slug: ${newBlog.slug})`);
    insertedCount++;
  }

  console.log(`\nImport complete! Total new blogs added as Draft: ${insertedCount}`);
  await mongoose.disconnect();
}

runImport().catch((err) => {
  console.error('Import failed with error:', err);
  process.exit(1);
});
