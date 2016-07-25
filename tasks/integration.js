const gulp = require('gulp');
const {execSync, exec, spawn} = require('child_process');
const {jasmine, plumber, processEnv} = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const testConfig = require('../config/webpack.test.config');
const fs = require('fs');
const path = require('path');
const projectRoot = "/Users/pirolf/Projects/nekochan";
const pidfile = `${projectRoot}/pids/mongod-test.pid`;
const Promise = require('es6-promise').Promise;
const pm2 = require('pm2');

gulp.task('spec-integration', (cb) => {
  runSequence('run-integration', ['cleanup-integration'], cb)
});

gulp.task('run-integration', integration);
gulp.task('cleanup-integration', cleanup);

function integration() {
  const tmpPath = fs.mkdtempSync(`/tmp${path.sep}`);
  const dataPath = `${tmpPath}/mongod`;
  const logsPath = `${tmpPath}/logs`;

  fs.mkdirSync(dataPath);
  fs.mkdirSync(logsPath);
  console.log(`creating test db: ${tmpPath}`);

  const mongod = spawn('mongod', [
    `--dbpath=${dataPath}`,
    '--port=28017',
    `--pidfilepath=${pidfile}`,
    '--fork',
    `--logpath=${logsPath}/mongod-test.log`
  ]);

  mongod.stdout.on('data', (stdout) => {
    console.log(`stdout: ${stdout}`);
  })
  mongod.stderr.on('data', (stderr) => {
    console.log(`stderr: ${stderr}`);
  })

  return new Promise((resolve, reject) => {
    mongod.on('close', (code) => {
      console.log('mongod exited with ' + code);
      const restoreEnv = process.env;
      process.env = { ...process.env, NODE_ENV: 'test', PORT: 4000 }

      pm2.connect((err) => {
        if (err) {
          reject(err);
          process.exit(2);
          return;
        }
        process.on('message', (msg) => {
          console.log("message: ", msg)
        })
        pm2.start({
          script: '/usr/local/bin/npm',
          name: 'integration-test',
          force: true,
          args: ['start']
        }, (err, apps) => {
          pm2.disconnect();
          process.env = restoreEnv;
          if (err) {
            reject(err);
            return;
          }
          setTimeout(() => {
            const env = processEnv({NODE_ENV: 'test', PORT: 4000});
            const stream = gulp.src(['spec/integration/*.js'])
              .pipe(plumber())
              .pipe(webpack(testConfig))
              .pipe(gulp.dest('specs-build'))
              .pipe(env)
              .pipe(jasmine({includeStackTrace: true}))
            stream.pipe(env.restore());

            stream.on('end', () => {
              resolve(stream);
            })
          }, 2000);
        });
      });
    });
  });
}

function cleanup() {
  const pid = fs.readFileSync(pidfile)

  process.kill(pid);
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
    })
  })
}
