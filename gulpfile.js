/*jslint node: true */

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var gulp   = require('gulp');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

var watching = false;

function onError(err) {
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

var getBundleName = function () {
  var name = require('./package.json').name;
  return name;
};

gulp.task('bundle', function() {

  var bundler = browserify({
    entries: ['./src/index.js'],
    debug: true,
    standalone: getBundleName()
  });

  var bundle = function() {
    return bundler
      .bundle()
      .pipe(source(getBundleName() + '.min.js'))
      .pipe(buffer())
      .pipe(uglify())
      .pipe(gulp.dest('./dist/'));
  };

  return bundle();
});

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

gulp.task('watch', function() {
  gulp.watch(['src/*.js', 'test/*.js'], function() {
    watching = true;
    gulp.run('lint', 'test');
  });
});

gulp.task('default', ['lint', 'test', 'watch']);
gulp.task('build', ['lint', 'test', 'bundle']);
