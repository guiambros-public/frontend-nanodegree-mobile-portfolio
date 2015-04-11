'use strict';

var gulp = require('gulp');
//var rename = require('gulp-rename');

var changed = require('gulp-changed');

// image optimizers
var optipng = require('imagemin-optipng');
var gifsicle = require('imagemin-gifsicle');
var jpegtran = require('imagemin-jpegtran');
var Imagemin = require('imagemin');

// image resize
var imgResize = require('gulp-image-resize');

// code optimizers
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var minifyJS = require('gulp-uglify');

// code linters
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// paths
var SRC = "src/";
var DEST = "prod/";

gulp.task('default',
    [
    'lint',
    'css',
    'js',
    'html',
    'imgResize',
    //'png',
    //'jpeg',
    //'gif'
    //,'watch'
    ],  function() {
    // nothing
});

gulp.task('lint', function() {
  return gulp.src(SRC + 'js/*.js')
    .pipe(jshint())
    //.pipe(jshint.reporter('default'));
    .pipe(jshint.reporter(stylish))

});

gulp.task('css', function() {
  return gulp.src(SRC + '**/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest(DEST));
});

gulp.task('js', function() {
    return gulp.src(SRC + '**/*.js', {base: SRC})
    .pipe(changed(DEST))
    .pipe(minifyJS())
    //.pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('html', function() {
    return gulp.src(SRC + '**/*.html', {base: SRC})
    .pipe(changed(DEST))
    .pipe(minifyHTML({
        conditionals: true,
        spare:true }))
    .pipe(gulp.dest(DEST));
});

gulp.task('jpgs', function() {
    return gulp.src('**/*.{gif,jpg,png,svg}')
    .pipe(imagemin({ progressive: true }))
    .pipe(gulp.dest(DEST));
});


gulp.task('imgResize', function () {
  gulp.src(SRC + 'views/images/pizzeria.jpg')
    .pipe(imgResize({
        width : 100,
        height : 100,
        crop : true,
        upscale : false
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('png', function() {
    return gulp.src(SRC + '**/*.png', {base: SRC})
    .pipe(changed(DEST))
    .pipe(optipng({optimizationLevel: 3})())
    .pipe(gulp.dest(DEST));
});

gulp.task('jpeg', function() {
    return gulp.src(SRC + '**/*.{jpg,jpeg}', {base: SRC})
    .pipe(changed(DEST))
    .pipe(jpegtran({progressive: true})())
    .pipe(gulp.dest(DEST));
});

gulp.task('gif', function() {
    return gulp.src(SRC + '**/*.gif', {base: SRC})
    .pipe(changed(DEST))
    .pipe(gifsicle({interlaced: true})())
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', function() {
    gulp.watch(SRC + '**/*.js', ['js']);
    gulp.watch(SRC + '**/*.html', ['html']);
    gulp.watch(SRC + '**/i*/*', ['png', 'svg', 'jpeg', 'gif']);
 });
