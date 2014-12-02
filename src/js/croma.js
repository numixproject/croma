/* jshint browser: true */

var App = require("./app.js"),
    animations = require("./animations.js"),
    $appTitle = $("#app-title");

// App global variables
App.vars = {
    maxColors: 4,
    actionDone: false
};

// Set app title
App.setTitle = function(title) {
    if (typeof title !== "string") {
        return;
    }

    $appTitle.text(title);
};

// Handle URL opening in Firefox OS
if (!!("mozSetMessageHandler" in navigator)) {
    // Handle opening of URLs
    navigator.mozSetMessageHandler("activity", function(a) {
        var url = a.source.data.url,
            state = App.parseURL(url.replace(/^((https?:\/\/croma.numixproject.org)|(croma:\/\/))/, ""));

        App.trigger("navigate", state);
    });
}

// Add animations after route is rendered
App.Global.afterRender = function() {
    var cls = [ "fade-in", "scale-in" ],
        $this = $(this);

    // Add ripple animation
    animations.ripple($this.find(".fx-ripple"));

    // Animate elements
    cls.forEach(function(c) {
        $this.find(".fx-" + c).addClass(c);
    });
};

// Provide global actions
App.Global.actions = {
    goback: function() {
        if (App.oldState && App.oldState.route !==  App.currentState.route && !App.vars.actionDone) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                App.trigger("navigate", App.oldState);
            }

            App.vars.actionDone = false;
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
