var gulp        = require('gulp');
var gutil       = require("gulp-util");
var cp          = require('child_process');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var htmlmin     = require('gulp-html-minifier');
var rev         = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');

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
        './src/_assets/images/*/**'
    ]
};


/** ASSETS TASKS */
gulp.task('sass:dev', function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('sass:prod', function() {
    return gulp.src(config.source.assets + '/sass/{,*/}*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(config.destination.assets + '/css'));
});

gulp.task('copy', function() {
    if (!config.copyFiles.length)
        return false;

    return gulp.src(config.copyFiles, {base: config.source.assets})
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(config.destination.assets));
});

gulp.task('htmlmin', ['jekyll'], function() {
    return gulp.src(config.destination.path + '/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.destination.path));
});

gulp.task('rev', ['assets:prod'], function() {
    return gulp.src(config.destination.assets + '/{css,images}/{,*/}*', {base: config.destination.assets})
        .pipe(rev())
        .pipe(gulp.dest(config.destination.assets))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.destination.assets));
});

gulp.task('rev:replace', ['rev'], function() {
    var manifest = gulp.src(config.destination.assets + "/rev-manifest.json");

    return gulp.src(config.destination.path + "/**")
        .pipe(revReplace({manifest: manifest}))
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

function startBrowserSync() {
    browserSync({
        server: {
            baseDir: config.destination.path
        }
    });
}

gulp.task('browser-sync:dev', ['jekyll', 'assets:dev'], startBrowserSync);
gulp.task('browser-sync:prod', ['jekyll', 'assets:prod'], startBrowserSync);

gulp.task('jekyll:rebuild', ['jekyll'], function() {
    browserSync.reload();
});

/** Watch tasks */
gulp.task('watch', function() {
    gulp.watch(config.source.assets + '/sass/{,*/}*.scss', ['sass:dev']);
    gulp.watch(config.copyFiles, ['copy']);
    gulp.watch(config.source + '/**/*.{yml,md,html,xml}', ['assets:dev', 'jekyll:rebuild']);
});

/** CLI TASKS */
gulp.task('default', ['serve']);
gulp.task('serve', ['build', 'browser-sync:dev', 'watch']);
gulp.task('serve:prod', ['build:production', 'browser-sync:prod']);
gulp.task('build', ['jekyll'], function() {
    gulp.run('assets:dev');
});
gulp.task('build:production', ['assets:prod', 'rev', 'rev:replace']);
gulp.task('assets:dev', ['sass:dev', 'copy']);
gulp.task('assets:prod', ['sass:prod', 'copy', 'htmlmin']);
