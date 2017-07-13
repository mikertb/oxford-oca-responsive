# oxford-oca-responsive
This branch contains all development files. Source files are found inside 'src' folder. Distributable build will be found inside 'dist' folder.

## Requirements
* [Node.js](https://nodejs.org/)
* NPM
* [Gulp](http://gulpjs.com/)

### Installation
Make sure Node is already installed ([download installer](https://nodejs.org/en/download/)) then install Gulp by running the following in terminal:
```
npm install gulp-cli -g
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
