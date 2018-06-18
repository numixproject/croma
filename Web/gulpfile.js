/* eslint-disable import/no-commonjs, no-mixed-requires, max-nested-callbacks, no-param-reassign */

'use strict';

const gulp = require('gulp');
const del = require('del');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const bump = require('gulp-bump');
const git = require('gulp-git');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const declare = require('gulp-declare');
const eslint = require('gulp-eslint');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const combinemq = require('gulp-combine-mq');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const browsersync = require('browser-sync');

const onerror = notify.onError('Error: <%= error.message %>');

// Make browserify bundle
function bundle(file, opts, cb) {
    let watcher;

    opts = opts || {};

    opts.entries = `./${file}`;
    opts.debug = typeof opts.debug === 'boolean' ? opts.debug : true;

    if (bundle.watch) {
        opts.cache = {};
        opts.packageCache = {};
        opts.fullPaths = true;
    }

    const bundler = browserify(opts);
    const base = file.split(/[\\/]/).pop();

    if (bundle.watch) {
        watcher = watchify(bundler);

        cb(
           watcher
            .on('update', () => {
                gutil.log(`Starting '${gutil.colors.yellow(file)}'...`);

                cb(
                   watcher.bundle()
                    .on('error', onerror)
                    .pipe(source(base))
                    .pipe(buffer())
                );
            })
            .on('time', time => {
                gutil.log(`Finished '${gutil.colors.yellow(file)}' after ${gutil.colors.magenta(time + ' ms')}`);
            })
            .bundle()
            .pipe(source(base))
            .pipe(buffer())
        );
    } else {
        cb(
           bundler.bundle()
            .on('error', function(error) {
                onerror(error);

                // End the stream to prevent gulp from crashing
                this.end();
            })
            .pipe(source(base))
            .pipe(buffer())
        );
    }
}

// Bump version and do a new release
gulp.task('bump', () => gulp.src([ 'package.json', 'manifest.webapp' ])
.pipe(plumber({ errorHandler: onerror }))
.pipe(bump())
.pipe(gulp.dest('.')));

gulp.task('release', [ 'bump' ], () => {
    const version = require('./package.json').version, message = `Release ${version}`;

    return gulp.src([ 'package.json', 'manifest.webapp' ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(git.add())
    .pipe(git.commit(message))
    .on('end', () => {
        git.tag(`v${version}`, message, () => {
            git.push('origin', 'master', { args: '--tags' }, () => {});
        });
    });
});

gulp.task('lint', () => gulp.src('src/js/**/*.js')
.pipe(plumber({ errorHandler: onerror }))
.pipe(eslint())
.pipe(eslint.format())
.pipe(eslint.failOnError()));

gulp.task('bundle', () => bundle('src/js/croma.js', {
    transform: [ babelify ]
}, bundled => {
    bundled
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'));
}));

gulp.task('scripts', [ 'bundle' ]);

gulp.task('scripts:watch', () => {
    bundle.watch = true;

    gulp.start('scripts');

    gulp.watch('src/js/**/*.js', [ 'lint' ]);
});

gulp.task('templates', () => {
    const microtemplate = require('./microtemplate.js');

    return gulp.src('src/templates/**/*.template')
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(microtemplate('templates.js'))
    .pipe(declare({
        namespace: 'APP',
        noRedeclare: true
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('templates:watch', () => {
    gulp.watch('src/templates/**/*.template', [ 'templates' ]);
});

gulp.task('styles', () => gulp.src('src/scss/**/*.scss')
.pipe(plumber({ errorHandler: onerror }))
.pipe(sourcemaps.init())
.pipe(sass())
.pipe(combinemq())
.pipe(gutil.env.production ? autoprefixer() : gutil.noop())
.pipe(gutil.env.production ? minifycss() : gutil.noop())
.pipe(rename({ suffix: '.min' }))
.pipe(sourcemaps.write('.'))
.pipe(gulp.dest('dist/css')));

gulp.task('styles:watch', () => {
    gulp.watch('src/scss/**/*.scss', [ 'styles' ]);
});

gulp.task('clean', () => del([ 'dist' ]));

gulp.task('watch', [ 'scripts:watch', 'styles:watch', 'templates:watch' ]);

// Synchronise file changes in browser
gulp.task('browsersync', () => {
    browsersync({
        server: { baseDir: './' }
    });
});

// Serve in a web browser
gulp.task('serve', [ 'browsersync', 'watch' ]);

// Build files
gulp.task('build', [ 'scripts', 'styles', 'templates' ]);

// Default Task
gulp.task('default', [ 'lint', 'clean' ], () => {
    gulp.start('build');
});
