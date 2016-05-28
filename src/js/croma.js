import $ from 'jquery';
import 'babel-polyfill';
import App from './core/app';
import animations from './animations';

// Handle URL opening in Firefox OS
if ('mozSetMessageHandler' in navigator) {
    // Handle opening of URLs
    navigator.mozSetMessageHandler('activity', (a) => {
        const url = a.source.data.url;

        if (typeof url !== 'string') {
            return;
        }

        App.transitionTo(App.parseURL(url.replace(/^((https?:\/\/croma.numixproject.org)|(croma:\/\/))/, '')));
    });
}

// App global variables
App.vars = {
    maxColors: 4,
    actionDone: false
};

// Set app title
const $appTitle = $('#app-title');

App.setTitle = (title) => {
    if (typeof title !== 'string') {
        return;
    }

    $appTitle.text(title);
};

// Add animations after route is rendered
App.Global.afterRender = () => {
    const cls = [ 'fade-in', 'scale-in' ];

    // Add ripple animation
    animations.ripple('.fx-ripple');

    // Animate elements
    cls.forEach((c) => {
        $(`.fx-${c}`).addClass(c);
    });
};

// Provide global actions
App.Global.actions = {
    goback: () => {
        if (App.oldState && App.oldState.route !== App.currentState.route && !App.vars.actionDone) {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                App.transitionTo(App.oldState);
            }

            App.vars.actionDone = false;
        } else {
            App.transitionTo({ route: 'index' });
        }
    }
};

// Add the routes
App.registerRoutes(
    'palette/new',
    'palette/list',
    'palette/name',
    'palette/show',
    'colors',
    'picker',
    'details',
    'palettes'
);

// Include components
require('./components/index');
require('./components/colors');
require('./components/details');
require('./components/palettes');
require('./components/picker');
require('./components/palette-new');
require('./components/palette-name');
require('./components/palette-list');
require('./components/palette-show');
