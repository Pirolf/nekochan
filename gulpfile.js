require('babel-core/register');
require('babel-polyfill');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const del = require('del');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const webpackConfig = require('./config/webpack.config');
const tools = require('pui-react-tools');

const Lint = tools.Lint;
Lint.install();

function build() {
    return gulp.src(['assets/javascripts/*', 'assets/styles/*', 'config/*.js', 'server/*.js', 'spec/*/*.js'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'));
}

gulp.task('clean', (done) => {
  del(['dist/'])
    .then(() => done(), done);
});

gulp.task('spec', (done) => {
    runSequence(['clean'], () => {
        build()
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 8888}));
        done();
    });
});