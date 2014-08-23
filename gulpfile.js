/* jshint node: true */

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    sass = require("gulp-ruby-sass"),
    jshint = require("gulp-jshint"),
    bower = require("main-bower-files"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    rimraf = require("gulp-rimraf");

gulp.task("sass", function() {
    return gulp.src("src/scss/*.scss")
    .pipe(sass({
        style: "compressed",
        sourcemapPath: "../scss"
    }))
    .on("error", function(e) { gutil.log(e.message); })
    .pipe(gulp.dest("dist/css"));
});

gulp.task("lint", function() {
    return gulp.src("src/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("libs", function() {
    return gulp.src(bower())
    .pipe(sourcemaps.init())
    .pipe(concat("libs.js"))
    .pipe(gutil.env === "production" ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("scripts", function() {
    return gulp.src("src/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(gutil.env === "production" ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("clean", function() {
    return gulp.src([
        "dist/css",
        "dist/js"
    ], { read: false })
    .pipe(rimraf())
    .on("error", gutil.log);
});

gulp.task("watch", function() {
    gulp.watch("src/js/*.js", [ "lint", "libs", "scripts" ]);
    gulp.watch("src/scss/*.scss", [ "sass" ]);
});

// Default Task
gulp.task("default", [ "lint", "sass", "libs", "scripts" ]);
