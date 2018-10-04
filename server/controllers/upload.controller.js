import httpStatus from 'http-status';
import { format } from 'util';
import { Storage } from '@google-cloud/storage';
import config from '../config/config';
import logger from '../config/winston';

const storage = new Storage({
  projectId: config.gcp.projectId
});

function gcpUpload(req, res, next) {
  const bucket = storage.bucket(config.gcp.bucketName);

  if (!req.file) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  if (prefix[0] === '/') {
    prefix = prefix.slice(1);
  }

  const filename = `${prefix}/${req.file.originalname}`;

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(filename);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    logger.error(err);
    next(err);
  });

  blobStream.on('finish', () => {
    // The public URL can be used to directly access the file via HTTP.
    // Make the file public
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);

    blob.makePublic().then(() => {
      res.status(httpStatus.OK).send({ imageURL: publicUrl });
    });
  });

  blobStream.end(req.file.buffer);
}

function awsUpload(req, res) {
  try {
    res.status(httpStatus.OK).send({ imageURL: `${req.file.location}` });
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
