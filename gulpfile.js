var gulp        = require('gulp');

var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync').create();



gulp.task('browser-sync', function (event) {
  var files = [
    './src/**/*.js'
  ];

  browserSync.init(files, {
    server: {
      baseDir: "./"
    }
  });

})

gulp.task('build', function () {
  // index.js is your main JS file with all your module inclusions
  return browserify({entries: './src/index.js', debug: true}).on('error', logError)
    .transform("babelify", { presets: ["es2015"] }).on('error', logError)
    .bundle().on('error', logError)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    // .pipe(uglify())
    .pipe(sourcemaps.write('./src/'))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', ['build'], function () {
  gulp.watch('./src/index.js', ['build']);
});

gulp.task('default', [
  'browser-sync',
  'watch'
])





logError = function(error) {
  var err = formatError(error)

  // Logging
  gutil.log( gutil.colors.bgRed(' ERROR '), gutil.colors.bgBlue( ' ' + err.plugin + ' ' ), gutil.colors.black.bgWhite( ' ' + err.message + ' ' ) )
  gutil.beep()

  if ( this.emit ) {
    this.emit('end')
  }

  function formatError(obj) {

    var obj     = obj || {},
      msg     = obj.message || obj[0],
      plugin  = obj.plugin || null

    // clean up
    msg = msg.replace('error ', '')

    return {
      message: msg,
      plugin : plugin
    }

  }
}
