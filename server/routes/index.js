import AWS from 'aws-sdk';
import express from 'express';
import httpStatus from 'http-status';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from '../config/config';
import controllers from '../controllers';

const router = express.Router();

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.aws.bucketName,
    key: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

router.route('/health-check')
  .get((req, res) => {
    res.sendStatus(httpStatus.OK);
  });

router.route('/upload')
  .post(multer.single('file'), controllers.uploadController.upload);

router.route('/predict')
  .post(controllers.predictController.predict);

router.route('/getModels')
  .get(controllers.modelController.getModels);

export default router;
