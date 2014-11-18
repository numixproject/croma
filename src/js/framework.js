/* jshint browser: true */
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
    render: function() {},
    afterRender: function() {},
    actions: {
        goback: window.history.back
    }
};

// Provides a way to add custom overrides
App.Global = $.extend(true, {}, App._super);

// Format the route name
App.formatRoute = function(name) {
    var route;

    if (typeof name !== "string") {
        return;
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

    if (!routes && !routes instanceof Array) {
        return;
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

    if (typeof state !== "object" || !state) {
        return;
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
        url += encodeURIComponent(param) + "=" + encodeURIComponent(state.params[param]) + "&";
    }

    // Remove the trailing "&"
    return url.replace(/&$/, "");
};

// Parse URL to state
App.parseURL = function(url) {
    var hash, extra, query, route,
        params = [],
        state = {};

    if (typeof url !== "string") {
        return;
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

// Update URL on navigate
App.on("navigate", function(state, replace) {
    var methods, model;

    // Set the old and new states
    App.oldState = App.parseURL(window.location.hash);
    App.currentState = state;

    // Update the URL
    if (replace) {
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
    }

    // Call the afterModel function
    if (typeof methods.afterModel === "function") {
        methods.afterModel(state, model);
    }

    // Call the render method of the route and update the view
    if (typeof methods.render === "function") {
        App.Outlet.empty().html(methods.render(state, model));

        // Bind event handlers so that we can perform actions
        $(document).off("click.action").on("click.action", "[data-action]", function() {
            var action = $(this).attr("data-action");

            if (methods.actions && typeof methods.actions[action] === "function") {
                methods.actions[action].apply(this, [ state, model ]);
            }
        });

        // Call the afterRender function if present
        if (typeof methods.afterRender === "function") {
            methods.afterRender.apply(App.Outlet, [ state, model ]);
        }
    }
});

// Send an initial navigate event to update the UI based on state
$(document).on("ready", function() {
    App.trigger("navigate", App.parseURL(window.location.hash));
});

// On history change, trigger navigate
$(window).on("popstate", function() {
    App.trigger("navigate", App.parseURL(window.location.hash), true);
});

module.exports = App;