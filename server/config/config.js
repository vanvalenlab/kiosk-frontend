import * as Joi from 'joi';
import * as dotenv from 'dotenv';
// require and configure dotenv, will load vars in .env in PROCESS.ENV

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number()
    .default(8080),
  CLOUD_PROVIDER: Joi.string()
    .description('The cloud platform to interact with.')
    .valid('gke', 'aws')
    .default('aws'),
  MODEL_PREFIX: Joi.string()
    .description('S3 Folder in which models are saved')
    .default('models'),
  UPLOAD_PREFIX: Joi.string()
    .description('S3 Folder in which uploaded files are saved')
    .default('uploads'),
  AWS_REGION: Joi.string()
    .default('us-east-1'),
  AWS_ACCESS_KEY_ID: Joi.string().default('invalid_value'),
  AWS_SECRET_ACCESS_KEY: Joi.string().default('invalid_value'),
  AWS_S3_BUCKET: Joi.string()
    .description('S3 Bucket where data is uploaded and models are saved.')
    .default('deepcell-output'),
  GCLOUD_KEY_FILE: Joi.string().default('invalid_value'),
  GCLOUD_PROJECT_ID: Joi.string().default('invalid_value'),
  GCLOUD_STORAGE_BUCKET: Joi.string()
    .description('Google Cloud bucket where data is uploaded and models are saved.')
    .default('deepcell-output'),
  HOSTNAME: Joi.string()
    .description('Kubernetes pod name'),
  REDIS_HOST: Joi.string().default('localhost')
    .description('Redis DB host url'),
  REDIS_PORT: Joi.number()
    .default(6379),
  REDIS_SENTINEL: Joi.boolean()
    .default(true),
  JOB_TYPES: Joi.string().default('predict,track')
    .description('Comma-separated list of job types (Redis queue names).')
}).unknown().required();

const envVars = Joi.attempt(process.env, envVarsSchema);

const config = {
  env: envVars.NODE_ENV,
  cloud: envVars.CLOUD_PROVIDER,
  hostname: envVars.HOSTNAME,
  port: envVars.PORT,
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    bucketName: envVars.AWS_S3_BUCKET,
    region: envVars.AWS_REGION
  },
  gcp: {
    keyFile: envVars.GCLOUD_KEY_FILE,
    bucketName: envVars.GCLOUD_STORAGE_BUCKET,
    projectId: envVars.GCLOUD_PROJECT_ID
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    sentinelEnabled: envVars.REDIS_SENTINEL,
  },
  model: {
    prefix: envVars.MODEL_PREFIX
  },
  uploadDirectory: envVars.UPLOAD_PREFIX,
  jobTypes: envVars.JOB_TYPES.split(','),
};

export default config;
