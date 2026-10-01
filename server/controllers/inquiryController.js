const Inquiry = require('../models/inquiryModel');

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

    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
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

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryStats,
  updateInquiry,
  deleteInquiry,
};
