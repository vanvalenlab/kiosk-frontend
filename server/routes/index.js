import express from 'express';
import httpStatus from 'http-status';
import multer from '../config/multer';
import controllers from '../controllers';

const router = express.Router();

router.route('/health-check')
  .get((req, res) => {
    res.sendStatus(httpStatus.OK);
  });

router.route('/upload')
  .post(multer.single('file'), controllers.uploadController.upload);

router.route('/predict')
  .post(controllers.predictController.predict);

router.route('/train')
  .post(controllers.trainController.train);

router.route('/models')
  .get(controllers.modelController.getModels);

router.route('/redis')
  .post(controllers.redisController.getKey);

router.route('/redis/expire')
  .post(controllers.redisController.expireHash);

export default router;
