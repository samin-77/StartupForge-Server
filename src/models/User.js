const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, default: '' },
    password: { type: String, required: true },
    role: { type: String, enum: ['founder', 'collaborator', 'admin'], default: 'collaborator' },
    isBlocked: { type: Boolean, default: false },
    skills: [{ type: String }],
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
