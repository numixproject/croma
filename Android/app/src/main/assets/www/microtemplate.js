var PLUGIN_NAME = "gulp-microtemplate",
    Template = require("./src/js/core/template.js"),
    through = require("through"),
    path = require("path"),
    gutil = require("gulp-util");

module.exports = function(filename) {
    var firstfile,
        contents = "",
        template = new Template();

    if (!filename) {
        throw new gutil.PluginError(PLUGIN_NAME, "Missing filename argument");
    }

    return through(function(file) {
        if (file.isNull()) {
            return;
        }

        if (file.isStream()) {
            throw new gutil.PluginError(PLUGIN_NAME, "Streaming not supported");
        }

        firstfile = firstfile || file;

        try {
            contents += (contents ? ",\n" : "") + "'" + file.relative.replace(/(\.template)$/, "") + "': " + template.compile(file.contents.toString());
        } catch (err) {
            throw new gutil.PluginError(PLUGIN_NAME, err);
        }
    }, function() {
        var compiled = firstfile.clone({ contents: false });

        compiled.path = path.join(firstfile.base, filename);
        compiled.contents = new Buffer("{" + contents + "};");

        this.emit("data", compiled);
        this.emit("end");
    });
};
