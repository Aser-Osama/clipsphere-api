require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('DB connected');

    try {
      const { ensureBucketExists } = require('./src/services/storage.service');
      const { VIDEOS_BUCKET, AVATARS_BUCKET } = require('./src/config/s3');
      await ensureBucketExists(VIDEOS_BUCKET);
      await ensureBucketExists(AVATARS_BUCKET);
      console.log('Storage buckets ready');
    } catch (s3Err) {
      console.error('Storage initialization failed:', s3Err.message);
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
  });