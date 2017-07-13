// loads various gulp modules
const fs = require('fs-extra');
const exec = require('child_process').exec;
const gulp = require('gulp');
const concat = require('gulp-concat');
const minifyCSS = require('gulp-clean-css');
const webserver = require('gulp-webserver');

let main_css = [
        './src/css/normalize.css',
        './src/css/styles.css',
        './src/css/index.css',
        './src/css/questionnaire.css',
        './src/css/paminta.css',
    ];
let main_img = [
        './src/images/*.png',
        './src/images/*.jpg',
        './src/images/*.gif',
        './src/images/*.svg'
    ];

gulp.task('build-css', function(){
    gulp.src(main_css)
        .pipe(minifyCSS())
        .pipe(concat('combined.min.css'))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-js', function(){
    gulp.src('./src/js/*.js')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-img', function(){
    gulp.src(main_img)
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy-html', function(){
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch',function(){
    gulp.watch(main_css,['build-css']);
    gulp.watch(main_img,['copy-img']);
    gulp.watch('./src/js/*.js',['copy-js']);
    gulp.watch('./src/*.html',['copy-html']);
});

gulp.task('rebuild',function(){
    fs.emptyDir('./dist')
        .then(()=>{
            fs.copySync('./src/questions.min.json','./dist/questions.min.json');
            exec('gulp',(err, stdout, stderr)=>{
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        });
});

gulp.task('serve', function() {
  gulp.src('./dist')
    .pipe(webserver({port:80,open:true}));
});

gulp.task('default',['build-css','copy-js','copy-img','copy-html']);