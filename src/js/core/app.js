/* jshint browser: true, evil: true */
/* global $ */

var Events = require("./events.js"),
    App = new Events();

App.currentState = {}; // Store the current state
App.oldState = {}; // The previous state belongs here

// Add an outlet for the app
// Only this part is updated on render
App.Outlet = $("#app-outlet");

// We have base methods which are inherited by every route
// This should never be overwritten
App._super = {
    model: function() {},
    afterModel: function() {},
    render: function(state, model) {
        return App.renderTemplate(App.getTemplate(state.route), { model: model });
    },
    afterRender: function() {},
    actions: {
        goback: window.history.back
    },
    tags: []
};

// Provides a way to add custom overrides
App.Global = $.extend(true, {}, App._super);

// Get the template for the specified route
App.getTemplate = (function() {
    var cache = {};

    return function(route) {
        var template = cache[route] = cache[route] || App[App.formatRoute(route)].template || $("[data-template=" + route + "]").html();

        return template;
    };
}());

// Simple templating engine based on John Resig's micro-templating engine
App.renderTemplate = (function() {
    var cache = {};

    function render(string, data) {
        var fn;

        if (typeof string !== "string") {
            throw new Error("A string must be passed to the template engine");
        }

        fn = cache[string] = cache[string] ||

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
                     string
                     .replace(/[\r\t\n]/g, " ")
                     .split("<%").join("\t")
                     .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                     .replace(/\t=(.*?)%>/g, "',tohtml($1),'")
                     .split("\t").join("');")
                     .split("%>").join("p.push('")
                     .split("\r").join("\\'") +

                     "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    }

    return render;
}());

// Format the route name
App.formatRoute = function(name) {
    var route;

    if (typeof name !== "string" || !name) {
        throw new Error("Invalid route name " + name + ".");
    }

    // Capitalize words seprated by " ", "-" or "/"
    route = name.replace(/(^|\s|\/|-)([a-z])/g, function(m, p1, p2) {
        return p1.substring(1) + p2.toUpperCase();
    });

    return route + "Route";
};

// Register routes and create empty objects
App.registerRoutes = function(routes) {
    var route;

    if (!routes || !routes instanceof Array) {
        throw new Error("Routes to register must be an array.");
    }

    for (var i = 0, l = routes.length; i < l; i++) {
        route = App.formatRoute(routes[i]);

        if (typeof route !== "string") {
            continue;
        }

        App[route] = {
            // Every route should have a render function
            // And optionally actions to bind
        };
    }
};

// Let's add an index route by default, so the app doesn't have to
App.registerRoutes([ "index" ]);

// Build URL from state object
App.buildURL = function(state) {
    var url = "#/";

    if (typeof state !== "object") {
        throw new Error("Invalid state " + state + ".");
    }

    // Treat index route as a special case
    if (state.route !== "index") {
        url += state.route;
    }

    if (!state.params || $.isEmptyObject(state.params)) {
        return url;
    }

    url += "?";

    for (var param in state.params) {
        if (param && state.params[param]) {
            url += encodeURIComponent(param) + "=" + encodeURIComponent(state.params[param]) + "&";
        }
    }

    // Remove the trailing "&"
    return url.replace(/[&\?]$/, "").replace(/[&\?]$/, "");
};

// Parse URL to state
App.parseURL = function(url) {
    var hash, extra, query, route,
        params = [],
        state = {};

    if (typeof url !== "string") {
        throw new Error("Invalid url " + url + ".");
    }

    hash = url.split("#")[1] || "";

    // Remove the leading "/"
    hash = hash.replace(/^\//, "");

    route = hash.split("?")[0] || "index"; // Index is the default route
    extra = hash.split("?")[1] || "";
    params = extra ? extra.split("&") : [];

    state.route = route.replace(/^\//, "");
    state.params = {};

    for (var i = 0, l = params.length; i < l; i++) {
        query = params[i].split("=");

        state.params[decodeURIComponent(query[0])] = decodeURIComponent(query[1]);
    }

    return state;
};

// Provide a transitionTo page method
App.transitionTo = function(state, args) {
    if (typeof state !== "object") {
        return;
    }

    App.trigger("navigate", state, args);
};

// Update URL on navigate
App.on("navigate", function(state, args) {
    var methods, model, classlist;

    if (typeof state !== "object") {
        throw new Error("Invalid state " + state + ".");
    }

    // Set the old and new states
    App.oldState = App.parseURL(window.location.hash);
    App.currentState = state;

    // Retain persistent params prefixed with "_"
    if (App.oldState.params) {
        state.params = state.params || {};

        for (var p in App.oldState.params) {
            if ((/^_/).test(p) && !(p in state.params)) {
                state.params[p] = App.oldState.params[p];
            }
        }
    }

    // Update the URL
    if (args && args instanceof Array && args[0] === true) {
        window.history.replaceState(state, null, App.buildURL(state));
    } else {
        window.history.pushState(state, null, App.buildURL(state));
    }

    // Merge with the global methods
    methods = $.extend(true, {}, App.Global, App[App.formatRoute(state.route)]);

    if (!methods) {
        return;
    }

    // Model will give us formatted data
    if (typeof methods.model === "function") {
        model = methods.model(state);

        // Call the afterModel function
        if (typeof methods.afterModel === "function") {
            methods.afterModel(state, model);
        }
    }

    // Call the render method of the route and update the view
    if (typeof methods.render === "function") {
        App.Outlet.html(methods.render(state, model));

        // Bind event handlers so that we can perform actions
        $(document).off("click.action").on("click.action", "[data-action]", function() {
            var actions = $(this).attr("data-action");

            actions = (typeof actions === "string") ? actions.split(" ") : [];

            for (var i = 0, l = actions.length; i < l; i++) {
                if (methods.actions && typeof methods.actions[actions[i]] === "function") {
                    methods.actions[actions[i]].apply(this, [ state, model ]);
                }
            }
        });

        // Call the afterRender function if present
        if (typeof methods.afterRender === "function") {
            methods.afterRender(state, model);
        }
    }

    // Add the tags as classnames to body
    // Attribute selectors for data don't work in Android 4.1
    classlist = $("body").attr("class") || "";
    classlist = classlist.replace(/\btag-\S+/g, "").trim();

    if (methods.tags instanceof Array) {
        for (var j = 0, k = methods.tags.length; j < k; j++) {
            classlist += " tag-" + methods.tags[j];
        }
    }

    $("body").attr("class", classlist);
});

// Send an initial navigate event to update the UI based on state
$(document).on("ready", function() {
    App.transitionTo(App.parseURL(window.location.hash), [ true ]);
});

// On hash change, transition page
$(window).on("hashchange", function() {
    App.transitionTo(App.parseURL(window.location.hash), [ true ]);
});

if (typeof define === "function" && define.amd) {
    // Define as AMD module
    define(function() {
        return App;
    });
} else if (typeof module !== "undefined" && module.exports) {
    // Export to CommonJS
    module.exports = App;
} else {
    window.App = App;
}
