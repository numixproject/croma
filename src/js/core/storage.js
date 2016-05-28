/**
 * @fileOverview - Simple wrapper for localStorage.
 * @author - Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license - GPL-3.0+
 */

const Storage = ((() => {

    const _localStorage = ('androidStorage' in window) ? window.androidStorage : window.localStorage, _cacheStorage = {};

    // Listen to localStorage changes and update cache
    window.addEventListener('storage', e => {
        if (e && typeof e.key !== 'undefined') {
            // Delete the key in cache
            delete _cacheStorage[e.key];
        }
    }, false);

    /**
     * Return the constructor function.
     */
    return function() {
        const self = this;

        /**
         * Check if localStorage is supported.
         * @constructor
         * @return {Boolean}
         */
        self.supported = () => {
            try {
                return 'localStorage' in window && window.localStorage !== null;
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
        self.set = (k, value) => {
            // Convert the key to string
            const key = JSON.stringify(k);

            // Set the key in the cache
            _cacheStorage[key] = value;

            // Convert objects to strings and store asynchronously
            setTimeout(() => {
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
        self.get = k => {
            let value;

            // Convert the key to string
            const key = JSON.stringify(k);

            // If key is in cache return it
            value = _cacheStorage[key];

            if (typeof value !== 'undefined' && value !== null) {
                return value;
            }

            // Parse strings to objects
            try {
                value = _localStorage.getItem(key);
            } catch (err) {
                throw err;
            }

            // Android WebView throws error if string is empty
            if (typeof value === 'string' && value.trim() !== '') {
                value = JSON.parse(value);

                _cacheStorage[key] = value;

                return value;
            }

            return null;
        };

        /**
         * Delete a key from database.
         * @constructor
         * @param {Object} key
         */
        self.remove = k => {
            // Convert the key to string
            const key = JSON.stringify(k);

            // Remove the key in cache
            delete _cacheStorage[key];

            // Remove stringified object asynchronously
            setTimeout(() => {
                try {
                    _localStorage.removeItem(key);
                } catch (err) {
                    throw err;
                }
            }, 0);
        };
    };
})());

if (typeof define === 'function' && define.amd) {
    // Define as AMD module
    define(() => Storage);
} else if (typeof module !== 'undefined' && module.exports) {
    // Export to CommonJS
    module.exports = Storage;
} else {
    window.Storage = Storage;
}
