const Startup = require('../models/Startup');

const createStartup = async (req, res) => {
  try {
    const { startup_name, logo, industry, description, funding_stage, team_size_needed } = req.body;
    const startup = await Startup.create({
      startup_name, logo, industry, description, funding_stage, team_size_needed,
      founder_email: req.user.email, founder_name: req.user.name,
    });
    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findOneAndUpdate({ founder_email: req.user.email }, req.body, { new: true });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findOneAndDelete({ founder_email: req.user.email });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStartups = async (req, res) => {
  try {
    const { page = 1, limit = 6, industry, search } = req.query;
    const query = { status: 'approved' };

    if (industry) query.industry = { $in: industry.split(',') };
    if (search) {
      query.$or = [
        { startup_name: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Startup.countDocuments(query);
    const startups = await Startup.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ startups, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStartup, getMyStartup, updateStartup, deleteStartup, getAllStartups, getStartupById };
