'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var changed = require('gulp-changed');

// image optimizer & resize
var pngquant = require('imagemin-pngquant');
var optipng = require('imagemin-optipng');
var gifsicle = require('imagemin-gifsicle');
var jpegtran = require('imagemin-jpegtran');
var jpegoptim = require('imagemin-jpegoptim');
var imgResize = require('gulp-image-resize');

// code optimizers
var stripDebug = require('gulp-strip-debug');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var minifyJS = require('gulp-uglify');

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
    'minify_css',
    'compress_images',
    'create_thumbnail',
    'reduce_pizzeria_image'
    ,'watch' //optional, if you want Gulp to keep monitoring your folders
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

gulp.task('minify_css', function() {
    return gulp.src(SRC + '**/*.css', {base: SRC})
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest(DEST));
});

gulp.task('compress_images', function() {
    return gulp.src(SRC + '**/*.{jpg,jpeg,gif,png,svg}', {base: SRC})
    .pipe(gifsicle({interlaced: true})())
    .pipe(pngquant({quality: '50-60', speed: 1})())
    .pipe(optipng({optimizationLevel: 3})())
    .pipe(jpegoptim({max: 70})())
    .pipe(jpegtran({ progressive: true, optimize: true })())
    .pipe(gulp.dest(DEST));
});

gulp.task('create_thumbnail', ['compress_images'], function() {
    return gulp.src(SRC + '**/pizzeria.jpg', {base: SRC})
    .pipe(imgResize({ width : 100 }))
    .pipe(jpegoptim({max: 70})())
    .pipe(jpegtran({ progressive: true, optimize: true })())
    .pipe(rename({ extname: '-thumb.jpg' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('reduce_pizzeria_image', ['compress_images', 'create_thumbnail'], function() {
    return gulp.src(SRC + '**/pizzeria.jpg', {base: SRC})
    .pipe(imgResize({ width : 400 }))
    .pipe(jpegoptim({max: 70})())
    .pipe(jpegtran({ progressive: true, optimize: true })())
    .pipe(rename({ extname: '-small.jpg' }))
    .pipe(gulp.dest(DEST));
});

gulp.task('watch', function() {
    gulp.watch(SRC + '**/*.js',   ['minify_js']);
    gulp.watch(SRC + '**/*.html', ['minify_html']);
    gulp.watch(SRC + '**/*.css',  ['minify_css']);
    gulp.watch(SRC + '**/im*/*',  ['compress_images']);
 });
