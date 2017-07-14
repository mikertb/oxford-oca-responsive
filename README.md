# oxford-oca-responsive
This branch contains all development files. Source files are found inside 'src' folder. Distributable build will be found inside 'dist' folder.

## Requirements
* [Node.js](https://nodejs.org/)
* NPM
* [Gulp](http://gulpjs.com/)

### Installation
1. Make sure Node is installed ([download installer](https://nodejs.org/en/download/)).
2. Install Gulp by running the following in terminal:
```
npm install gulp-cli -g
``` 
3. Go to main project directory in terminal and install package dependencies:
```
npm install
```

### Tasks

Make a clean build:
```
gulp rebuild
```

Auto build when file change is detected:
```
gulp watch
```

Serve static files locally:
```
gulp serve
```
