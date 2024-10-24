import fs from 'node:fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import config from '##/src/config/config.js';
import { generateRandomName } from '##/src/config/lib/crypto.js';

// Configure Multer with Custom Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use the original file name and extension
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Configure AWS S3

const s3Client = new S3Client({
  region: config.aws_region,
  credentials: {
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
  },
});

// The request should contain the file from formData
async function uploadToS3(req, directory) {
  try {
    if (!req.file) {
      return { message: 'No file uploaded', ok: false };
    }
    const uniqueFileName = generateRandomName();
    const fileName = req.file.originalname.split('.');
    const fileStream = fs.createReadStream(req.file.path);

    const uploadParams = {
      Bucket: config.aws_s3_bucket,
      // Key: `${uniqueFileName}.${fileName[fileName.length - 1]}`, // Use the unique file name for S3
      Key: `${directory}/${uniqueFileName}.${fileName[fileName.length - 1]}`,
      Body: fileStream,
    };

    // const s3Config = {
    //   bucketName: awsBucketName,
    //   dirName: awsDirectoryName,
    //   region: awsRegion,
    //   accessKeyId: awsAccessId,
    //   secretAccessKey: awsSecretKey,
    // };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    // delete the file after uploading to S3
    fs.unlinkSync(req.file.path);

    return {
      message: 'File uploaded successfully.',
      fileLink: `${config.aws_s3_domain}/${uploadParams.Key}`,
      ok: true,
    };
  } catch (error) {
    return { message: 'Error uploading file.', error: error.message, ok: false };
  }
}

export { s3Client, upload, uploadToS3 };
