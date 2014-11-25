var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

var watching = false;
var coverage = true;

function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js', 'src/*.js', 'test/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function(cb) {
  gulp.src(['src/*.js'])
    .pipe(istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(['test/*_test.js'])
        .pipe(mocha().on('error', onError))
        .pipe(istanbul.writeReports()) // Creating the reports after tests run
        .on('end', cb);
    });
});

gulp.task('default', ['lint', 'test'], function() {
  gulp.watch(['src/*.js', 'test/*.js'], function() {
    watching = true;
    gulp.run('lint', 'test');
  });
});
