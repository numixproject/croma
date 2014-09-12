/* jshint browser: true */
/* global $, Ember */

$(function() {
    var croma = require("./croma.js"),
        picker = require("./picker.js"),
        Color = require("./color.js"),
        App = Ember.Application.create();

    // Add routes
    App.Router.map(function() {
        this.resource("palette", function() {
            this.route("new");
            this.route("name");
            this.route("show");
        });
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
                // Exclude names beginning with "_$"
                if ((/^_\$.*/).test(p)) {
                    continue;
                }

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
    App.PaletteNameRoute = Ember.Route.extend({
        model: function(params) {
            return params;
        }
    });

    App.PaletteNameController = Ember.ObjectController.extend({
        actions: {
            done: function() {
                var palette = this.get("palettename"),
                    oldname = this.get("oldname"),
                    data = {};

                if (!(palette && palette !== "undefined")) {
                    return;
                }

                if (oldname && oldname !== "undefined") {
                    data = croma.getData(oldname) || {};

                    croma.setData(oldname);
                }

                croma.setData(palette, data);

                App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
            },

            back: function() {
                var from = this.get("from");

                from = (from && from !== "undefined") ? from : "index";

                App.Router.router.transitionTo(from);
            }
        },

        queryParams: [ "from", "oldname" ],
        from: null,
        oldname: null
    });

    // Render the colors route
    App.PaletteNewRoute = Ember.Route.extend({
        model: function() {
            return {
                cromaImage: ("cromaImage" in window && cromaImage.getColors)
            };
        }
    });

    App.PaletteNewController = Ember.ObjectController.extend({
        actions: {
            getcolors: function() {
                if (this.get("cromaImage")) {
                    cromaImage.getColors();
                }
            }
        }
    });

    // Render the show palette route
    App.PaletteShowRoute = Ember.Route.extend({
        model: function(params) {
            var palette = [],
                rgbvals, c;

            if (!(params && params.palette)) {
                App.Router.router.transitionTo("index");
            }

            rgbvals = decodeURIComponent(params.palette).replace(/\|$/, "").split("|");

            for (var i = 0, l = rgbvals.length; i < l; i++) {
                c = new Color({
                    rgb: rgbvals[i].split(",")
                }).tohex();

                palette.push({
                    cssStr: "background-color:" + c,
                    value: c
                });
            }

            return palette;
        }
    });

    App.PaletteShowController = Ember.ObjectController.extend({
        actions: {
            save: function(palette) {
                var color,
                    name = "_$extracted",
                    data = {
                        loved: false,
                        colors: {}
                    };

                if (!(palette && palette instanceof Array)) {
                    return;
                }

                for (var i = 0, l = palette.length; i < l; i++) {
                    color = palette[i].value;

                    if (color) {
                        data.colors[color] = true;
                    }
                }

                croma.setData(name, data);

                App.Router.router.transitionTo("palette.name", { queryParams: { oldname: name, from: null } });
            }
        },

        queryParams: [ "palette" ],
        palette: null
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
        }
    });

    App.ColorsController = Ember.ObjectController.extend({
        actions: {
            delete: croma.deleteItem
        },

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

            return color;
        }
    });

    App.DetailsController = Ember.ObjectController.extend({
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

            return color;
        }
    });

    App.PalettesController = Ember.ObjectController.extend({
        actions: {
            save: function(palette) {
                var color,
                    name = "_$generated",
                    data = {
                        loved: false,
                        colors: {}
                    };

                if (!(palette && palette.colors)) {
                    return;
                }

                for (var i in palette.colors) {
                    if (palette.colors.hasOwnProperty(i) && palette.colors[i]) {
                        color = palette.colors[i].value;

                        if (color) {
                            data.colors[color] = true;
                        }
                    }
                }

                croma.setData(name, data);

                App.Router.router.transitionTo("palette.name", { queryParams: { oldname: name, from: null } });
            }
        },

        queryParams: [ "color" ],
        color: null
    });

    // Render the picker route
    App.PickerRoute = Ember.Route.extend({
        model: function(params) {
            return params;
        }
    });

    App.PickerView = Ember.View.extend({
        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce("afterRender", this, picker.showPicker);
        }
    });

    App.PickerController = Ember.ObjectController.extend({
        actions: {
            done: function() {
                var color = picker.value,
                    palette = this.get("palette"),
                    data;

                if ((!color) || typeof color !== "string") {
                    return;
                }

                color = new Color(color).tohex();

                if (palette && palette !== "undefined") {
                    data = croma.getData(palette);

                    if (data) {
                        data.colors = data.colors || {};
                        data.colors[color] = true;
                    }

                    croma.setData(palette, data);

                    App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
                } else {
                    App.Router.router.transitionTo("palettes", { queryParams: { color: color } });
                }
            },

            back: function() {
                var palette = this.get("palette"),
                    from = this.get("from");

                if (from && from !== "undefined") {
                    App.Router.router.transitionTo(from, { queryParams: { palette: palette } });
                } else {
                    App.Router.router.transitionTo("index");
                }
            }
        },

        queryParams: [ "palette", "from" ],
        palette: null,
        from: null
    });

});
