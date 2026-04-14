const { S3Client } = require('@aws-sdk/client-s3');

const requiredVars = ['MINIO_ENDPOINT', 'MINIO_PORT', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY'];
const missing = requiredVars.filter((v) => !process.env[v]);
if (missing.length > 0) {
  throw new Error(`Missing required MinIO env vars: ${missing.join(', ')}`);
}

const s3Client = new S3Client({
  endpoint: `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true,
});

const VIDEOS_BUCKET = process.env.MINIO_BUCKET_VIDEOS || 'clipsphere-videos';
const AVATARS_BUCKET = process.env.MINIO_BUCKET_AVATARS || 'clipsphere-avatars';

module.exports = { s3Client, VIDEOS_BUCKET, AVATARS_BUCKET };
