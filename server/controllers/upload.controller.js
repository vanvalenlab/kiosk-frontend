import httpStatus from 'http-status';
import { Storage } from '@google-cloud/storage';
import config from '../config/config';
import logger from '../config/winston';

const storage = new Storage({
  projectId: config.gcp.projectId,
  keyFilename: config.gcp.keyFile
});

function gcpUpload(req, res, next) {
  const bucket = storage.bucket(config.gcp.bucketName);

  if (!req.file) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    logger.error(err);
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    res.status(httpStatus.OK).send({ imageURL: publicUrl });
  });

  blobStream.end(req.file.buffer);
}

function awsUpload(req, res) {
  try {
    res.status(httpStatus.OK).send({ imageURL: req.file.location });
  } catch (error) {
    logger.error(`Error uploading file: ${error}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

function upload(req, res, next) {
  if (config.cloud === 'aws') {
    return awsUpload(req, res);
  } else {
    return gcpUpload(req, res, next);
  }
}

export default { upload };
