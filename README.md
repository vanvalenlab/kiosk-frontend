# react_interface
DeepCell graphical user interface built using React, Babel, Webpack. Run with `npm start` after git-cloning and npm-installing to run the app in development mode. Look into package.json for additional command-line accessible scripts. There is no script that is currently written to run the app in production mode. We can modify that later on.

# Access the FileUpload Component Logic
In order to alter/play with the FileUpload and Flask API request logic, navigate to the ./src/FileUpload folder. The file `FileUpload.js` should contain all the logic that pertains to the API requests, (if) any currently hard-coded IP addresses, etc.

# Component Layout
The `App` Component in `/src` folder is the first parent Component that contains all other components. The `App` Component is directly referenced by the `index.js` file inside the `./src` folder. The `index.js` file is the entry point for Webpack (see `webpack.config.js` to bundle the app's data and serve it via `public/index.html` using a plugin called `HtmlWebpackPlugin`. The app also uses Babel via `.babelrc`, which is accessed within Webpack (press `Command + Shift + .` to be able to view invisible files in Mac Finder).

# Environment Variables Being Used
While deployed, app uses environment variables specified in the package.json's `npm run builddocker` script. The environment variables are referenced using bash syntax in the script and draws the values from Docker's environment. The environment variables within the Docker container are specified inside the Dockerfile. Because the team is deploying the application utilizing Kubernetes, the values of the environment variables inside the Dockerfile will be referenced symbolically so as to obscure their true values.

#Webpack Config
Currently, the webpack config being used for deployment is `webpack.docker.js`. The webpack config being used for local development is `webpack.dev.js`. The webpack config that SHOULD have been used for deployment is `webpack.prod.js`. `Webpack.prod.js` is not properly updated for use. Please speak with Brian about updating it if we are planning to deploy using that config file. The `webpack.docker.js` in `branch:dylan_dockerization` has modifications that explicitly map-out the keys and values of the environment variables in a Plugin declaration at the bottom of the file. Within the webpack configuration files, if you wish to reference the environment variables, you must just use `env.variableName`. You will not be able to use `process.env.variableName` because the assignment of `process.env` from `env` hasn't occurred yet.

# Deployment and deployment related modifications
While deploying the react app using Docker, we decided to use the Webpack development server because it was easier then serving it via WebPack production mode, because that would have involved implementing an Express.js server. The infrastructure for the Express.js server is currently saved in the repository, but it is not being utilized until further notice. (8/27/2018)

