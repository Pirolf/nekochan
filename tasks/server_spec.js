const gulp = require('gulp');
const webpack = require('webpack-stream');

const {jasmine, plumber, processEnv} = require('gulp-load-plugins')();

gulp.task('server-spec', specServer);
function serverAssets() {
  const testConfig = require('../config/webpack.test.config');
  return gulp.src(['spec/server/*.js'])
    .pipe(plumber())
    .pipe(webpack(testConfig))
    .pipe(gulp.dest('specs-build'));
}

function specServer(){
  const env = processEnv({NODE_ENV: 'test'});
  const stream = serverAssets()
    .pipe(env)
    .pipe(jasmine({includeStackTrace: true}));
  stream.pipe(env.restore());
  return stream;
}
