const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/clipsphere';

async function seed() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // Drop the database for a clean test run
  await db.dropDatabase();
  console.log('Database dropped');

  // Create admin user with hashed password
  const hashedPassword = await bcrypt.hash('AdminPass123!', 10);
  await db.collection('users').insertOne({
    username: 'admin_clipsphere',
    email: 'admin@clipsphere.test',
    password: hashedPassword,
    role: 'admin',
    active: true,
    accountStatus: 'active',
    notificationPreferences: {
      inApp: { followers: true, comments: true, likes: true, tips: true },
      email: { followers: true, comments: true, likes: true, tips: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });

  console.log('Admin user seeded: admin@clipsphere.test / AdminPass123!');

  // Rebuild indexes (compound unique indexes lost after dropDatabase)
  const Review = require('../src/models/Review');
  const User = require('../src/models/User');
  const Video = require('../src/models/Video');
  const Follower = require('../src/models/Follower');
  await Promise.all([
    Review.createIndexes(),
    User.createIndexes(),
    Video.createIndexes(),
    Follower.createIndexes()
  ]);
  console.log('Indexes rebuilt');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
