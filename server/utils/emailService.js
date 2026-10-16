let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('[EmailService] nodemailer not available:', e.message);
}

/**
 * Creates and returns the Nodemailer SMTP transporter.
 * Configured for Gmail SMTP using dleducationconnect@gmail.com
 */
const getTransporter = () => {
  if (!nodemailer) {
    console.warn('[EmailService] nodemailer is not available. Skipping email.');
    return { transporter: null, reason: 'nodemailer_missing' };
  }

  const user =
    process.env.SMTP_USER ||
    process.env.SMTP_EMAIL ||
    'dleducationconnect@gmail.com';

  const pass = (
    process.env.SMTP_PASS ||
    process.env.SMTP_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    'jdeapydehqxpmlfr'
  ).replace(/\s+/g, '');

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
    return { transporter, reason: null };
  } catch (err) {
    return { transporter: null, reason: `createTransport_failed: ${err.message}` };
  }
};

/**
 * Formats a clean date string for India time.
 */
const formatIndianDateTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
};

/**
 * Generate official HTML for student acknowledgment email.
 * Strictly adheres to official branding without the excluded helpline/counseling cell lines.
 */
const getStudentEmailHtml = (inquiry) => {
  const refId = inquiry._id
    ? `DLE-${new Date().getFullYear()}-${inquiry._id.toString().slice(-6).toUpperCase()}`
    : `DLE-${Date.now().toString().slice(-6)}`;
  const courseTitle = [inquiry.course, inquiry.subCourse].filter(Boolean).join(' - ') || 'Higher Education Course';
  const submittedAt = formatIndianDateTime(inquiry.createdAt || new Date());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Acknowledgment</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;line-height:1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width:600px;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.06),0 2px 4px -2px rgba(0,0,0,0.04);border:1px solid #e2e8f0;">
          
          <!-- Official Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);padding:28px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:1px;font-weight:800;text-transform:uppercase;">DL EDUCATION CONNECT</h1>
              <p style="margin:6px 0 0 0;color:#93c5fd;font-size:12.5px;letter-spacing:0.5px;text-transform:uppercase;font-weight:600;">Official Distance &amp; Online Higher Education Portal</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:28px 24px;">
              <p style="font-size:15px;color:#0f172a;margin:0 0 14px 0;">Dear <strong>${inquiry.name}</strong>,</p>
              
              <p style="font-size:14px;color:#334155;margin:0 0 16px 0;line-height:1.7;">
                Thank you for reaching out to <strong>DL Education Connect</strong>.
              </p>

              <p style="font-size:14px;color:#334155;margin:0 0 20px 0;line-height:1.7;">
                We have successfully received your admission inquiry for <strong>${courseTitle}</strong>. Your application details have been assigned to our senior academic counseling department.
              </p>

              <!-- Application Details Box -->
              <table role="presentation" width="100%" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #2563eb;border-radius:6px;padding:16px;margin:20px 0;">
                <tr>
                  <td>
                    <div style="font-size:12px;font-weight:800;color:#1e3a8a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:12px;">
                      📋 YOUR APPLICATION DETAILS:
                    </div>
                    <table width="100%" cellspacing="0" cellpadding="4" style="font-size:13.5px;color:#334155;">
                      <tr>
                        <td width="38%" style="color:#64748b;font-weight:600;">Inquiry Reference ID:</td>
                        <td style="color:#0f172a;font-weight:700;">${refId}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Candidate Name:</td>
                        <td style="color:#0f172a;font-weight:600;">${inquiry.name}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Contact Number:</td>
                        <td style="color:#0f172a;font-weight:600;">+91 ${inquiry.phone}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Program Applied For:</td>
                        <td style="color:#0f172a;font-weight:600;">${courseTitle}</td>
                      </tr>
                      ${inquiry.studyMode ? `
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Preferred Mode:</td>
                        <td style="color:#0f172a;font-weight:600;">${inquiry.studyMode}</td>
                      </tr>` : ''}
                      ${inquiry.admissionPlanning ? `
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Preferred Admission:</td>
                        <td style="color:#0f172a;font-weight:600;">${inquiry.admissionPlanning}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="color:#64748b;font-weight:600;">Submission Date:</td>
                        <td style="color:#0f172a;font-weight:600;">${submittedAt}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What Happens Next Section -->
              <div style="margin:24px 0 20px 0;">
                <div style="font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px;">
                  🔍 WHAT HAPPENS NEXT?
                </div>
                <ol style="margin:0;padding-left:18px;font-size:13.5px;color:#334155;line-height:1.75;">
                  <li style="margin-bottom:8px;"><strong>Application Verification:</strong> Our expert counselor will review your academic eligibility criteria.</li>
                  <li style="margin-bottom:8px;"><strong>Free Counseling Call:</strong> Within 24-48 business hours, our counselor will call you to explain the fee structure, UGC-DEB approved university options, and syllabus.</li>
                  <li><strong>End-to-End Admission Support:</strong> We assist you in step-by-step documentation and final enrollment.</li>
                </ol>
              </div>

              <!-- Official Sign-off -->
              <div style="border-top:1px solid #e2e8f0;padding-top:18px;margin-top:24px;font-size:13px;color:#475569;line-height:1.6;">
                <strong style="color:#0f172a;font-size:14px;">DL Education Connect</strong><br>
                🌐 Website: <a href="https://dleducationconnect.in" style="color:#2563eb;text-decoration:none;">https://dleducationconnect.in</a><br>
                📧 Email: <a href="mailto:dleducationconnect@gmail.com" style="color:#2563eb;text-decoration:none;">dleducationconnect@gmail.com</a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;font-size:11.5px;color:#94a3b8;">
              &copy; ${new Date().getFullYear()} DL Education Connect. All Rights Reserved.<br>
              This is an automated acknowledgment confirming receipt of your inquiry.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Generate official HTML for Admin lead alert email.
 */
const getAdminEmailHtml = (inquiry, studentEmailSent) => {
  const courseTitle = [inquiry.course, inquiry.subCourse].filter(Boolean).join(' - ') || 'Not Specified';
  const cleanPhone = (inquiry.phone || '').replace(/[^0-9]/g, '');
  const submittedAt = formatIndianDateTime(inquiry.createdAt || new Date());

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Admission Lead Alert</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;line-height:1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" style="max-width:620px;background-color:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px -1px rgba(0,0,0,0.06),0 2px 4px -2px rgba(0,0,0,0.04);border:1px solid #e2e8f0;">
          
          <!-- Admin Alert Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);padding:24px;text-align:center;">
              <span style="display:inline-block;background:#ef4444;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:1px;padding:3px 10px;border-radius:12px;text-transform:uppercase;margin-bottom:8px;">
                🚨 NEW LEAD RECEIVED
              </span>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:0.5px;">ADMISSION INQUIRY ALERT</h1>
              <p style="margin:6px 0 0 0;color:#94a3b8;font-size:12px;">
                Auto-Confirmation to Student: ${studentEmailSent ? '<strong style="color:#22c55e;">✓ Delivered</strong>' : '<strong style="color:#eab308;">⚠ Skipped (No valid email)</strong>'}
              </p>
            </td>
          </tr>

          <!-- Lead Details Table -->
          <tr>
            <td style="padding:24px;">
              
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                <span style="font-size:13px;font-weight:800;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">
                  📊 CANDIDATE PROFILE:
                </span>
                <span style="font-size:11px;background:#e0e7ff;color:#3730a3;padding:2px 8px;border-radius:10px;font-weight:700;">
                  Status: NEW
                </span>
              </div>

              <table width="100%" cellspacing="0" cellpadding="8" style="font-size:13.5px;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
                <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <td width="35%" style="color:#64748b;font-weight:600;">Student Name:</td>
                  <td style="color:#0f172a;font-weight:700;font-size:15px;">${inquiry.name}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Phone Number:</td>
                  <td>
                    <a href="tel:+91${cleanPhone}" style="color:#2563eb;font-weight:800;font-size:15px;text-decoration:none;">
                      📞 +91 ${inquiry.phone}
                    </a>
                  </td>
                </tr>
                <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Email Address:</td>
                  <td style="color:#0f172a;font-weight:600;">
                    ${inquiry.email ? `<a href="mailto:${inquiry.email}" style="color:#2563eb;text-decoration:none;">${inquiry.email}</a>` : '<em style="color:#94a3b8;">Not provided</em>'}
                  </td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Course Applied:</td>
                  <td style="color:#0f172a;font-weight:700;">${inquiry.course || 'Not specified'}</td>
                </tr>
                <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Specialization:</td>
                  <td style="color:#0f172a;font-weight:600;">${inquiry.subCourse || 'General'}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Learning Mode:</td>
                  <td style="color:#0f172a;font-weight:600;">${inquiry.studyMode || 'Distance / Online'}</td>
                </tr>
                <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Admission Planning:</td>
                  <td style="color:#0f172a;font-weight:600;">${inquiry.admissionPlanning || 'Immediate / 2026'}</td>
                </tr>
                <tr style="border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Source Page:</td>
                  <td style="color:#475569;font-weight:500;font-size:12.5px;">${inquiry.source || 'Website Form'}</td>
                </tr>
                ${inquiry.notes ? `
                <tr style="background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <td style="color:#64748b;font-weight:600;">Student Notes:</td>
                  <td style="color:#0f172a;font-style:italic;">"${inquiry.notes}"</td>
                </tr>` : ''}
                <tr>
                  <td style="color:#64748b;font-weight:600;">Received At:</td>
                  <td style="color:#64748b;font-size:12.5px;">${submittedAt}</td>
                </tr>
              </table>

              <!-- Quick Action Buttons -->
              <div style="margin-top:22px;text-align:center;">
                <a href="tel:+91${cleanPhone}" style="display:inline-block;background:#2563eb;color:#ffffff;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;margin:4px;">
                  📞 Call Student
                </a>
                <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(inquiry.name)},%20thank%20you%20for%20contacting%20DL%20Education%20Connect%20regarding%20${encodeURIComponent(courseTitle)}." target="_blank" style="display:inline-block;background:#16a34a;color:#ffffff;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;margin:4px;">
                  💬 Chat on WhatsApp
                </a>
                <a href="https://dleducationconnect.in/admin" target="_blank" style="display:inline-block;background:#0f172a;color:#ffffff;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;margin:4px;">
                  📂 Open Admin CRM
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:14px 24px;text-align:center;border-top:1px solid #e2e8f0;font-size:11.5px;color:#94a3b8;">
              DL Education Connect CRM Notification System • dleducationconnect@gmail.com
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Main dispatcher to send both emails concurrently.
 * 1. To student (if inquiry.email provided)
 * 2. To admin (dleducationconnect@gmail.com)
 */
const sendLeadNotificationEmails = async (inquiry) => {
  const { transporter, reason } = getTransporter();
  if (!transporter) {
    console.warn('[EmailService] Transporter not ready. Reason:', reason);
    return { adminEmailSent: false, studentEmailSent: false, skipped: true, reason };
  }

  const senderEmail = process.env.SMTP_USER || 'dleducationconnect@gmail.com';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'dleducationconnect@gmail.com';
  const courseTitle = [inquiry.course, inquiry.subCourse].filter(Boolean).join(' - ') || 'Course';

  let studentEmailSent = false;
  let adminEmailSent = false;
  let studentError = null;
  let adminError = null;

  // 1. Send confirmation to student if email is valid
  const cleanEmail = (inquiry.email || '').trim().toLowerCase();
  const hasValidStudentEmail = Boolean(
    cleanEmail &&
    cleanEmail.includes('@') &&
    !cleanEmail.endsWith('@example.com')
  );

  if (hasValidStudentEmail) {
    try {
      await transporter.sendMail({
        from: `"DL Education Connect" <${senderEmail}>`,
        to: cleanEmail,
        subject: `Application Acknowledgment: Admission Inquiry for ${courseTitle} | DL Education Connect`,
        html: getStudentEmailHtml(inquiry),
      });
      studentEmailSent = true;
      console.log(`[EmailService] Student confirmation sent successfully to ${cleanEmail}`);
    } catch (err) {
      studentError = err.message;
      console.error(`[EmailService] Failed to send student email to ${cleanEmail}:`, err.message);
    }
  } else {
    studentError = 'Invalid or missing student email address';
  }

  // 2. Send instant alert to Admin
  try {
    await transporter.sendMail({
      from: `"DL Education Connect" <${senderEmail}>`,
      to: adminEmail,
      subject: `🚨 [NEW LEAD] ${inquiry.name} — ${courseTitle} (📞 ${inquiry.phone})`,
      html: getAdminEmailHtml(inquiry, studentEmailSent),
    });
    adminEmailSent = true;
    console.log(`[EmailService] Admin alert sent successfully to ${adminEmail}`);
  } catch (err) {
    adminError = err.message;
    console.error(`[EmailService] Failed to send admin alert email to ${adminEmail}:`, err.message);
  }

  return { adminEmailSent, studentEmailSent, studentError, adminError, recipient: cleanEmail };
};

module.exports = {
  sendLeadNotificationEmails,
  getTransporter,
};
