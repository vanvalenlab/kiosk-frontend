import httpStatus from 'http-status';
import logger from '../config/winston';

function upload(req, res) {
  try {
    res.status(httpStatus.OK).send({ imageURL: req.file.location });
  } catch (error) {
    logger.error(`Error uploading file: ${error}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { upload };
