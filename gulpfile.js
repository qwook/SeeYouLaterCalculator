var bundleOut, gulp;

gulp = require('gulp');

bundleOut = function(b) {
  var source;
  source = require('vinyl-source-stream');
  return b.bundle()
  .on('end', function() {
    console.log('[' + (new Date()).toLocaleTimeString() + '] Compiled.')
  })
  .on('error', function(e) {
    return console.log(e.toString());
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./public/javascripts'));
};

gulp.task('watch', function() {
  var exposify = require('exposify');
  var watchify = require('watchify');
  var browserify = require('browserify');
  exposify.config = {
    'angular': 'angular'
  };
  var b = browserify({
    debug: true
  });
  b.transform('jadeify');
  b.transform('babelify');
  b.transform('exposify', {
    filePattern: /\.js$/
  });
  b = watchify(b);
  b.on('update', function() {
    return bundleOut(b);
  });
  b.add('./client/main.js');
  return bundleOut(b);
});

gulp.task('start', function() {
  var nodemon;
  nodemon = require('gulp-nodemon');
  return nodemon({
    verbose: true,
    ignore: [ 'client/*', 'public/*', './*.js' ],
    script: 'index.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  });
});

gulp.task('default', ['start'], function() {});