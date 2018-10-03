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

let prefix = config.uploadDirectory;
if (prefix[prefix.length - 1] === '/') {
  prefix = prefix.slice(0, prefix.length - 1);
}

const multer = Multer({
  storage: config.cloud === 'aws' ?
    multerS3({
      s3: s3,
      bucket: config.aws.bucketName,
      key: (req, file, cb) => {
        cb(null, `${prefix}/${file.originalname}`);
      }
    })
    : Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024 * 1024 // 5 TB
  }
});

export default multer;
