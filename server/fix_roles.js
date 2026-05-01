require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixRoles() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Update rahul and om to admin
    await User.updateMany(
      { email: { $in: ['rahul123@gmail.com', 'om008195@gmail.com', '2k22cse2213595@gmail.com', 'preet123@gmail.com', 'man543@gmail.com'] } },
      { $set: { role: 'admin' } }
    );
    
    const users = await User.find({}, 'name email role');
    console.log('Updated users:', users);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixRoles();
