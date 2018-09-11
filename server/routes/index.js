import express from 'express';
import httpStatus from 'http-status';
import controllers from '../controllers';

const router = express.Router();

router.route('/health-check')
  .get((req, res) => {
    res.sendStatus(httpStatus.OK);
  });

router.route('/s3upload')
  .post(controllers.s3upload);

router.route('/redis')
  .post(controllers.redisConnect);

router.route('/getModels')
  .get(controllers.getModels);

export default router;
