const gulp = require('gulp');
const {jasmine, plumber, processEnv} = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const testConfig = require('../config/webpack.test.config');
const pm2 = require('pm2');
const helper = require('./helper');

gulp.task('spec-integration', (cb) => {
  runSequence('run-integration', ['cleanup-integration'], cb);
});

gulp.task('run-integration', integration);
gulp.task('cleanup-integration', cleanup);

function integration() {
  return new Promise((resolve, reject) => {
    helper.startMongo((code) => {
      console.log('mongod exited with ' + code);
      const restoreEnv = process.env;
      process.env = { ...process.env, NODE_ENV: 'test', PORT: 4000 };

      pm2.connect((err) => {
        if (err) {
          reject(err);
          process.exit(2);
          return;
        }

        pm2.start({
          script: '/usr/local/bin/npm',
          name: 'integration-test',
          force: true,
          args: ['start']
        }, (err, apps) => {
          pm2.disconnect();
          process.env = restoreEnv;
          if (err) return reject(err);

          setTimeout(() => {
            const env = processEnv({NODE_ENV: 'test', PORT: 4000});
            const stream = gulp.src(['spec/integration/*.js'])
              .pipe(plumber())
              .pipe(webpack(testConfig))
              .pipe(gulp.dest('specs-build'))
              .pipe(env)
              .pipe(jasmine({includeStackTrace: true}));
            stream.pipe(env.restore());

            stream.on('end', () => {
              resolve(stream);
            });
            stream.on('error', (error) => {
              reject({error})
            });
          }, 2000);
        });
      });
    });
  });
}

function cleanup() {
  helper.killMongo();

  pm2.connect((err) => {
    if (err) {
      console.log(err);
      return;
    }
    pm2.delete('integration-test', (err) => {
      pm2.disconnect();
      if (err) {
        console.log(err);
        return;
      }
    });
  });
}
