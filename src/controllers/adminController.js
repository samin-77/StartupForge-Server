const User = require('../models/User');
const Startup = require('../models/Startup');
const Opportunity = require('../models/Opportunity');
const Payment = require('../models/Payment');

const getAdminOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const payments = await Payment.find({ payment_status: 'succeeded' });
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    res.json({ totalUsers, totalStartups, totalOpportunities, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStartups = async (req, res) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ paid_at: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminOverview, getUsers, toggleUserBlock, getAdminStartups, approveStartup, removeStartup, getTransactions };
