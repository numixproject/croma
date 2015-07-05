var gulp = require("gulp"),
    del = require("del"),
    bower = require("bower"),
    browserify = require("browserify"),
    watchify = require("watchify"),
    babelify = require("babelify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    bump = require("gulp-bump"),
    git = require("gulp-git"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    declare = require("gulp-declare"),
    eslint = require("gulp-eslint"),
    jscs = require("gulp-jscs"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    combinemq = require("gulp-combine-mq"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    browsersync = require("browser-sync"),
    onerror = notify.onError("Error: <%= error.message %>");

// Make browserify bundle
function bundle(file, opts, cb) {
    var base, bundler, watcher;

    opts = opts || {};

    opts.entries = "./" + file;
    opts.debug = typeof opts.debug === "boolean" ? opts.debug : true;

    if (bundle.watch) {
        opts.cache = {};
        opts.packageCache = {};
        opts.fullPaths = true;
    }

    bundler = browserify(opts);

    base = file.split(/[\\/]/).pop();

    if (bundle.watch) {
        watcher  = watchify(bundler);

        cb(
           watcher
            .on("update", function() {
                gutil.log("Starting '" + gutil.colors.yellow(file) + "'...");

                cb(
                   watcher.bundle()
                    .on("error", onerror)
                    .pipe(source(base))
                    .pipe(buffer())
                );
            })
            .on("time", function(time) {
                gutil.log("Finished '" + gutil.colors.yellow(file) + "' after " + gutil.colors.magenta(time + " ms"));
            })
            .bundle()
            .pipe(source(base))
            .pipe(buffer())
        );
    } else {
        cb(
           bundler.bundle()
            .on("error", function(error) {
                onerror(error);

                // End the stream to prevent gulp from crashing
                this.end();
            })
            .pipe(source(base))
            .pipe(buffer())
        );
    }
}

gulp.task("bower", function() {
    return bower.commands.install([], { save: true }, {})
    .on("error", onerror);
});

// Bump version and do a new release
gulp.task("bump", function() {
    return gulp.src([ "package.json", "bower.json", "manifest.webapp" ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(bump())
    .pipe(gulp.dest("."));
});

gulp.task("release", [ "bump" ], function() {
    var version = require("./package.json").version,
        message = "Release " + version;

    return gulp.src([ "package.json", "bower.json", "manifest.webapp" ])
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(git.add())
    .pipe(git.commit(message))
    .on("end", function() {
        git.tag("v" + version, message, function() {
            git.push("origin", "master", { args: "--tags" }, function() {});
        });
    });
});

gulp.task("lint", function() {
    return gulp.src("src/js/**/*.js")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(jscs());
});

gulp.task("bundle", function() {
    return bundle("src/js/croma.js", {
        transform: [ babelify ]
    }, function(bundled) {
        bundled
        .pipe(plumber({ errorHandler: onerror }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gutil.env.production ? uglify() : gutil.noop())
        .pipe(rename({ suffix: ".min" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist/js"));
    });
});

gulp.task("scripts", [ "bundle" ]);

gulp.task("scripts:watch", function() {
    bundle.watch = true;

    gulp.start("scripts");

    gulp.watch("src/js/**/*.js", [ "lint" ]);
});

gulp.task("templates", function() {
    var microtemplate = require("./microtemplate.js");

    return gulp.src("src/templates/**/*.template")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(microtemplate("templates.js"))
    .pipe(declare({
        namespace: "APP",
        noRedeclare: true
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("templates:watch", function() {
    gulp.watch("src/templates/**/*.template", [ "templates" ]);
});

gulp.task("styles", function() {
    return gulp.src("src/scss/**/*.scss")
    .pipe(plumber({ errorHandler: onerror }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(combinemq())
    .pipe(gutil.env.production ? autoprefixer() : gutil.noop())
    .pipe(gutil.env.production ? minifycss() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("styles:watch", function() {
    gulp.watch("src/scss/**/*.scss", [ "styles" ]);
});

gulp.task("clean", function() {
    return del([ "dist" ]);
});

gulp.task("watch", [ "scripts:watch", "styles:watch", "templates:watch" ]);

// Synchronise file changes in browser
gulp.task("browsersync", function() {
    browsersync({
        server: { baseDir: "./" }
    });
});

// Serve in a web browser
gulp.task("serve", [ "browsersync", "watch" ]);

// Build files
gulp.task("build", [ "scripts", "styles", "templates" ]);

// Default Task
gulp.task("default", [ "lint", "clean" ], function() {
    gulp.start("build");
});
