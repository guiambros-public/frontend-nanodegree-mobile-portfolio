'use strict';

var gulp = require('gulp');
//var rename = require('gulp-rename');

var changed = require('gulp-changed');

// image optimizer & resize
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var gifsicle = require('imagemin-gifsicle');
var jpegtran = require('imagemin-jpegtran');

// code optimizers
var stripDebug = require('gulp-strip-debug');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var minifyJS = require('gulp-uglify');
var gzip = require('gulp-gzip');

// code linters
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// paths
var SRC = "src/";
var DEST = "dist/";

gulp.task('default',
    [
    'lint',
    'minify_js',
    'minify_html',
    'compress_css',
    'compress_jpeg',
    'compress_png',
    'compress_gif'
    //,'watch'
    ],  function() {
    // nothing
});

gulp.task('lint', function() {
  return gulp.src(SRC + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))

});

gulp.task('minify_js', function() {
    return gulp.src(SRC + '**/*.js', {base: SRC})
    .pipe(changed(DEST))
    .pipe(minifyJS())
    .pipe(stripDebug())
    .pipe(gulp.dest(DEST));
});

gulp.task('minify_html', function() {
    return gulp.src(SRC + '**/*.html', {base: SRC})
    .pipe(changed(DEST))
    .pipe(minifyHTML({
        conditionals: true,
        spare:true }))
    .pipe(gulp.dest(DEST));
});

gulp.task('compress_css', function() {
    return gulp.src(SRC + '**/*.css', {base: SRC})
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gzip())
    .pipe(gulp.dest(DEST));
});

gulp.task('compress_jpeg', function() {
    return gulp.src(SRC + '**/*.jpg', {base: SRC})
    .pipe(jpegtran({ progressive: true,
                     optimize: true })())
    .pipe(gulp.dest(DEST));
});

gulp.task('compress_png', function() {
    return gulp.src(SRC + '**/*.png', {base: SRC})
    .pipe(changed(DEST))
    .pipe(optipng({optimizationLevel: 3})())
    .pipe(gulp.dest(DEST));
});

gulp.task('compress_gif', function() {
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
