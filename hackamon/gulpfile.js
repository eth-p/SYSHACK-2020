#!/usr/bin/env node
const gulp = require('gulp');
const raster = require('gulp-raster');
const rename = require('gulp-rename');

gulp.task('svg', function () {
	return gulp.src('./*/*.svg')
		.pipe(raster())
		.pipe(rename({dirname: 'assets/hackamon', extname: '.png'}))
		.pipe(gulp.dest('./dist'))
});

gulp.task('default', gulp.series('svg'));
