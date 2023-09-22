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

const uploadFile = async (folderPath, file, ACL) => {
  try {
    const params = {
      Bucket: AWS_BUCKET,
      Key: folderPath,
      Body: file.buffer,
      ACL: ACL,
      Metadata: {
        "Content-Type": file["mimetype"],
      },
    };

    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error("Error in S3 upload: ", error); // log the error
    throw error; // re-throw the error to be caught in the calling function
  }
};

const getFile = async (folderPath) => {
  try {
    const params = {
      Bucket: AWS_BUCKET,
      Key: folderPath,
    };

    const data = await s3.getObject(params).promise();
    const mimeType = data["Metadata"]["content-type"];
    return { buffer: data.Body, mimeType }; // return buffer and mimeType
  } catch (error) {
    console.error("Error in S3 getFile: ", error);
    throw error;
  }
};

module.exports = { uploadFile, getFile };
