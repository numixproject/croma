var gulp = require("gulp"),
    del = require("del"),
    bower = require("bower"),
    browserify = require("browserify"),
    source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    plumber = require("gulp-plumber"),
    gutil = require("gulp-util"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    templates = require("gulp-ember-templates"),
    sass = require("gulp-ruby-sass"),
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

gulp.task("lint", function() {
    return gulp.src("src/js/**/*.js")
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("templates", function() {
    gulp.src([ "src/templates/**/*.hbs" ])
    .pipe(plumber())
    .pipe(templates())
    .pipe(concat("templates.js"))
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
});

gulp.task("libs", [ "bower" ], function() {
    return gulp.src([
        "bower_components/jquery/dist/jquery" + (gutil.env.production ? ".min" : "") + ".js",
        "bower_components/handlebars/handlebars" + (gutil.env.production ? ".min" : "") + ".js",
        "bower_components/ember/ember" + (gutil.env.production ? ".min" : "") + ".js",
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
        entries: "./src/js/app.js",
        debug: !gutil.env.production
    }).bundle()
    .pipe(source("app.js"))
    .pipe(buffer())
    .pipe(plumber())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"))
    .on("error", gutil.log);
});

gulp.task("sass", function() {
    return gulp.src("src/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({
        style: gutil.env.production ? "compressed" : "expanded",
        sourcemapPath: "../../src/scss"
    }))
    .on("error", function(e) { gutil.log(e.message); })
    .pipe(gulp.dest("dist/css"));
});

gulp.task("clean", function() {
    return del([ "dist" ]);
});

gulp.task("watch", function() {
    gulp.watch("src/templates/**/*.hbs", [ "templates" ]);
    gulp.watch("src/js/**/*.js", [ "lint", "libs", "scripts" ]);
    gulp.watch("src/scss/**/*.scss", [ "sass" ]);
});

gulp.task("webserver", function() {
    return gulp.src(".")
    .pipe(webserver({
        host: server.host,
        port: server.port,
        livereload: true,
        directoryListing: false
    }));
});

// Default Task
gulp.task("default", [ "lint", "sass", "libs", "scripts", "templates" ]);

// Serve in a web browser
gulp.task("live", [ "default", "watch", "webserver" ], function() {
    opn("http://" + server.host + ":" + server.port);
});
