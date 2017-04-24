var gulp= require('gulp');
var concat = require('gulp-concat');
 
gulp.task('scripts', function() {
  return gulp.src('./js/controllers/*.js')
    .pipe(concat('appfiles.js'))
    .pipe(gulp.dest('./dist/Appfiles/'));
  
});
  