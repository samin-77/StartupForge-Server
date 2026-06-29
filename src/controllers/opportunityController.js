const Opportunity = require('../models/Opportunity');
const Startup = require('../models/Startup');
const Payment = require('../models/Payment');

const createOpportunity = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.status(404).json({ message: 'Create a startup first' });

    const opportunitiesCount = await Opportunity.countDocuments({ founder_email: req.user.email });
    if (opportunitiesCount >= 3) {
      const payment = await Payment.findOne({ user_email: req.user.email, payment_status: 'succeeded' });
      if (!payment) {
        return res.status(403).json({ message: 'Please purchase premium to post more opportunities' });
      }
    }

    const { role_title, required_skills, work_type, commitment_level, deadline } = req.body;
    const opportunity = await Opportunity.create({
      startup_id: startup._id, startup_name: startup.startup_name, role_title,
      required_skills, work_type, commitment_level, deadline,
      industry: startup.industry, founder_email: req.user.email,
    });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ founder_email: req.user.email }).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, founder_email: req.user.email }, req.body, { new: true }
    );
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findOneAndDelete({ _id: req.params.id, founder_email: req.user.email });
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunities = async (req, res) => {
  try {
    const { page = 1, limit = 6, search, work_type, industry } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { role_title: { $regex: search, $options: 'i' } },
        { required_skills: { $regex: search, $options: 'i' } },
      ];
    }
    if (work_type) query.work_type = { $in: work_type.split(',') };
    if (industry) query.industry = { $in: industry.split(',') };

    const total = await Opportunity.countDocuments(query);
    const opportunities = await Opportunity.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ opportunities, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOpportunities = await Opportunity.countDocuments({ founder_email: req.user.email });
    const totalApplications = await Opportunity.aggregate([
      { $match: { founder_email: req.user.email } },
      { $lookup: { from: 'applications', localField: '_id', foreignField: 'opportunity_id', as: 'apps' } },
      { $unwind: { path: '$apps', preserveNullAndEmptyArrays: true } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    const acceptedApplications = await Opportunity.aggregate([
      { $match: { founder_email: req.user.email } },
      { $lookup: { from: 'applications', localField: '_id', foreignField: 'opportunity_id', as: 'apps' } },
      { $unwind: { path: '$apps', preserveNullAndEmptyArrays: true } },
      { $match: { 'apps.status': 'accepted' } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.json({
      totalOpportunities,
      totalApplications: totalApplications[0]?.count || 0,
      acceptedMembers: acceptedApplications[0]?.count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOpportunity, getMyOpportunities, updateOpportunity, deleteOpportunity, getOpportunities, getOpportunityById, getDashboardStats };
