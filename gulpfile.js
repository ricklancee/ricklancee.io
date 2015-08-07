var gulp        = require('gulp');
var gutil       = require("gulp-util");
var cp          = require('child_process');
var browserSync = require('browser-sync');
var webpack     = require("webpack");

var config = {
    source: 'src',
    destination: 'dist'
};

gulp.task('webpack', function() {
    webpack({
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
})

gulp.task('jekyll', function(cb) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');

    cp.spawn('jekyll', [
        'build',
        '--source='+config.source,
        '--destination='+config.destination
    ], {stdio: 'inherit'}).on('exit', cb);
});

gulp.task('jekyll:rebuild', ['jekyll'], function() {
    browserSync.reload();
});

gulp.task('browser-sync', ['jekyll'], function() {
    browserSync({
        server: {
            baseDir: config.source
        }
    });
});

gulp.task('serve', ['browser-sync']);
gulp.task('default', ['jekyll']);
