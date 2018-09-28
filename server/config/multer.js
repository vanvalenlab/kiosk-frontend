import AWS from 'aws-sdk';
import Multer from 'multer';
import multerS3 from 'multer-s3';
import config from './config';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const s3 = new AWS.S3();

const awsMulter = Multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucketName,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

const gcpMulter = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024 * 1024 // no larger than 5TB, GCE max
  }
});

const multer = config.cloud === 'aws' ? awsMulter : gcpMulter;

export default multer;
