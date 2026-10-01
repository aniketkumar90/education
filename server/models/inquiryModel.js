const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      trim: true,
      maxlength: [15, 'Phone number cannot exceed 15 digits'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    studyMode: {
      type: String,
      trim: true,
      default: '',
    },
    course: {
      type: String,
      trim: true,
      default: '',
    },
    subCourse: {
      type: String,
      trim: true,
      default: '',
    },
    admissionPlanning: {
      type: String,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      trim: true,
      default: 'Website Application Form',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'ENROLLED', 'REJECTED'],
      default: 'NEW',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query sorting by date and status
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ status: 1 });

const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
