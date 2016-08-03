const gulp = require('gulp');
const webpack = require('webpack-stream');
const {plumber, processEnv} = require('gulp-load-plugins')();
const jasmineBrowser = require('gulp-jasmine-browser');

gulp.task('app-spec', specApp);

function appAssets(plugins) {
  const config = require('../config/webpack.client.config');
  const webpackConfig = Object.assign({}, config, {watch: true}, {plugins: (config.plugins || []).concat(plugins)});

  return gulp.src(['spec/spec_helper.js', 'spec/app/*.js'])
    .pipe(plumber())
    .pipe(webpack(webpackConfig));
}

function specApp() {
  const JasminePlugin = require('gulp-jasmine-browser/webpack/jasmine-plugin');
  const plugin = new JasminePlugin();
  const env = processEnv({NODE_ENV: 'test'});

  const stream = appAssets([plugin])
    .pipe(env)
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({whenReady: plugin.whenReady}));

  stream.pipe(env.restore());
  return stream;
}
