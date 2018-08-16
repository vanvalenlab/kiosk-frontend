# react_interface
DeepCell graphical user interface built using React, Babel, Webpack. Run with `npm start` after git-cloning and npm-installing to run the app in development mode. Look into package.json for additional command-line accessible scripts. There is no script that is currently written to run the app in production mode. We can modify that later on.

# Access the FileUpload Component Logic
In order to alter/play with the FileUpload and Flask API request logic, navigate to the ./src/FileUpload folder. The file `FileUpload.js` should contain all the logic that pertains to the API requests, (if) any currently hard-coded IP addresses, etc.

# Component Layout
The `App` Component in `/src` folder is the first parent Component that contains all other components. The `App` Component is directly referenced by the `index.js` file inside the `./src` folder. The `index.js` file is the entry point for Webpack (see `webpack.config.js` to bundle the app's data and serve it via `public/index.html` using a plugin called `HtmlWebpackPlugin`. The app also uses Babel via `.babelrc`, which is accessed within Webpack (press `Command + Shift + .` to be able to view invisible files in Mac Finder).
