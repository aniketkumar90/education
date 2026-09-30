const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Check if Cloudinary is configured with valid credentials
const isCloudinaryConfigured = () => {
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  return (
    Boolean(key && secret && cloud) &&
    key !== 'your_api_key' &&
    secret !== 'your_api_secret' &&
    cloud !== 'your_cloud_name'
  );
};

// Ensure local uploads folder exists for local development fallback
const uploadDir = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch {
  // Ignore filesystem error in read-only serverless environments
}

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// In-memory storage: no temporary files left on disk, works cleanly in serverless & local
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Helper: upload buffer to Cloudinary, or fallback to local uploads folder
const uploadToCloudinary = async (buffer, folder = 'education-blogs', originalname = 'image.jpg') => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });
  }

  // If in production without Cloudinary, fallback to base64 Data URL so the blog saves and images display reliably
  if (process.env.NODE_ENV === 'production') {
    const ext = (path.extname(originalname) || '.jpg').replace('.', '').toLowerCase();
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return {
      secure_url: `data:${mime};base64,${buffer.toString('base64')}`,
      public_id: `inline-${Date.now()}`,
    };
  }

  // Local development fallback to /uploads folder
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname) || '.jpg'}`;
  try {
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    return {
      secure_url: `/uploads/${filename}`,
      public_id: filename,
    };
  } catch {
    // If local directory failed (e.g. read-only), fallback to os.tmpdir
    const tmpPath = path.join(os.tmpdir(), filename);
    await fs.promises.writeFile(tmpPath, buffer);
    return {
      secure_url: `/uploads/${filename}`,
      public_id: filename,
    };
  }
};

module.exports = { upload, uploadToCloudinary, isCloudinaryConfigured };
