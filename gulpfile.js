var gulp          = require('gulp');
var gutil         = require("gulp-util");
var cp            = require('child_process');
var browserSync   = require('browser-sync');
var webpack       = require("webpack");
var webpackConfig = require('./webpack.config.js');

var config = {
    source: 'src',
    destination: 'dist'
};

function spawnWebpack(cli, callback) {
    cp.spawn('webpack', cli, {stdio: 'inherit'}).on('done', callback);
}

gulp.task('webpack:dev', ['jekyll'], function(callback) {
    spawnWebpack(['--debug', '--devtool', 'inline-source-map', '--output-pathinfo'], callback);
});

gulp.task('webpack:prod', ['jekyll'], function(callback) {
    spawnWebpack(['-p'], callback);
});

gulp.task('jekyll', function(callback) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');

    cp.spawn('jekyll', [
        'build',
        '--source='+config.source,
        '--destination='+config.destination
    ], {stdio: 'inherit'}).on('exit', callback);
});

gulp.task('jekyll:rebuild', ['jekyll'], function() {
    browserSync.reload();
});

gulp.task('browser-sync', ['jekyll'], function() {
    browserSync({
        server: {
            baseDir: config.destination
        }
    });
});

gulp.task('serve', ['webpack:dev', 'browser-sync']);
gulp.task('default', ['webpack:prod']);
