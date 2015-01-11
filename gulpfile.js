var gulp = require("gulp"),
    del = require("del"),
    bower = require("bower"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    bump = require("gulp-bump"),
    git = require("gulp-git"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    declare = require("gulp-declare"),
    jshint = require("gulp-jshint"),
    jscs = require("gulp-jscs"),
    uglify = require("gulp-uglify"),
    sass = require("gulp-sass"),
    combinemq = require("gulp-combine-mq"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    webserver = require("gulp-webserver"),
    opn = require("opn"),
    server = {
        host: "localhost",
        port: "8001"
    };

gulp.task("bower", function() {
    return bower.commands.install([], { save: true }, {})
    .on("error", gutil.log);
});

// Bump version and do a new release
gulp.task("bump", function() {
    return gulp.src([ "package.json", "bower.json", "manifest.webapp" ])
    .pipe(plumber())
    .pipe(bump())
    .pipe(gulp.dest("."));
});

gulp.task("release", [ "bump" ], function() {
    var version = require("./package.json").version,
        message = "Release " + version;

    return gulp.src([ "package.json", "bower.json", "manifest.webapp" ])
    .pipe(plumber())
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
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
    .pipe(jshint.reporter("fail"))
    .pipe(jscs());
});

gulp.task("libs", [ "bower" ], function() {
    return gulp.src([
        "bower_components/jquery/dist/jquery" + (gutil.env.production ? ".min" : "") + ".js",
        "bower_components/velocity/velocity" + (gutil.env.production ? ".min" : "") + ".js"
    ])
    .pipe(plumber())
    .pipe(concat("libs.js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("scripts", function() {
    return browserify({
        entries: "./src/js/croma.js",
        debug: true
    }).bundle()
    .on("error", function(err) {
        gutil.log(err);
        // End the stream to prevent gulp from crashing
        this.end();
    })
    .pipe(source("croma.js"))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("templates", function() {
    var microtemplate = require("./microtemplate.js");

    return gulp.src("src/templates/**/*.template")
    .pipe(plumber())
    .pipe(microtemplate("templates.js"))
    .pipe(declare({
        namespace: "$",
        noRedeclare: true
    }))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("styles", function() {
    return gulp.src("src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: "expanded",
        lineNumbers: !gutil.env.production,
        sourceMap: true
    }))
    .pipe(combinemq())
    .pipe(gutil.env.production ? autoprefixer() : gutil.noop())
    .pipe(gutil.env.production ? minifycss() : gutil.noop())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("clean", function() {
    return del([ "dist" ]);
});

gulp.task("watch", function() {
    gulp.watch("src/js/**/*.js", [ "lint", "libs", "scripts" ]);
    gulp.watch("src/scss/**/*.scss", [ "styles" ]);
    gulp.watch("src/templates/**/*.template", [ "templates" ]);
});

gulp.task("server", function() {
    return gulp.src(".")
    .pipe(webserver({
        host: server.host,
        port: server.port,
        livereload: true,
        directoryListing: false
    }));
});

// Default Task
gulp.task("default", [ "lint", "libs", "scripts", "styles", "templates" ]);

// Serve in a web browser
gulp.task("live", [ "default", "watch", "server" ], function() {
    opn("http://" + server.host + ":" + server.port);
});
