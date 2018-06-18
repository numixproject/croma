/**
 * @fileOverview Simple event emitter.
 * @author Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license GPL-3.0+
 */

var Events = function() {
    this._callbacks = {};
};

Events.prototype = {
    on: function(event, handler) {
        if (!(event in this._callbacks)) {
            this._callbacks[event] = [];
        }

        this._callbacks[event].push(handler);
    },

    off: function(event, handler) {
        if (!this._callbacks && !this._callbacks[event]) {
            return;
        }

        if (arguments.length === 1) {
            delete this._callbacks[event];
            return this;
        }

        var i = this._callbacks[event].indexOf(handler);

        this._callbacks.splice(i, 1);
    },

    trigger: function(event) {
        var currentcallbacks = this._callbacks[event],
            args = Array.prototype.slice.call(arguments, 1);

        if (!currentcallbacks) {
            return;
        }

        for (var i = 0; i < currentcallbacks.length; i++) {
            if (typeof currentcallbacks[i] === "function") {
                currentcallbacks[i].apply(this, args);
            }
        }
    }
};

if (typeof define === "function" && define.amd) {
    // Define as AMD module
    define(function() {
        return Events;
    });
} else if (typeof module !== "undefined" && module.exports) {
    // Export to CommonJS
    module.exports = Events;
} else {
    window.Events = Events;
}
