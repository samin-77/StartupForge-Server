const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Startup = require('../models/Startup');
const Opportunity = require('../models/Opportunity');
const Payment = require('../models/Payment');

const dummyFounders = [
  { name: 'Sarah Chen', email: 'sarah@nexusai.io', password: 'Founder@123', role: 'founder', skills: ['AI', 'Python', 'Leadership'], bio: 'AI researcher turned entrepreneur. Building the future of intelligent systems.' },
  { name: 'Marcus Johnson', email: 'marcus@finflow.co', password: 'Founder@123', role: 'founder', skills: ['Finance', 'Blockchain', 'Product'], bio: 'Ex-Goldman Sachs, now democratizing financial services.' },
  { name: 'Priya Patel', email: 'priya@healthsync.com', password: 'Founder@123', role: 'founder', skills: ['Healthcare', 'Data Science', 'Business'], bio: 'Doctor by training, builder by passion. Reinventing healthcare delivery.' },
  { name: 'Alex Kim', email: 'alex@shopwave.com', password: 'Founder@123', role: 'founder', skills: ['E-commerce', 'Marketing', 'Growth'], bio: 'Serial entrepreneur on a mission to transform online shopping.' },
  { name: 'Jordan Blake', email: 'jordan@learnspark.io', password: 'Founder@123', role: 'founder', skills: ['Education', 'EdTech', 'Strategy'], bio: 'Teacher turned founder. Making learning accessible for everyone.' },
  { name: 'Maya Torres', email: 'maya@ecopulse.earth', password: 'Founder@123', role: 'founder', skills: ['Sustainability', 'Engineering', 'Product'], bio: 'Environmental engineer building tech for a greener planet.' },
];

const dummyStartups = [
  { startup_name: 'NexusAI', logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', industry: 'AI/ML', description: 'NexusAI builds cutting-edge machine learning infrastructure that enables enterprises to deploy and scale AI models with confidence. Our platform handles data pipelines, model training, deployment, and monitoring — all in one place.', funding_stage: 'Seed', founder_email: 'sarah@nexusai.io', founder_name: 'Sarah Chen', team_size_needed: 5, status: 'approved' },
  { startup_name: 'FinFlow', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', industry: 'Finance', description: 'FinFlow is a next-gen financial platform that simplifies personal and small business finance management. We use AI to provide personalized financial insights, automate budgeting, and optimize investment strategies.', funding_stage: 'Pre-Seed', founder_email: 'marcus@finflow.co', founder_name: 'Marcus Johnson', team_size_needed: 4, status: 'approved' },
  { startup_name: 'HealthSync', logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop', industry: 'Healthcare', description: 'HealthSync connects patients with healthcare providers through a seamless telemedicine platform. We offer AI-powered diagnostics, electronic health records, and remote monitoring to make healthcare accessible to all.', funding_stage: 'Series A', founder_email: 'priya@healthsync.com', founder_name: 'Priya Patel', team_size_needed: 6, status: 'approved' },
  { startup_name: 'ShopWave', logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', industry: 'E-commerce', description: 'ShopWave is revolutionizing the e-commerce experience with AI-driven personalization, AR try-ons, and social shopping features. We help small to medium retailers compete with industry giants.', funding_stage: 'Seed', founder_email: 'alex@shopwave.com', founder_name: 'Alex Kim', team_size_needed: 3, status: 'approved' },
  { startup_name: 'LearnSpark', logo: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop', industry: 'Education', description: 'LearnSpark is an adaptive learning platform that uses AI to create personalized learning paths for students. We make education engaging, effective, and accessible to learners worldwide.', funding_stage: 'Pre-Seed', founder_email: 'jordan@learnspark.io', founder_name: 'Jordan Blake', team_size_needed: 4, status: 'approved' },
  { startup_name: 'EcoPulse', logo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop', industry: 'Sustainability', description: 'EcoPulse provides IoT-powered environmental monitoring and analytics for businesses. Our sensors and dashboard help companies track their carbon footprint, reduce waste, and meet sustainability goals.', funding_stage: 'Seed', founder_email: 'maya@ecopulse.earth', founder_name: 'Maya Torres', team_size_needed: 3, status: 'approved' },
];

const dummyOpportunities = [
  { role_title: 'Senior ML Engineer', required_skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Kubernetes'], work_type: 'remote', commitment_level: 'full-time', deadline: new Date('2026-09-30'), industry: 'AI/ML' },
  { role_title: 'Product Designer', required_skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping'], work_type: 'hybrid', commitment_level: 'full-time', deadline: new Date('2026-08-15'), industry: 'AI/ML' },
  { role_title: 'Full Stack Developer', required_skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'], work_type: 'remote', commitment_level: 'full-time', deadline: new Date('2026-09-01'), industry: 'Finance' },
  { role_title: 'UX Researcher', required_skills: ['User Research', 'Usability Testing', 'Data Analysis', 'Prototyping'], work_type: 'onsite', commitment_level: 'contract', deadline: new Date('2026-07-20'), industry: 'Healthcare' },
  { role_title: 'Marketing Lead', required_skills: ['Growth Marketing', 'SEO', 'Content Strategy', 'Analytics'], work_type: 'remote', commitment_level: 'full-time', deadline: new Date('2026-08-30'), industry: 'E-commerce' },
  { role_title: 'Content Strategist', required_skills: ['Content Writing', 'SEO', 'Curriculum Design', 'Video Production'], work_type: 'hybrid', commitment_level: 'part-time', deadline: new Date('2026-09-15'), industry: 'Education' },
];

const seedDummyData = async () => {
  try {
    const hashedPassword = await bcrypt.hash('Founder@123', 12);

    for (let i = 0; i < dummyFounders.length; i++) {
      const founder = dummyFounders[i];
      const existingUser = await User.findOne({ email: founder.email });
      if (!existingUser) {
        await User.create({ ...founder, password: hashedPassword, image: `https://i.pravatar.cc/150?u=${founder.email}` });
      }
    }

    const startupRecords = [];
    for (const startupData of dummyStartups) {
      const existingStartup = await Startup.findOne({ startup_name: startupData.startup_name });
      if (!existingStartup) {
        const startup = await Startup.create(startupData);
        startupRecords.push(startup);
      } else {
        startupRecords.push(existingStartup);
      }
    }

    for (let i = 0; i < dummyOpportunities.length; i++) {
      const opp = dummyOpportunities[i];
      const startupIndex = Math.min(i, startupRecords.length - 1);
      const startup = startupRecords[startupIndex];
      const existingOpp = await Opportunity.findOne({ role_title: opp.role_title, startup_id: startup._id });
      if (!existingOpp) {
        await Opportunity.create({
          ...opp,
          startup_id: startup._id,
          startup_name: startup.startup_name,
          founder_email: startup.founder_email,
        });
      }
    }

    await Payment.deleteMany({ amount: { $gte: 1000000000 } });

    const dummyPayments = [
      { user_name: 'Sarah Chen', user_email: 'sarah@nexusai.io', amount: 19.99, transaction_id: 'pi_3R_DUMMY_NEXUS_001', payment_status: 'succeeded', paid_at: new Date('2026-06-15') },
      { user_name: 'Marcus Johnson', user_email: 'marcus@finflow.co', amount: 19.99, transaction_id: 'pi_3R_DUMMY_FINFL_002', payment_status: 'succeeded', paid_at: new Date('2026-06-18') },
      { user_name: 'Priya Patel', user_email: 'priya@healthsync.com', amount: 19.99, transaction_id: 'pi_3R_DUMMY_HEALT_003', payment_status: 'succeeded', paid_at: new Date('2026-06-20') },
      { user_name: 'Alex Kim', user_email: 'alex@shopwave.com', amount: 19.99, transaction_id: 'pi_3R_DUMMY_SHOPW_004', payment_status: 'succeeded', paid_at: new Date('2026-06-22') },
      { user_name: 'Jordan Blake', user_email: 'jordan@learnspark.io', amount: 19.99, transaction_id: 'pi_3R_DUMMY_LEARN_005', payment_status: 'failed', paid_at: new Date('2026-06-25') },
      { user_name: 'Maya Torres', user_email: 'maya@ecopulse.earth', amount: 19.99, transaction_id: 'pi_3R_DUMMY_ECOP_006', payment_status: 'succeeded', paid_at: new Date('2026-06-28') },
    ];

    for (const payment of dummyPayments) {
      const existing = await Payment.findOne({ transaction_id: payment.transaction_id });
      if (!existing) {
        await Payment.create(payment);
      }
    }

    console.log('Dummy data seeded: 6 founders, 6 startups, 6 opportunities, 6 transactions');
  } catch (err) {
    console.error('Error seeding dummy data:', err.message);
  }
};

module.exports = seedDummyData;
