var gulp          = require('gulp');
var gutil         = require("gulp-util");
var cp            = require('child_process');
var browserSync   = require('browser-sync');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');

var config = {
    source: {
        path: './src',
        assets: './src/_assets',
    },
    destination: {
        path: './dist',
        assets: './dist/assets'
    }
};

/** BUILD TASKS */
gulp.task('sass:dev', ['jekyll'], function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('sass:prod', function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('jekyll', function(callback) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');

    cp.spawn('jekyll', [
        'build',
        '--source='+config.source.path,
        '--destination='+config.destination.path
    ], {stdio: 'inherit'}).on('exit', callback);
});

gulp.task('jekyll:rebuild', ['jekyll'], function() {
    browserSync.reload();
});

gulp.task('browser-sync', ['jekyll', 'assets:dev'], function() {
    browserSync({
        server: {
            baseDir: config.destination.path
        }
    });
});


/** CLI TASKS */
gulp.task('assets:dev', ['sass:dev'], function() {});
gulp.task('assets:prod', [], function() {});
gulp.task('serve', ['assets:dev', 'browser-sync']);
gulp.task('default', ['assets:prod']);
