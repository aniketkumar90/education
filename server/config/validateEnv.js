/**
 * Safe environment variable validation that logs configuration status
 * without ever printing secret values.
 */
const validateEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  const checks = {
    MONGO_URI: Boolean(process.env.MONGO_URI),
    JWT_SECRET: Boolean(process.env.JWT_SECRET),
    CLIENT_URL: Boolean(process.env.CLIENT_URL),
    CLOUDINARY_CLOUD_NAME: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    CLOUDINARY_API_KEY: Boolean(process.env.CLOUDINARY_API_KEY),
    CLOUDINARY_API_SECRET: Boolean(process.env.CLOUDINARY_API_SECRET),
  };

  const isCloudinaryReady =
    checks.CLOUDINARY_CLOUD_NAME &&
    checks.CLOUDINARY_API_KEY &&
    checks.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

  console.log('--- Environment Configuration Status ---');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MONGO_URI: ${checks.MONGO_URI ? 'configured' : 'MISSING'}`);
  console.log(`JWT_SECRET: ${checks.JWT_SECRET ? 'configured' : 'MISSING'}`);
  console.log(`CLIENT_URL: ${checks.CLIENT_URL ? 'configured' : 'not set (using defaults)'}`);
  console.log(`Cloudinary: ${isCloudinaryReady ? 'configured' : 'partially/not configured'}`);
  console.log('----------------------------------------');

  if (isProduction) {
    const missing = [];
    if (!checks.MONGO_URI) missing.push('MONGO_URI');
    if (!checks.JWT_SECRET) missing.push('JWT_SECRET');

    if (missing.length > 0) {
      console.warn(`⚠️ Warning: Missing required production environment variables: ${missing.join(', ')}`);
    }
  }

  return {
    ...checks,
    isCloudinaryReady,
  };
};

module.exports = validateEnv;
