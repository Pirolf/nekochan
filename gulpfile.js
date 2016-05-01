require('babel-core/register');
require('babel-polyfill');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const del = require('del');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');

const clientWebpackConfig = require('./config/webpack.client.config');
const serverWebpackConfig = require('./config/webpack.server.config');

require('pui-react-tools').Lint.install();

gulp.task('buildClient', (done) => {
    buildClient();
    done();
});

gulp.task('buildServer', (done) => {
    buildServer();
    done();
});

gulp.task('build', ['clean', 'buildClient', 'buildServer'], (done) => {
    done();
});

function buildSpecs() {
    return gulp.src(['spec/*/*.js'])
    .pipe(webpack(clientWebpackConfig));
}

function buildClient() {
    return gulp.src(['assets/javascripts/*', 'assets/styles/*'])
    .pipe(webpack(clientWebpackConfig))
    .pipe(gulp.dest('public'));
}

function buildServer() {
    return gulp.src(['server/*'])
    .pipe(webpack(serverWebpackConfig))
    .pipe(gulp.dest('server-build'));
}

gulp.task('clean', (done) => {
  del(['public/', 'server-build'])
    .then(() => done(), done);
});

gulp.task('spec', (done) => {
    runSequence(['clean', 'buildServer', 'buildClient'], () => {
        buildSpecs()
        .pipe(jasmineBrowser.specRunner())
        .pipe(jasmineBrowser.server({port: 8888}));
        done();
    });
});