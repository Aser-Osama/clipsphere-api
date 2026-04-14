const {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../config/s3');

exports.uploadObject = async (bucket, key, body, contentType) => {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return key;
};

exports.deleteObject = async (bucket, key) => {
  await s3Client.send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key })
  );
};

exports.getPresignedUrl = async (bucket, key, expiresIn = 3600) => {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn }
  );
};

exports.ensureBucketExists = async (bucket) => {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucket }));
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`Created bucket: ${bucket}`);
    } else {
      throw err;
    }
  }
};
