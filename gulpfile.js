/* jshint node: true */

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    sass = require("gulp-ruby-sass"),
    jshint = require("gulp-jshint"),
    bower = require("main-bower-files"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");

gulp.task("sass", function() {
    return gulp.src("assets/scss/*.scss")
    .pipe(sass({
        style: "compressed",
        sourcemap: true
    }))
    .on("error", function(e) { gutil.log(e.message); })
    .pipe(gulp.dest("dist/css"));
});

gulp.task("lint", function() {
    return gulp.src("assets/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("libs", function() {
    return gulp.src(bower())
    .pipe(sourcemaps.init())
    .pipe(concat("libs.js"))
    .pipe(gutil.env.type !== "dev" ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("scripts", function() {
    return gulp.src("assets/js/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(gutil.env.type !== "dev" ? uglify() : gutil.noop())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("watch", function() {
    gulp.watch("assets/js/*.js", [
        "lint",
        "concat",
        "scripts"
    ]);
    gulp.watch("assets/scss/*.scss", [ "sass" ]);
});

// Default Task
gulp.task("default", [
    "lint",
    "sass",
    "libs",
    "scripts"
]);
