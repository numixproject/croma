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
        /* jshint evil: true */
        var fn;

        if (typeof template !== "string") {
            throw new Error("Template must be a string");
        }

        fn = this._cache[template] = this._cache[template] ||

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                         "var p=[],print=function(){p.push.apply(p,arguments);};" +

                         // Escape &, <, > and quotes to prevent XSS
                         // Convert new lines to <br> tags
                         "function tohtml(s){if(typeof s!=='string'){return '';}" +
                         "return s.replace(/&/g,'&#38').replace(/</g,'&#60;').replace(/>/g,'&#62;')" +
                         ".replace(/\"/g,'&#34').replace(/'/g,'&#39;').replace(/(?:\\r\\n|\\r|\\n)/g,'<br>');}" +

                         // Introduce the data as local variables using with(){}
                         "with(obj){p.push('" +

                         // Convert the template into pure JavaScript
                         template
                         .replace(/[\r\t\n]/g, " ")
                         .split("<%").join("\t")
                         .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                         .replace(/\t=(.*?)%>/g, "',tohtml($1),'")
                         .replace(/\t-(.*?)%>/g, "',$1,'")
                         .split("\t").join("');")
                         .split("%>").join("p.push('")
                         .split("\r").join("\\'") +

                         "');}return p.join('');");

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
