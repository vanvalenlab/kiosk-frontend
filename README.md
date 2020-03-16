# kiosk-frontend

[![Build Status](https://travis-ci.com/vanvalenlab/kiosk-frontend.svg?branch=master)](https://travis-ci.com/vanvalenlab/kiosk-frontend)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/vanvalenlab/kiosk-frontend/blob/master/LICENSE)

The `kiosk-frontend` serves as the main interaction point for users of the DeepCell Kiosk. The NodeJS backend API and the React frontend allows users to easily create jobs through their web browser.

This repository is part of the [DeepCell Kiosk](https://github.com/vanvalenlab/kiosk-console). More information about the Kiosk project is available through [Read the Docs](https://deepcell-kiosk.readthedocs.io/en/master) and our [FAQ](http://www.deepcell.org/faq) page.

## Adding new Job Types

The job types are defined as an environment variable `JOB_TYPES`, which evaluates to `"segmentation,tracking"` by default. This can easily be extended by just adding to this string, for example, `"segmentation,tracking,spot detection"`. These values are parsed into a list and populated into the drop-down with the route `/jobtypes`. Each job type value is also the exact value of the Redis queue used by the corresponding consumer (e.g. `"segmentation"` is both the job type and the queue used for the `segmentation-consumer`).

## React Hierarchy

The `App` Component in `/src` folder is the first parent Component that contains all other components. The `App` Component is directly referenced by the `index.js` file inside the `./src` folder. The `index.js` file is the entry point for Webpack (see `webpack.config.js` to bundle the app's data and serve it via `public/index.html` using a plugin called `HtmlWebpackPlugin`. The app also uses Babel via `.babelrc`, which is accessed within Webpack.

`Webpack.dev.js` is used for local development. `Webpack.prod.js` is the webpack config file that is used for production.

## Configuration

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

## Contribute

We welcome contributions to the [kiosk-console](https://github.com/vanvalenlab/kiosk-console) and its associated projects. If you are interested, please refer to our [Developer Documentation](https://deepcell-kiosk.readthedocs.io/en/master/DEVELOPER.html), [Code of Conduct](https://github.com/vanvalenlab/kiosk-console/blob/master/CODE_OF_CONDUCT.md) and [Contributing Guidelines](https://github.com/vanvalenlab/kiosk-console/blob/master/CONTRIBUTING.md).

## License

This software is license under a modified Apache-2.0 license. See [LICENSE](/LICENSE) for full  details.

## Copyright

Copyright © 2018-2020 [The Van Valen Lab](http://www.vanvalen.caltech.edu/) at the California Institute of Technology (Caltech), with support from the Paul Allen Family Foundation, Google, & National Institutes of Health (NIH) under Grant U24CA224309-01.
All rights reserved.
