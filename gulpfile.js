/* jshint node: true */

var gulp = require("gulp"),
    sass = require("gulp-ruby-sass"),
    jshint = require("gulp-jshint"),
    bower = require("main-bower-files"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename");

gulp.task("sass", function() {
    return gulp.src("assets/scss/*.scss")
    .pipe(sass({ style: "compressed" }))
    .on("error", function(e) { console.log(e.message); })
    .pipe(gulp.dest("dist/css"));
});

gulp.task("lint", function() {
    return gulp.src("assets/js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

gulp.task("bower", function() {
    return gulp.src(bower())
    .pipe(concat("libs.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

gulp.task("scripts", function() {
    return gulp.src("assets/js/*.js")
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest("dist/js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
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
    "bower",
    "scripts"
]);
