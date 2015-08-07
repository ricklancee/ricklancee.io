var gulp        = require('gulp');
var gutil       = require("gulp-util");
var cp          = require('child_process');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var htmlmin     = require('gulp-html-minifier');

var config = {
    source: {
        path: './src',
        assets: './src/_assets',
    },
    destination: {
        path: './dist',
        assets: './dist/assets'
    },
    copyFiles: [
        './src/_assets/fonts/*/**'
    ]
};


/** ASSETS TASKS */
gulp.task('sass:dev', ['jekyll'], function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('sass:prod', ['jekyll'], function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('copy', ['jekyll'], function() {
    return gulp.src(config.copyFiles, {base: config.source.assets})
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(config.destination.assets));
});

gulp.task('imagemin', ['jekyll'], function() {
    return gulp.src(config.source.assets + '/images/{,*/}*.{jpg,jpeg,gif,png,svg}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(config.destination.assets + '/images'));
});

gulp.task('htmlmin', ['jekyll'], function() {
    gulp.src(config.destination.path + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.destination.path));
});

/** Jekyll tasks */
gulp.task('jekyll', function(callback) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');

    cp.spawn('jekyll', [
        'build',
        '--source='+config.source.path,
        '--destination='+config.destination.path
    ], {stdio: 'inherit'}).on('exit', callback);
});

gulp.task('browser-sync', ['jekyll', 'assets:dev'], function() {
    browserSync({
        server: {
            baseDir: config.destination.path
        }
    });
});

gulp.task('jekyll:rebuild', ['jekyll'], function() {
    browserSync.reload();
});

/** Watch tasks */
gulp.task('watch', function() {
    gulp.watch(config.source.assets + '/sass/{,*/}*.scss', ['sass:dev']);
    gulp.watch(config.copyFiles, ['copy']);
    gulp.watch(config.source.assets + '/images/{,*/}*.{jpg,jpeg,gif,png,svg}', ['imagemin']);
    gulp.watch(config.source.assets + '/**/*.{yml,md,html,xml}', ['jekyll:rebuild']);
});

/** CLI TASKS */
gulp.task('assets:dev', ['sass:dev', 'imagemin', 'copy']);
gulp.task('assets:prod', ['sass:prod', 'imagemin', 'copy', 'htmlmin']);
gulp.task('serve:prod', ['assets:prod', 'browser-sync']);
gulp.task('serve', ['assets:dev', 'browser-sync', 'watch']);
gulp.task('default', ['serve']);
gulp.task('production', ['assets:prod']);
