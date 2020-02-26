# kiosk-frontend

[![Build Status](https://travis-ci.com/vanvalenlab/kiosk-frontend.svg?branch=master)](https://travis-ci.com/vanvalenlab/kiosk-frontend)

The `kiosk-frontend` serves as the main interaction point for users of the DeepCell Kiosk. The NodeJS backend API and the React frontend allows users to easily create jobs through their web browser.

## Adding new Job Types

The job types are defined as an environment variable `JOB_TYPES`, which evaluates to `"segmentation,tracking"` by default. This can easily be extended by just adding to this string, for example, `"segmentation,tracking,spot detection"`. These values are parsed into a list and populated into the drop-down with the route `/jobtypes`. Each job type value is also the exact value of the Redis queue used by the corresponding consumer (e.g. `"segmentation"` is both the job type and the queue used for the `segmentation-consumer`).

## React Hierarchy

The `App` Component in `/src` folder is the first parent Component that contains all other components. The `App` Component is directly referenced by the `index.js` file inside the `./src` folder. The `index.js` file is the entry point for Webpack (see `webpack.config.js` to bundle the app's data and serve it via `public/index.html` using a plugin called `HtmlWebpackPlugin`. The app also uses Babel via `.babelrc`, which is accessed within Webpack.

`Webpack.dev.js` is used for local development. `Webpack.prod.js` is the webpack config file that is used for production.

## Environmental Variables

The `kiosk-frontend` can be configured using environmental variables in a `.env` file.

| Name | Description | Default Value |
| :--- | :--- | :--- |
| `JOB_TYPES` | **REQUIRED**: Comma delimited list of job type names. | `"segmentation,tracking"` |
| `GCLOUD_STORAGE_BUCKET` | **REQUIRED**: Cloud storage bucket address (e.g. `"gs://bucket-name"`). | `"invalid_default"` |
| `PORT` | Port to run the NodeJS backend server. | `8080` |
| `REDIS_HOST` | The IP address or hostname of Redis. | `redis-master` |
| `REDIS_PORT` | The port used to connect to Redis. | `6379` |
| `REDIS_SENTINEL` | Whether Redis has Sentinel mode enabled. | `True` |
| `MODEL_PREFIX` | Prefix of model directory in the cloud storage bucket. | `"/models"` |
| `UPLOAD_PREFIX` | Prefix of upload directory in the cloud storage bucket. | `"/uploads"` |
| `CLOUD_PROVIDER` | The cloud provider hosting the DeepCell Kiosk. | `"gke"` |
