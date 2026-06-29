const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user_email: { type: String, required: true },
  user_name: { type: String, required: true },
  amount: { type: Number, required: true },
  transaction_id: { type: String, required: true, unique: true },
  payment_status: { type: String, enum: ['succeeded', 'failed', 'pending'], default: 'succeeded' },
  paid_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
