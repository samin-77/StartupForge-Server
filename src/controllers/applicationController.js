const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

const applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, portfolio_link, motivation } = req.body;
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });

    const existing = await Application.findOne({ opportunity_id, applicant_email: req.user.email });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const application = await Application.create({
      opportunity_id, opportunity_role: opportunity.role_title, startup_name: opportunity.startup_name,
      applicant_email: req.user.email, applicant_name: req.user.name,
      portfolio_link: portfolio_link || '', motivation,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant_email: req.user.email }).sort({ applied_at: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFounderApplications = async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ founder_email: req.user.email });
    const opportunityIds = opportunities.map((o) => o._id);
    const applications = await Application.find({ opportunity_id: { $in: opportunityIds } }).sort({ applied_at: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const opportunity = await Opportunity.findById(application.opportunity_id);
    if (!opportunity || opportunity.founder_email !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyToOpportunity, getMyApplications, getFounderApplications, updateApplicationStatus };
