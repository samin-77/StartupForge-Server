const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@startupforge.com' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('Admin@123', 12);
      await User.create({
        name: 'Admin',
        email: 'admin@startupforge.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created: admin@startupforge.com / Admin@123');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Error seeding admin:', err.message);
  }
};

module.exports = seedAdmin;
