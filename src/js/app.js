/* jshint browser: true */
/* global $, Ember */

$(function() {
    var croma = require("./croma.js"),
        picker = require("./picker.js"),
        App = Ember.Application.create();

    // Add routes
    App.Router.map(function() {
        this.resource("addpalette");
        this.resource("colors");
        this.resource("picker");
        this.resource("details");
        this.resource("palettes");
    });

    // Render the index route
    App.IndexRoute = Ember.Route.extend({
        model: function() {
            var palettes = croma.getData(),
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

    // Render the add route
    App.AddpaletteRoute = Ember.Route.extend({
        model: function() {
            return {};
        }
    });

    App.AddpaletteController = Ember.ObjectController.extend({
        actions: {
            done: function() {
                var palette = this.get("palettename");

                if (!palette) {
                    return;
                }

                croma.setData(palette, {});

                App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
            }
        }
    });

    // Render the colors route
    App.ColorsRoute = Ember.Route.extend({
        model: function(params) {
            var name, current,
                data = [];

            if (!(params && params.palette)) {
                App.Router.router.transitionTo("index");
            }

            name = params.palette;
            current = croma.getData(name);

            if (!current) {
                return;
            }

            for (var c in current.colors) {
                data.push({
                    palette: name,
                    color: c,
                    cssStr: "background-color:" + c
                });
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

    // Render the palettes route
    App.PalettesRoute = Ember.Route.extend({
        model: function(params) {
            var color, name, objs, strs, val;

            if (!(params && params.color)) {
                App.Router.router.transitionTo("index");
            }

            color = new Color(params.color);

            color.hexVal = color.tohex();

            color.palettes = [];

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

                    color.palettes.push({
                        name: name,
                        colors: strs
                    });
                }
            }

            return [ color ];
        }
    });

    App.PalettesController = Ember.ArrayController.extend({
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
                    data;

                if ((!color) || typeof color !== "string") {
                    return;
                }

                color = new Color(color).tohex();
                data = croma.getData(palette);

                if (data) {
                    data.colors = data.colors || {};
                    data.colors[color] = true;
                }

                croma.setData(palette, data);

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
