/**
 * Middleware to verify that requests to admin leads/inquiries routes
 * have supplied the secret leads lock password.
 */
const verifyLeadsLock = (req, res, next) => {
  const configuredPassword = (process.env.LEADS_LOCK_PASSWORD || '909792').toString().trim();

  // Extract key from header, query param (for export downloads), or body
  const providedKey = (
    req.headers['x-leads-lock-key'] ||
    req.headers['x-leads-password'] ||
    req.query.lockKey ||
    (req.body && req.body.leadsLockKey)
  );

  if (!providedKey || providedKey.toString().trim() !== configuredPassword) {
    return res.status(423).json({
      success: false,
      isLocked: true,
      message: 'Leads access is password-protected. Please unlock leads first.',
    });
  }

  next();
};

module.exports = { verifyLeadsLock };
