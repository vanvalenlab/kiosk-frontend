import * as Joi from 'joi';
import * as dotenv from 'dotenv';
// require and configure dotenv, will load vars in .env in PROCESS.ENV

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(8080),
  MODEL_PREFIX: Joi.string()
    .description('S3 Folder in which models are saved')
    .default('models'),
  UPLOAD_PREFIX: Joi.string()
    .description('S3 Folder in which uploaded files are saved')
    .default('uploads'),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: Joi.string().default('invalid_value'),
  AWS_SECRET_ACCESS_KEY: Joi.string().default('invalid_value'),
  GCLOUD_KEY_FILE: Joi.string().default('invalid_value'),
  GCLOUD_PROJECT_ID: Joi.string().default('invalid_value'),
  STORAGE_BUCKET: Joi.string()
    .description(
      'Cloud storage bucket where data is uploaded and models are saved.'
    )
    .default('gs://deepcell-output'),
  HOSTNAME: Joi.string().description('Kubernetes pod name'),
  REDIS_HOST: Joi.string()
    .default('localhost')
    .description('Redis DB host url'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_SENTINEL: Joi.boolean().default(true),
  JOB_TYPES: Joi.string()
    .default('mesmer,polaris')
    .description('Comma-separated list of job types (Redis queue names).'),
  REACT_APP_GA_TRACKING_ID: Joi.string()
    .default('UA-000000000-0')
    .description('Google Analytics Tracking ID.'),
})
  .unknown()
  .required();

const envVars = Joi.attempt(process.env, envVarsSchema);

const parseCloudProvider = (bucket) => {
  const name = bucket.toString().toLowerCase();
  if (name.startsWith('s3://')) {
    return 'aws';
  } else if (name.startsWith('gs://')) {
    return 'gcp';
  }
  throw new Error(`Invalid storage bucket ${bucket}.`);
};

const config = {
  env: envVars.NODE_ENV,
  cloud: parseCloudProvider(envVars.STORAGE_BUCKET),
  hostname: envVars.HOSTNAME,
  port: envVars.PORT,
  bucketName: envVars.STORAGE_BUCKET.toString().split('://')[1],
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
  },
  gcp: {
    keyFile: envVars.GCLOUD_KEY_FILE,
    projectId: envVars.GCLOUD_PROJECT_ID,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    sentinelEnabled: envVars.REDIS_SENTINEL,
  },
  model: {
    prefix: envVars.MODEL_PREFIX,
  },
  uploadDirectory: envVars.UPLOAD_PREFIX,
  jobTypes: envVars.JOB_TYPES.split(','),
  googleAnaltyics: {
    trackingId: envVars.REACT_APP_GA_TRACKING_ID,
  },
};

export default config;
