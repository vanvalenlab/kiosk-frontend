import * as Joi from 'joi';
import * as dotenv from 'dotenv';
// require and configure dotenv, will load vars in .env in PROCESS.ENV

dotenv.config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(8080),
  MODEL_NAME: Joi.string().required()
    .description('Model name to send data'),
  MODEL_VERSION: Joi.number().required()
    .description('Version of MODEL_NAME to send data'),
  MODEL_PREFIX: Joi.string()
    .description('S3 Folder in which models are saved')
    .default('models/'),
  AWS_REGION: Joi.string()
    .default('us-east-1'),
  AWS_ACCESS_KEY_ID: Joi.string().default("invalid_value"),
  AWS_SECRET_ACCESS_KEY: Joi.string().default("invalid_value"),
  AWS_S3_BUCKET: Joi.string().
    .description('S3 Bucket where data is uploaded and models are saved.')
    .default('deepcell-output'),
  GOOGLE_REGION: Joi.string()
    .default('us-east-1'),
  GOOGLE_KEY: Joi.string().default("invalid_value"),
  GOOGLE_SECRET_KEY: Joi.string().default("invalid_value"),
  GOOGLE_BUCKET: Joi.string().
    .description('Google Cloud bucket where data is uploaded and models are saved.')
    .default('deepcell-output'),
  REDIS_HOST: Joi.string().required()
    .description('Redis DB host url'),
  REDIS_PORT: Joi.number()
    .default(6379),
  CLOUD: Joi.string.required()
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    bucketName: envVars.AWS_S3_BUCKET,
    region: envVars.AWS_REGION
  },
  gke: {
    accessKeyId: envVars.GOOGLE_KEY,
    secretAccessKey: envVars.GOOGLE_SECRET_KEY,
    bucketName: envVars.GOOGLE_BUCKET,
    region: envVars.GOOGLE_REGION
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT
  },
  model: {
    name: envVars.MODEL_NAME,
    version: envVars.MODEL_VERSION,
    prefix: envVars.MODEL_PREFIX
  }
};

export default config;
