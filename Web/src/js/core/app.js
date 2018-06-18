import $ from 'jquery';
import Events from './events';
import Template from './template';

// The app is basically an event emitter with additional methods
const App = new Events();

App.currentState = {}; // Store the current state
App.oldState = {}; // The previous state belongs here

// Add an outlet for the app
// Only this part is updated on render
App.Outlet = $('#app-outlet');

// We have base methods which are inherited by every route
// This should never be overwritten
App._super = {
    model: () => false,
    afterModel: () => false,
    render: (state, model) => App.renderTemplate(App.getTemplate(state.route), model),
    afterRender: () => false,
    actions: {
        goback: window.history.back
    },
    tags: []
};

// Provides a way to add custom overrides
App.Global = $.extend(true, {}, App._super);

// Get the template for the specified route
App.getTemplate = (() => {
    const APP = window.APP || {}, cache = {};

    APP.templates = APP.templates || {};

    return (route) => {
        cache[route] = cache[route] || APP.templates[route] || App[App.formatRoute(route)].template || $(`[data-template=${route}]`).html();

        return cache[route];
    };
})();

// Provide method to render a template
App.renderTemplate = (() => {
    const template = new Template();

    return (tmpl, data) => {
        const t = (typeof tmpl === 'function') ? tmpl : template.compile(tmpl);

        return data ? tmpl(data) : t;
    };
})();

// Format the route name
App.formatRoute = (name) => {
    if (typeof name !== 'string' || !name) {
        throw new Error('Invalid route name $(name).');
    }

    // Capitalize words seprated by " ", "-" or "/"
    const route = name.replace(/(^|\s|\/|-)([a-z])/g, (m, p1, p2) => p1.substring(1) + p2.toUpperCase());

    return `${route}Route`;
};

// Register routes and create empty objects
App.registerRoutes = (...routes) => {
    for (const path of routes) {
        const route = App.formatRoute(path);

        if (typeof route !== 'string') {
            continue;
        }

        App[route] = {};
    }
};

// Let's add an index route by default, so the app doesn't have to
App.registerRoutes('index');

// Build URL from state object
App.buildURL = (state) => {
    let url = '#/';

    if (typeof state !== 'object') {
        throw new Error('Invalid state $(state).');
    }

    // Treat index route as a special case
    if (state.route !== 'index') {
        url += state.route;
    }

    if (!state.params || $.isEmptyObject(state.params)) {
        return url;
    }

    url += '?';

    for (const param in state.params) {
        if (param && state.params[param]) {
            url += `${encodeURIComponent(param)}=${encodeURIComponent(state.params[param])}&`;
        }
    }

    // Remove the trailing "&"
    return url.replace(/[&\?]$/, '').replace(/[&\?]$/, '');
};

// Parse URL to state
App.parseURL = (url) => {
    if (typeof url !== 'string') {
        throw new Error('Invalid url $(url).');
    }

    // Het hash and emove the leading "/"
    const hash = (url.split('#')[1] || '').replace(/^\//, ''),
          // Index is the default route
        route = hash.split('?')[0] || 'index',
        extra = hash.split('?')[1] || '',
        params = extra ? extra.split('&') : [],
        state = {
            route: route.replace(/^\//, ''),
            params: {}
        };

    for (const param of params) {
        const query = param.split('=');

        state.params[decodeURIComponent(query[0])] = decodeURIComponent(query[1]);
    }

    return state;
};

// Provide a transitionTo page method
App.transitionTo = (state, ...args) => {
    if (typeof state !== 'object') {
        return;
    }

    App.trigger('navigate', state, ...args);
};

// Update URL on navigate
App.on('navigate', (state, ...args) => {
    if (typeof state !== 'object') {
        throw new Error('Invalid state $(state).');
    }

    // Set the old and new states
    App.oldState = App.parseURL(window.location.hash);
    App.currentState = state;

    // Retain persistent params prefixed with "_"
    if (App.oldState.params) {
        state.params = state.params || {};

        for (const p in App.oldState.params) {
            if ((/^_/).test(p) && !(p in state.params)) {
                state.params[p] = App.oldState.params[p];
            }
        }
    }

    // Update the URL
    if (Array.isArray(args) && args[0] === true) {
        window.history.replaceState(state, null, App.buildURL(state));
    } else {
        window.history.pushState(state, null, App.buildURL(state));
    }

    // Merge with the global methods
    const methods = $.extend(true, {}, App.Global, App[App.formatRoute(state.route)]);

    if (!methods) {
        return;
    }

    // Model will give us formatted data
    let model;

    if (typeof methods.model === 'function') {
        model = methods.model(state);

        // Call the afterModel function
        if (typeof methods.afterModel === 'function') {
            methods.afterModel(state, model);
        }
    }

    // Call the render method of the route and update the view
    if (typeof methods.render === 'function') {
        App.Outlet.html(methods.render(state, model));

        // Bind event handlers so that we can perform actions
        $(document).off('click.action').on('click.action', '[data-action]', function() {
            let actions = $(this).attr('data-action');

            actions = (typeof actions === 'string') ? actions.split(' ') : [];

            for (const action of actions) {
                if (methods.actions && typeof methods.actions[action] === 'function') {
                    methods.actions[action].apply(this, [ state, model ]);
                }
            }
        });

        // Call the afterRender function if present
        if (typeof methods.afterRender === 'function') {
            methods.afterRender(state, model);
        }
    }

    // Add the tags as classnames to body
    // Attribute selectors for data don't work in Android 4.1
    let classlist = $('body').attr('class') || '';

    classlist = classlist.replace(/\btag-\S+/g, '').trim();

    if (Array.isArray(methods.tags)) {
        for (const tag of methods.tags) {
            classlist += ` tag-${tag}`;
        }
    }

    $('body').attr('class', classlist.trim());
});

// Send an initial navigate event to update the UI based on state
$(document).on('ready', () => App.transitionTo(App.parseURL(window.location.hash), true));

// On hash change, transition page
$(window).on('hashchange', () => App.transitionTo(App.parseURL(window.location.hash), true));

export default App;
