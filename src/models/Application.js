const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  opportunity_role: { type: String, required: true },
  startup_name: { type: String, required: true },
  applicant_email: { type: String, required: true },
  applicant_name: { type: String, required: true },
  portfolio_link: { type: String, default: '' },
  motivation: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  applied_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
