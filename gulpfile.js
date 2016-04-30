require('babel-core/register');
require('babel-polyfill');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const del = require('del');
const gulp = require('gulp');
const jasmineBrowser = require('gulp-jasmine-browser');
const runSequence = require('run-sequence');
const webpack = require('webpack-stream');
const webpackConfig = require('./config/webpack.config');

require('pui-react-tools').Lint.install();

gulp.task('build', ['clean'], (done) => {
    build();
    done();
});

function sourceFiles() {
    const src = ['assets/javascripts/*', 'assets/styles/*', 'config/*.js', 'server/*.js'];
    return process.env.NODE_ENV == 'production' ? src : src.concat(['spec/*/*.js']);
}

function build() {
    return gulp.src(sourceFiles())
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