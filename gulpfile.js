var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var notify = require('gulp-notify');
var responsive = require('gulp-responsive');
var argv = require('yargs').argv;
var exec = require('child_process').exec;



gulp.task('less', function() {

  // Use prefixes to get some basic ordering for LESS compilation
  var dir = './less/';

  return gulp.src([
    dir + 'reset.less',
    dir + 'main.less',
    dir + 'type.less',
  ]).pipe(concat('styles'))
    .pipe(less({strictMath: 'on'}))
    .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .on('error', notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest('./'));

});


gulp.task('default', ['less']);
gulp.watch('./assets/less/*.less', ['less']);
