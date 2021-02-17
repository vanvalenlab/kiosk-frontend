import express from 'express';
import httpStatus from 'http-status';
import multer from '../config/multer';
import swaggerSpec from '../config/swagger';
import controllers from '../controllers';

const router = express.Router();

/**
 * @swagger
 *
 * /api/health-check:
 *   get:
 *     description: Health check endpoint.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: healthy
 */
router.route('/health-check')
  .get((req, res) => {
    res.status(httpStatus.OK).send({ message: 'OK' });
  });

/**
 * @swagger
 *
 * /api/upload:
 *   post:
 *     description: Upload a file.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: file
 *         description: The file to upload
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: healthy
 */
router.route('/upload')
  .post(multer.single('file'), controllers.uploadController.upload);

/**
 * @swagger
 *
 * /api/predict:
 *   post:
 *     description: Submit a job to the DeepCell Kiosk.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: jobType
 *         description: The job queue to submit a job to.
 *         in: body
 *         required: true
 *         type: string
 *       - name: imageName
 *         description: The name of an uploaded file.
 *         in: body
 *         required: true
 *         type: string
 *       - name: uploadedName
 *         description: The original name of the uploaded file.
 *         in: body
 *         required: false
 *         type: string
 *       - name: modelName
 *         description: The name of the model to use.
 *         in: body
 *         required: false
 *         type: string
 *       - name: modelVersion
 *         description: The version of the model to use.
 *         in: body
 *         required: false
 *         type: int
 *       - name: postprocessFunction
 *         description: The name of the post-processing function to use.
 *         in: body
 *         required: false
 *         type: string
 *       - name: preprocessFunction
 *         description: The name of the pre-processing function to use.
 *         in: body
 *         required: false
 *         type: string
 *       - name: dataRescale
 *         description: The scale of the data. If not provided, scale will be auto-detected.
 *         in: body
 *         required: false
 *         type: string
 *       - name: dataLabel
 *         description: The label type of the data. If not provided, label will be auto-detected.
 *         in: body
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: healthy
 */
router.route('/predict')
  .post(controllers.predictController.predict);

/**
 * @swagger
 *
 * /api/models:
 *   get:
 *     description: Get all registered models.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of available models.
 */
router.route('/models')
  .get(controllers.modelController.getModels);

/**
 * @swagger
 *
 * /api/redis:
 *   post:
 *     description: Get one to many fields of a DeepCell Kiosk job.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: hash
 *         description: The job hash to query.
 *         in: body
 *         required: true
 *         type: string
 *       - name: key
 *         description: The field or fields to get.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: The job status
 */
router.route('/redis')
  .post(controllers.predictController.getKey);

/**
 * @swagger
 *
 * /api/status:
 *   post:
 *     description: Get the status of a DeepCell Kiosk job.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: hash
 *         description: The job to get the status of.
 *         in: body
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: The job status
 */
router.route('/status')
  .post(controllers.predictController.getJobStatus);

/**
 * @swagger
 *
 * /api/redis/expire:
 *   post:
 *     description: Expire a completed DeepCell Kiosk job.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: hash
 *         description: The job hash to expire.
 *         in: body
 *         required: true
 *         type: string
 *       - name: expireIn
 *         description: Job will expire after this many seconds.
 *         in: body
 *         required: false
 *         type: int
 *     responses:
 *       200:
 *         description: Successful job expiry.
 */
router.route('/redis/expire')
  .post(controllers.predictController.expireHash);

/**
 * @swagger
 *
 * /api/models:
 *   get:
 *     description: Get all valid job types.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of valid job types.
 */
router.route('/jobtypes')
  .get(controllers.predictController.getJobTypes);

// swagger docs!
router.route('/swagger.json')
  .get((req, res) => {
    res.status(httpStatus.OK).send(swaggerSpec);
  });

// 404 for all other routes
router.route('/*')
  .get((req, res) => {
    res.status(httpStatus.NOT_FOUND).send({});
  })
  .post((req, res) => {
    res.status(httpStatus.NOT_FOUND).send({});
  });

export default router;
