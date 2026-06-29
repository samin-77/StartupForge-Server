const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema(
  {
    startup_name: { type: String, required: true, trim: true },
    logo: { type: String, default: '' },
    industry: { type: String, required: true },
    description: { type: String, required: true },
    funding_stage: { type: String, required: true },
    founder_email: { type: String, required: true },
    founder_name: { type: String, required: true },
    team_size_needed: { type: Number, default: 1 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Startup', startupSchema);
