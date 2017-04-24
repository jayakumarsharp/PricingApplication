var gulp= require('gulp');
 gutil = require('gulp-util');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
 gulp.task('default', function() {
  // return   gulp.src('./js/controllers/DaySheetController.js')
    // .pipe(concat('all.js'))
    // .pipe(gulp.dest('./dist/'));
	
	gulp.src('./js/controllers/DaySheetController.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
	.pipe(concat('all.js'))
    .pipe(gulp.dest('dist'))
});
