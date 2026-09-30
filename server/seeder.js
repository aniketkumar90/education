const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Blog = require('./models/blogModel');

dotenv.config();

const sampleBlogs = [
  {
    title: 'Dibrugarh University Distance Education Admission 2026 | UG/PG Courses, Fee & Eligibility',
    excerpt: 'Dibrugarh University Directorate of Open and Distance Learning (DODL) invites applications for various UG and PG distance education programs for the academic session 2026.',
    category: 'IT',
    tags: ['IT', 'Education', 'Distance Education', 'Admission 2026', 'UG/PG'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>Dibrugarh University Distance Education Admission 2026</h2>
      <p>Dibrugarh University Directorate of Open and Distance Learning (DODL) has announced the admission process for its undergraduate and postgraduate distance education courses for the academic year 2026.</p>
      <h3>Key Highlights & Eligibility</h3>
      <ul>
        <li><strong>UG Programs:</strong> BA, B.Com, BCA — Minimum 50% in 10+2 from a recognized board.</li>
        <li><strong>PG Programs:</strong> MA, M.Com, MSc IT — Bachelor's degree in relevant discipline.</li>
        <li><strong>Mode of Study:</strong> Hybrid open and distance learning with study centers across the region.</li>
        <li><strong>Fee Structure:</strong> Affordable semester-wise fees ranging from ₹8,000 to ₹18,000.</li>
      </ul>
    `,
  },
  {
    title: 'MSc Valuation Real Estate Distance Education Admission 2026 | Eligibility, Fee Structure & Last date',
    excerpt: 'Complete guide for MSc in Real Estate Valuation distance learning program 2026: eligibility criteria, curriculum, career prospects, and last registration dates.',
    category: 'IT',
    tags: ['IT', 'Real Estate', 'Valuation', 'MSc', 'Distance Education'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>MSc Valuation Real Estate Distance Education Admission 2026</h2>
      <p>The Master of Science in Real Estate Valuation through distance education is designed to empower professionals with valuation techniques, property laws, and economic analysis for property markets.</p>
      <h3>Eligibility Criteria</h3>
      <p>Applicants must possess a Bachelor's degree in Engineering, Architecture, Commerce, Economics, or related fields with at least 50% aggregate marks.</p>
    `,
  },
  {
    title: 'Shivaji University Distance Education Admission 2026 | UG & PG Courses, Fee',
    excerpt: 'Shivaji University Centre for Distance and Online Education (CDOE) announces registration open for 2026. Explore courses, syllabus, and examination schedules.',
    category: 'IT',
    tags: ['IT', 'Shivaji University', 'UG Courses', 'PG Courses', 'Distance Learning'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>Shivaji University Distance Education 2026</h2>
      <p>Shivaji University, Kolhapur invites applications for admissions to various degree and diploma courses through distance mode for the upcoming academic session.</p>
    `,
  },
  {
    title: 'MSc Agriculture Distance Education Admission 2026 | Eligibility, Fees & Duration',
    excerpt: 'Explore accredited distance education MSc Agriculture courses in 2026. Check top universities, specialization options, and online application process.',
    category: 'IT',
    tags: ['IT', 'Agriculture', 'MSc Agriculture', 'Distance Education', 'Career'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>MSc Agriculture Distance Education Admission 2026</h2>
      <p>Distance MSc in Agriculture provides specialized knowledge in agronomy, horticulture, soil sciences, and agribusiness management for working professionals and researchers.</p>
    `,
  },
  {
    title: "SNDT Women's University Distance Education Admission 2026 | Fees, Last Date",
    excerpt: "SNDT Women's University opens distance education admission 2026 for female students across India. Check courses, eligibility, scholarship schemes, and last dates.",
    category: 'IT',
    tags: ['IT', 'Women Education', 'SNDT', 'Distance Learning', 'Admissions'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>SNDT Women's University Distance Education Admission 2026</h2>
      <p>Shreemati Nathibai Damodar Thackersey (SNDT) Women's University is the first women's university in India and South-East Asia.</p>
    `,
  },
  {
    title: 'MSc Optometry Distance Education Admission 2026 | Course Details, last date & Fees',
    excerpt: 'Detailed guide for MSc Optometry distance learning 2026. Discover clinical training requirements, eligibility, fee structure, and career scope in vision care.',
    category: 'IT',
    tags: ['IT', 'Optometry', 'Healthcare', 'Distance Education', 'MSc'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      publicId: '',
    },
    content: `
      <h2>MSc Optometry Distance Education Admission 2026</h2>
      <p>MSc Optometry through distance education enables practicing optometrists and vision science graduates to advance their clinical expertise.</p>
    `,
  },
];

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Blog.deleteMany();
    await User.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@dleducation.com',
      password: 'password123',
      role: 'admin',
      bio: 'Admin is an education specialist providing verified distance education updates, university guides, and academic insights.',
    });

    console.log(`✅ Admin created: admin@dleducation.com / password123`);

    // Create Blogs
    const blogsWithAuthor = sampleBlogs.map((b) => ({
      ...b,
      author: adminUser._id,
      published: true,
    }));

    for (const b of blogsWithAuthor) {
      const slug = b.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + '-' + Math.floor(Math.random() * 10000);
      await Blog.create({ ...b, slug });
    }
    console.log(`✅ Seeded ${blogsWithAuthor.length} blogs successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
