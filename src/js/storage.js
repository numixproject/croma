/**
 * @fileOverview - Simple wrapper for localStorage.
 * @author - Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license - GPL-3.0+
 */

var Storage = (function() {

    var _localStorage = ("androidStorage" in window) ? window.androidStorage : window.localStorage,
        _cacheStorage = {};

    // Listen to localStorage changes and update cache
    window.addEventListener("storage", function(e) {
        if (e && e.key) {
            // Invalidate the key in cache
            _cacheStorage[e.key] = null;
        }
    }, false);

    /**
     * Return the constructor function.
     */
    return function() {
        var _this = this;

        /**
         * Check if localStorage is supported.
         * @constructor
         * @return {Boolean}
         */
        _this.supported = function() {
            try {
                return "localStorage" in window && window.localStorage !== null;
            } catch (err) {
                return false;
            }
        };

        /**
         * Set key value pairs.
         * @constructor
         * @param {Object} key
         * @param {Object} value
         */
        _this.set = function(key, value) {
            // Convert the key to string
            key = JSON.stringify(key);

            // Set the key in the cache
            _cacheStorage[key] = value;

            // Convert objects to strings and store asynchronously
            setTimeout(function() {
                try {
                    _localStorage.setItem(key, JSON.stringify(value));
                } catch (err) {
                    throw err;
                }
            }, 0);
        };

        /**
         * Get the value of a key.
         * @constructor
         * @param {Object} key
         * @return {Object} value
         */
        _this.get = function(key) {
            var value;

            // Convert the key to string
            key = JSON.stringify(key);

            // If key is in cache return it
            value = _cacheStorage[key];

            if (value) {
                return value;
            }

            // Parse strings to objects
            try {
                value = _localStorage.getItem(key);
            } catch (err) {
                throw err;
            }

            if (value && typeof value === "string") {
                value = JSON.parse(value);

                _cacheStorage[key] = value;

                return value;
            }
        };

        /**
         * Delete a key from database.
         * @constructor
         * @param {Object} key
         */
        _this.remove = function(key) {
            // Convert the key to string
            key = JSON.stringify(key);

            // Remove the key in cache
            _cacheStorage[key] = null;

            // Remove stringified object asynchronously
            setTimeout(function() {
                try {
                    _localStorage.removeItem(key);
                } catch (err) {
                    throw err;
                }
            }, 0);
        };
    };
}());

if (typeof define === "function" && define.amd) {
    // Define as AMD module
    define(function() {
        return new Storage();
    });
} else if (typeof module !== "undefined" && module.exports) {
    // Export to CommonJS
    module.exports = new Storage();
} else {
    window.storage = new Storage();
}
