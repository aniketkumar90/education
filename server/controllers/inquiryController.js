const Inquiry = require('../models/inquiryModel');
const { sendLeadNotificationEmails } = require('../utils/emailService');

// @desc    Create new lead / admission inquiry (from website forms or popups)
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      studyMode,
      course,
      subCourse,
      admissionPlanning,
      source,
      notes,
    } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      return next(new Error('Name is required'));
    }

    if (!phone || !phone.trim()) {
      res.status(400);
      return next(new Error('Phone number is required'));
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: (email || '').trim().toLowerCase(),
      studyMode: (studyMode || '').trim(),
      course: (course || '').trim(),
      subCourse: (subCourse || '').trim(),
      admissionPlanning: (admissionPlanning || '').trim(),
      source: (source || 'Website Form').trim(),
      notes: (notes || '').trim(),
      status: 'NEW',
    });

    // Send official email notifications: Student acknowledgment + Admin lead alert
    try {
      await sendLeadNotificationEmails(inquiry);
    } catch (emailErr) {
      console.error('[InquiryController] Email notification error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Inquiry received successfully! Our counselor will contact you soon.',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries / leads (with filtering, search, pagination)
// @route   GET /api/inquiries
// @access  Private/Admin
const getInquiries = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const status = req.query.status || '';
    const search = req.query.search || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';

    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = e;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { subCourse: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Aggregate stats for dashboard quick reference
    const [totalAll, newCount, contactedCount, qualifiedCount, enrolledCount] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'NEW' }),
      Inquiry.countDocuments({ status: 'CONTACTED' }),
      Inquiry.countDocuments({ status: 'QUALIFIED' }),
      Inquiry.countDocuments({ status: 'ENROLLED' }),
    ]);

    res.json({
      inquiries,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
      stats: {
        total: totalAll,
        new: newCount,
        contacted: contactedCount,
        qualified: qualifiedCount,
        enrolled: enrolledCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inquiries summary stats
// @route   GET /api/inquiries/stats
// @access  Private/Admin
const getInquiryStats = async (req, res, next) => {
  try {
    const [total, newCount, contactedCount, qualifiedCount, enrolledCount, rejectedCount] =
      await Promise.all([
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ status: 'NEW' }),
        Inquiry.countDocuments({ status: 'CONTACTED' }),
        Inquiry.countDocuments({ status: 'QUALIFIED' }),
        Inquiry.countDocuments({ status: 'ENROLLED' }),
        Inquiry.countDocuments({ status: 'REJECTED' }),
      ]);

    res.json({
      total,
      new: newCount,
      contacted: contactedCount,
      qualified: qualifiedCount,
      enrolled: enrolledCount,
      rejected: rejectedCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status or details
// @route   PUT /api/inquiries/:id
// @access  Private/Admin
const updateInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, name, phone, email, course, subCourse, studyMode, admissionPlanning } = req.body;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry lead not found'));
    }

    if (status !== undefined) inquiry.status = status;
    if (notes !== undefined) inquiry.notes = notes;
    if (name !== undefined) inquiry.name = name;
    if (phone !== undefined) inquiry.phone = phone;
    if (email !== undefined) inquiry.email = email;
    if (course !== undefined) inquiry.course = course;
    if (subCourse !== undefined) inquiry.subCourse = subCourse;
    if (studyMode !== undefined) inquiry.studyMode = studyMode;
    if (admissionPlanning !== undefined) inquiry.admissionPlanning = admissionPlanning;

    const updated = await inquiry.save();
    res.json({ success: true, inquiry: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry lead
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      res.status(404);
      return next(new Error('Inquiry lead not found'));
    }

    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads to Excel-compatible CSV file (filtered by date range, status, search)
// @route   GET /api/inquiries/export
// @access  Private/Admin
const exportInquiries = async (req, res, next) => {
  try {
    const status = req.query.status || '';
    const search = req.query.search || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';

    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const s = new Date(startDate);
        s.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        e.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = e;
      }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } },
        { subCourse: { $regex: search, $options: 'i' } },
        { source: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      'S.No.',
      'Inquiry Date',
      'Time (IST)',
      'Student Name',
      'Mobile Number',
      'Email Address',
      'Course',
      'Specialization',
      'Study Mode',
      'Admission Planning',
      'Lead Source',
      'Status',
      'Counselor Notes',
      'Lead ID',
    ];

    const rows = inquiries.map((item, index) => {
      const d = item.createdAt ? new Date(item.createdAt) : null;
      const dateStr = d ? d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }) : '';
      const timeStr = d ? d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) : '';
      const phoneClean = item.phone ? `\t${item.phone}` : '';

      return [
        index + 1,
        escapeCsv(dateStr),
        escapeCsv(timeStr),
        escapeCsv(item.name || ''),
        escapeCsv(phoneClean),
        escapeCsv(item.email || ''),
        escapeCsv(item.course || ''),
        escapeCsv(item.subCourse || ''),
        escapeCsv(item.studyMode || ''),
        escapeCsv(item.admissionPlanning || ''),
        escapeCsv(item.source || ''),
        escapeCsv(item.status || 'NEW'),
        escapeCsv(item.notes || ''),
        escapeCsv(String(item._id || '')),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    const fileNameDate = startDate
      ? `${startDate}${endDate && endDate !== startDate ? `_to_${endDate}` : ''}`
      : new Date().toISOString().split('T')[0];
    const filename = `DLEducationConnect_Leads_${fileNameDate}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify leads lock password
// @route   POST /api/inquiries/verify-lock
// @access  Private/Admin
const verifyLeadsLockPassword = async (req, res) => {
  const { password } = req.body;
  const configuredPassword = (process.env.LEADS_LOCK_PASSWORD || '909792').toString().trim();

  if (password && password.toString().trim() === configuredPassword) {
    return res.json({
      success: true,
      message: 'Password verified successfully! Leads access unlocked.',
      unlocked: true,
    });
  }

  return res.status(401).json({
    success: false,
    unlocked: false,
    message: 'Incorrect password. Access denied.',
  });
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryStats,
  exportInquiries,
  updateInquiry,
  deleteInquiry,
  verifyLeadsLockPassword,
};

