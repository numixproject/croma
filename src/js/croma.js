/* jshint browser: true */

var App = require("./app.js"),
    ripple = require("./ripple.js"),
    $appTitle = $("#app-title");

// App global variables
App.vars = {
    maxColors: 4,
    actionDone: false
};

App.setTitle = function(title) {
    if (typeof title !== "string") {
        return;
    }

    $appTitle.text(title);
};

// Add animations after route is rendered
App.Global.afterRender = function() {
    var cls = [ "animate-in", "fade-in", "scale-in" ];

    // Add ripple animation
    ripple(".fx-ripple");

    // Animate elements
    cls.forEach(function(c) {
        $(".fx-" + c).addClass(c);
    });
};

// Provide global actions
App.Global.actions = {
    goback: function() {
        if (window.history.length > 1 && !App.vars.actionDone) {
            window.history.back();
        } else if (App.oldState && App.oldState.route && !App.vars.actionDone) {
            App.trigger("navigate", App.oldState);
        } else {
            App.trigger("navigate", { route: "index" });
        }
    }
};

// Add the routes
App.registerRoutes([
    "palette/new",
    "palette/list",
    "palette/name",
    "palette/show",
    "colors",
    "picker",
    "details",
    "palettes"
]);

// Include components
require("./components/index.js");
require("./components/colors.js");
require("./components/details.js");
require("./components/palettes.js");
require("./components/picker.js");
require("./components/palette-new.js");
require("./components/palette-name.js");
require("./components/palette-list.js");
require("./components/palette-show.js");
