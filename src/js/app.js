/* jshint browser: true */
/* global $, Ember, Color, storage, croma, picker */

$(function() {
    var App = Ember.Application.create();

    // Add routes
    App.Router.map(function() {
        this.resource("new");
        this.resource("colors");
        this.resource("picker");
        this.resource("details");
        this.resource("schemes");
    });

    // Render the index route
    App.IndexRoute = Ember.Route.extend({
        model: function() {
            var palettes = storage.get("palettes"),
                arr = [],
                data = [],
                color;

            if (!palettes) { return; }

            for (var p in palettes) {
                arr = [];

                for (var c in palettes[p].colors) {
                    if (palettes[p].colors[c]) {
                        arr.push("background-color:" + c + ";");
                    }
                }

                data.push({
                    name: p,
                    colors: arr.reverse(),
                    isLoved: palettes[p].loved
                });
            }

            return data.reverse();
        }
    });

    App.IndexController = Ember.ObjectController.extend({
        actions: {
            love: croma.loveItem,
            delete: croma.deleteItem
        }
    });

    // Render the colors route
    App.ColorsRoute = Ember.Route.extend({
        model: function(params) {
            var name, palettes, current,
                data = [];

            if (!(params && params.palette)) {
                App.Router.router.transitionTo("index");
            }

            name = params.palette;
            palettes = storage.get("palettes");

            if (palettes) {
                current = palettes[name];
            } else {
                return;
            }

            if (current) {
                for (var c in current.colors) {
                    data.push({
                        palette: name,
                        color: c,
                        cssStr: "background-color:" + c
                    });
                }
            } else {
                return;
            }

            return {
                name: name,
                colors: data.reverse()
            };
        },

        actions: {
            delete: croma.deleteItem
        }
    });

    App.ColorsController = Ember.ObjectController.extend({
        queryParams: [ "palette" ],
        palette: null
    });

    // Render the details route
    App.DetailsRoute = Ember.Route.extend({
        model: function(params) {
            var color;

            if (!(params && params.color)) {
                App.Router.router.transitionTo("index");
            }

            color = new Color(params.color);

            color.hexVal = color.tohex();
            color.cssStr = "background-color:" + color.hexVal;

            color.strings = [
                { key: "Name", value: color.name() },
                { key: "HEX", value: color.tohex() },
                { key: "RGB", value: color.torgb() },
                { key: "HSL", value: color.tohsl() },
                { key: "HSV", value: color.tohsv() },
                { key: "CMYK", value: color.tocmyk() },
                { key: "LAB", value: color.tolab() },
                { key: "Luminance", value: parseFloat(color.luminance()).toFixed(2) },
                { key: "Darkness", value:  parseFloat(color.darkness()).toFixed(2) }
            ];

            return [ color ];
        }
    });

    App.DetailsController = Ember.ArrayController.extend({
        queryParams: [ "color" ],
        color: null
    });

    // Render the schemes route
    App.SchemesRoute = Ember.Route.extend({
        model: function(params) {
            var color, name, objs, strs, val;

            if (!(params && params.color)) {
                App.Router.router.transitionTo("index");
            }

            color = new Color(params.color);

            color.hexVal = color.tohex();

            color.schemes = [];

            for (var i in color) {
                if ((/.*scheme$/i).test(i) && typeof color[i] === "function") {
                    name = croma.parseCamelCase(i).replace(/scheme/i, "").trim();
                    objs = color[i]();
                    strs = [];

                    for (var j = 0; j < objs.length; j++) {
                        val = objs[j].tohex();

                        strs.push({
                            value: val,
                            cssStr: "background-color:" + val
                        });
                    }

                    color.schemes.push({
                        name: name,
                        colors: strs
                    });
                }
            }

            return [ color ];
        }
    });

    App.SchemesController = Ember.ArrayController.extend({
        queryParams: [ "color" ],
        color: null
    });

    // Render the picker route
    App.PickerRoute = Ember.Route.extend({
        model: function(params) {
            return params;
        },

        actions: {
            add: function(palette) {
                var color = picker.value,
                    palettes = storage.get("palettes"),
                    current;

                if ((!color) || typeof color !== "string") {
                    return;
                }

                color = new Color(color).tohex();

                if (palettes) {
                    current = palettes[palette];
                } else {
                    return;
                }

                if (current) {
                    palettes[palette].colors[color] = true;
                }

                storage.set("palettes", palettes);

                App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
            },

            cancel: function(palette) {
                if (palette && palette !== "undefined") {
                    App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
                } else {
                    App.Router.router.transitionTo("new");
                }
            }
        }
    });

    App.PickerView = Ember.View.extend({
        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce("afterRender", this, picker.showPicker);
        }
    });

    App.PickerController = Ember.ObjectController.extend({
        queryParams: [ "palette" ],
        palette: null
    });

});
