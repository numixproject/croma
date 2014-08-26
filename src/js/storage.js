/* jshint browser: true */

/**
 * @fileOverview Simple wrapper for localStorage.
 * @author Satyajit Sahoo <satyajit.happy@gmail.com>
 */

var Storage = (function() {
    /**
     * Private objects.
     */
    var _localStorage = ("androidStorage" in window) ? window.androidStorage : window.localStorage,
        _errMsgs = {
            NO_KEY_SPECIFIED: "A key must be specified",
            NO_VALUE_SPECIFIED: "A value must be specified",
            NO_ROW_SPECIFIED: "An object must be specified to add as a row",
            TABLE_INVALID: "The table doesn't exist",
            VALUE_INCOMPATIBLE_TYPE: "Value and data are of incompatible type"
        },
        _arrUtils =  {
            /**
             * Add an item into array, optionally at specific index.
             * @constructor
             * @return {Array}
             */
            addItem: function(arr, item, index) {
                if (arr.indexOf(item) === -1) {
                    if (index && typeof index === "number") {
                        // Add the item at the specified index
                        arr.splice(index, 0, item);
                    } else {
                        arr.push(item);
                    }
                }

                return arr;
            },

            /**
             * Remove an item from array.
             * @constructor
             * @return {Array}
             */
            removeItem: function(arr, item) {
                var index = arr.indexOf(item);

                if (index > -1) {
                    arr.splice(index, 1);
                }

                return arr;
            }
        };

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
            if (!key) {
                throw new Error(_errMsgs.NO_KEY_SPECIFIED);
            }

            if (!value) {
                throw new Error(_errMsgs.NO_VALUE_SPECIFIED);
            }

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
            var data;

            if (!key) {
                throw new Error(_errMsgs.NO_KEY_SPECIFIED);
            }

            // Parse strings to objects
            try {
                return JSON.parse(
                    _localStorage.getItem(
                        JSON.stringify(key)
                    )
                );
            } catch (err) {
                throw err;
            }
        };

        /**
         * Delete a key from database.
         * @constructor
         * @param {Object} key
         */
        _this.remove = function(key) {
            if (!key) {
                throw new Error(_errMsgs.NO_KEY_SPECIFIED);
            }

            // Remove stringified object
            try {
                _localStorage.removeItem(
                    JSON.stringify(key)
                );
            } catch (err) {
                throw err;
            }
        };

        /**
         * Create a new table.
         * @constructor
         * @param {String} table
         * @param {Object} [rows]
         */
        _this.create = function(table, rows) {
            var obj;

            if (!(table && typeof table === "string")) {
                throw new Error(_errMsgs.NO_TABLE_SPECIFIED);
            }

            if (!(rows && typeof rows === "object")) {
                rows = {};
            }

            // If the list of rows is array, convert to object
            if (rows instanceof Array) {
                obj = {};

                // Add each item in array to an object with empty value
                rows.reduce(function(p, c) {
                    obj[c] = "";
                }, {});

                rows = obj;
            }

            _this.set(table, rows);
        };

        /**
         * Get items from a table.
         * @constructor
         * @param {String} table
         */
        _this.items = function(table) {
            var items, data;

            if (!(table && typeof table === "string")) {
                throw new Error(_errMsgs.NO_TABLE_SPECIFIED);
            }

            items = _this.get(table);

            if (!items) {
                throw new Error(_errMsgs.TABLE_INVALID + " : " + table);
            }

            return items;
        };

        /**
         * Modify a value in the table.
         * @constructor
         * @param {String} table
         * @param {Object} key
         * @param {Object} value
         */
        _this.modify = function(table, key, value, fn) {
            var items, data;

            if (!key) {
                throw new Error(_errMsgs.NO_KEY_SPECIFIED);
            }

            items = _this.items(table);

            data = items[key];

            if (fn && typeof fn === "function") {
                // Execute callback with the items as execution context
                items[key] = fn.apply(items, [ value, data ]);
            } else {
                items[key] = value;
            }

            _this.set(table, items);
        };

        /**
         * Push values to an array in table.
         * @constructor
         * @param {String} table
         * @param {Object} key
         * @param {Object} value
         */
        _this.push = function(table, key, value) {
            _this.modify(table, key, value, function(value, data) {
                // Check if current data is array
                if (data instanceof Array) {
                    // Add the value to data array
                    _arrUtils.addItem(data, value);
                } else {
                    // Set new array with value
                    data = [ value ];
                }

                return data;
            });
        };

        /**
         * Merge values to a table.
         * @constructor
         * @param {String} table
         * @param {Object} key
         * @param {Object} value
         */
        _this.merge = function(table, key, value) {
            _this.modify(table, key, value, function(value, data) {
                if (!(typeof value === "object" && typeof data === "object")) {
                    throw new Error(_errMsgs.VALUE_INCOMPATIBLE_TYPE);
                }

                if (value instanceof Array && data instanceof Array) {
                    // Merge current data and given value arrays
                    for (var i = 0, l = value.length; i < l; i++) {
                        _arrUtils.addItem(data, value[i]);
                    }
                } else {
                    // Merge current data and given value objects
                    for (var prop in value) {
                        if (value.hasOwnProperty(prop)) {
                            data[prop] = value[prop];
                        }
                    }
                }

                return data;
            });
        };

        /**
         * Drop a table, key or value.
         * @constructor
         * @param {String} table
         * @param {Object} [key]
         * @param {Object} [value]
         */
        _this.drop = function(table, key, value) {
            var items, data, index;

            if (value) {
                _this.modify(table, key, value, function(value, data) {
                    if (typeof data === "object") {
                        if (data instanceof Array) {
                            if (value instanceof Array) {
                                for (var i = 0, l = value.length; i < l; i++) {
                                    _arrUtils.removeItem(data, value[i]);
                                }
                            } else {
                                _arrUtils.removeItem(data, value);
                            }
                        } else {
                            delete data[value];
                        }
                    }

                    return data;
                });
            } else if (key) {
                items = _this.modify(table, key);
            } else {
                _this.remove(table);
            }
        };

        /**
         * Query items in a table, key or value.
         * @constructor
         * @param {String} table
         * @param {Object} [key]
         * @param {Object} [value]
         * @returns {Object}
         */
        _this.query = function(table, key, value) {
            var items, data,
                query = {};

            items = _this.items(table);

            data = items[key];

            if (value) {
                if (typeof data === "object") {
                    if (data instanceof Array) {
                        query.index = data.indexOf(value);
                    } else {
                        query.results = data[value];
                    }
                } else if (data === value) {
                    query.results = value;
                }
            } else if (key) {
                query.results = data;
            } else {
                query.results = items;
            }

            if (query.index > -1 || query.results) {
                query.match = true;
            } else {
                query.match = false;
            }

            return query;
        };
    };
}());

window.storage = new Storage();
