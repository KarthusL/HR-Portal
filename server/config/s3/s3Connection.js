const AWS = require("aws-sdk");
require("dotenv").config();

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_REGION, AWS_BUCKET } =
  process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: S3_REGION,
});

const s3 = new AWS.S3();

const checkS3Connection = async () => {
  const params = {
    Bucket: AWS_BUCKET,
  };

  try {
    await s3.headBucket(params).promise();
    console.log("AWS S3 connection successful.");
  } catch (error) {
    console.log("Error connecting to AWS S3:", error);
    process.exit(1); // Exit with failure status
  }
};

module.exports = checkS3Connection;
