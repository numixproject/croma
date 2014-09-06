/* jshint node: true */

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require('vinyl-buffer'),
    rename = require("gulp-rename"),
    rimraf = require("gulp-rimraf"),
    concat = require("gulp-concat"),
    sourcemaps = require("gulp-sourcemaps"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    handlebars = require("gulp-ember-handlebars"),
    sass = require("gulp-ruby-sass");

gulp.task("lint", function() {
    return gulp.src("src/js/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("templates", function() {
    gulp.src([ "src/templates/**/*.hbs" ])
    .pipe(handlebars({
        outputType: "browser",
        namespace: "Ember.TEMPLATES"
    }))
    .pipe(concat("templates.js"))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("libs", function() {
    return gulp.src([
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/handlebars/handlebars.min.js",
        "bower_components/ember/ember.min.js",
        "bower_components/ember-animate/ember-animate.js",
        "bower_components/velocity/velocity.min.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(concat("libs.js"))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("scripts", function() {
    return browserify({
        entries: "./src/js/app.js",
        debug: !gutil.env.production
    }).bundle()
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("sass", function() {
    return gulp.src("src/scss/**/*.scss")
    .pipe(sass({
        style: "compressed",
        sourcemapPath: "../scss"
    }))
    .on("error", function(e) { gutil.log(e.message); })
    .pipe(gulp.dest("dist/css"));
});

gulp.task("clean", function() {
    return gulp.src([ "dist" ], { read: false })
    .pipe(rimraf())
    .on("error", gutil.log);
});

gulp.task("watch", function() {
    gulp.watch("src/templates/**/*.hbs", [ "templates" ]);
    gulp.watch("src/js/**/*.js", [ "lint", "libs", "scripts" ]);
    gulp.watch("src/scss/**/*.scss", [ "sass" ]);
});

// Default Task
gulp.task("default", [ "lint", "sass", "libs", "scripts", "templates" ]);
