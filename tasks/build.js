const del = require('del');
const gulp = require('gulp');
const webpack = require('webpack-stream');

const clientWebpackConfig = require('../config/webpack.client.config');
const serverWebpackConfig = require('../config/webpack.server.config');

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
