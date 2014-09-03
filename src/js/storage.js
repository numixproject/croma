/**
 * @fileOverview - Simple wrapper for localStorage.
 * @author - Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license - GPL-3.0+
 */

var Storage = (function() {

    var _localStorage = ("androidStorage" in window) ? window.androidStorage : window.localStorage;

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
            // Convert objects to strings and store
            try {
                _localStorage.setItem(
                    JSON.stringify(key),
                    JSON.stringify(value)
                );
            } catch (err) {
                throw err;
            }
        };

        /**
         * Get the value of a key.
         * @constructor
         * @param {Object} key
         * @return {Object} value
         */
        _this.get = function(key) {
            var str;

            // Parse strings to objects
            try {
                str = _localStorage.getItem(
                    JSON.stringify(key)
                );
            } catch (err) {
                throw err;
            }

            if (str && typeof str === "string") {
                return JSON.parse(str);
            }
        };

        /**
         * Delete a key from database.
         * @constructor
         * @param {Object} key
         */
        _this.remove = function(key) {
            // Remove stringified object
            try {
                _localStorage.removeItem(
                    JSON.stringify(key)
                );
            } catch (err) {
                throw err;
            }
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
