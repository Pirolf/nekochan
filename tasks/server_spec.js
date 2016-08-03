const gulp = require('gulp');
const webpack = require('webpack-stream');
const helper = require('./helper');

const {jasmine, plumber, processEnv} = require('gulp-load-plugins')();

gulp.task('server-spec', specServer);

function serverAssets() {
  const testConfig = require('../config/webpack.test.config');
  return gulp.src(['spec/spec_helper.js', 'spec/server/*.js', 'spec/server/*/*.js'])
    .pipe(plumber())
    .pipe(webpack(testConfig))
    .pipe(gulp.dest('specs-build'));
}

function specServer(done){
  return new Promise((resolve, reject) => {
    helper.startMongo((code) => {
      console.log('mongod exited with ' + code);

      const env = processEnv({NODE_ENV: 'test'});
      const stream = serverAssets()
        .pipe(env)
        .pipe(jasmine({includeStackTrace: true}));
      stream.pipe(env.restore());

      stream.on('end', () => {
        console.log("killing mongo")
        helper.killMongo();
        resolve(stream);
      });
    });
  })
}
