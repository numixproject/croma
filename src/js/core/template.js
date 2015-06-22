/**
 * @fileOverview Simple templating engine based on John Resig's micro-templating engine
 * @author Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license GPL-3.0+
 */

var Template = function() {
    this._cache = {};
};

Template.prototype = {
    compile: function(template) {
        /* eslint-disable no-new-func */
        var fn;

        if (typeof template !== "string") {
            throw new Error("Template must be a string");
        }

        fn = this._cache[template] = this._cache[template] ||

            // Generate a reusable function that will serve as a template generator
            // The data is passed as "model"
            new Function("model", (function() {
                            var parts = template.split(/<%|%>/),
                                body = "var t=[],printtext=function(){t.push.apply(t,arguments);};",
                                tohtml = function(s) {
                                    s = s + ""; // Convert argument to string

                                    // Escape &, <, > and quotes to prevent XSS
                                    // Convert new lines to <br> tags
                                    return s.replace(/&/g, "&#38")
                                            .replace(/</g, "&#60;").replace(/>/g, "&#62;")
                                            .replace(/"/g, "&#34").replace(/'/g, "&#39;")
                                            .replace(/(?:\\r\\n|\\r|\\n)/g, "<br>");
                                };

                            body += "var tohtml=" + tohtml.toString() + ";";

                            for (var i = 0, l = parts.length; i < l; i++) {
                                body += i % 2 ? (
                                    parts[i][0] === "=" ? "printtext(tohtml(" + parts[i].substr(1) + "));" :
                                    parts[i][0] === "-" ? "printtext(" + parts[i].substr(1) + ");" : parts[i]
                                ) : "t.push('" + parts[i].replace(/\n/g, "\\n\\\n").replace(/'/g, "\\'") + "');";

                                body += "\n";
                            }

                            body += ";return t.join('');";

                            return body;
                        }()));

        return fn;
    },

    render: function(template, data) {
        if (typeof template !== "string") {
            throw new Error("Template must be a string");
        }

        if (typeof data !== "object") {
            throw new Error("Data must be an object");
        }

        return this.compile(template)(data);
    }
};

if (typeof define === "function" && define.amd) {
    // Define as AMD module
    define(function() {
        return Template;
    });
} else if (typeof module !== "undefined" && module.exports) {
    // Export to CommonJS
    module.exports = Template;
} else {
    window.Template = Template;
}
