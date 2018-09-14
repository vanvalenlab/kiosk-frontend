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
    key: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

router.route('/health-check')
  .get((req, res) => {
    res.sendStatus(httpStatus.OK);
  });

router.route('/s3upload')
  .post(upload.single('file'), (req, res) => {
    res.status(httpStatus.OK).send({ imageURL: req.file.location });
  });

router.route('/predict')
  .post(controllers.predictController.predict);

router.route('/getModels')
  .get(controllers.modelController.getModels);

export default router;
