/* jshint browser: true */
/* global $, Ember */

$(function() {
    var material = require("./material.js"),
        croma = require("./croma.js"),
        picker = require("./picker.js"),
        Color = require("./color.js"),
        App = Ember.Application.create(),
        max = 4,
        bydate = function(a, b) {
            if (a.created > b.created) {
                return -1;
            } else if (a.created < b.created) {
                return 1;
            } else {
                return 0;
            }
        },
        animated = {}, routes = [];

    // Animate content in
    Ember.View.reopen({
        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce("afterRender", this, this.afterRenderEvent);
        },
        afterRenderEvent: function() {
            var url = location.href;

            if (!url.test(/#\//)) {
                url += "#/";
            }

            // Add item to routes list
            if (routes[routes.length - 1] !== url) {
                routes.push(url);
            }

            // Don't reanimate the same view
            if (animated[url]) {
                return;
            }

            animated[url] = true;

            material.animateIn(".fx-animate-in");
        }
    });

    // Add routes
    App.Router.map(function() {
        this.resource("palette", function() {
            this.route("new");
            this.route("list");
            this.route("name");
            this.route("show");
        });
        this.resource("colors");
        this.resource("picker");
        this.resource("details");
        this.resource("palettes");
    });

    // Implement go back functionality
    App.ApplicationRoute = Ember.Route.extend({
        actions: {
            goBack: function() {
                if (routes.length > 1) {
                    // Remove the current location from routes
                    routes.splice(-1, 1);

                    // Go to previous route
                    location.href = routes[routes.length - 1];
                } else {
                    App.Router.router.transitionTo("index");
                }
            }
        }
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
                if (!croma.validateName(p)) {
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
                    colors: arr,
                    isLoved: palettes[p].loved,
                    created: palettes[p].created
                });
            }

            return data.sort(bydate);
        }.observes("content")
    });

    App.IndexController = Ember.ObjectController.extend({
        actions: {
            share: croma.shareItem,
            love: function(palette) {
                var data;

                if (!palette) {
                    return;
                }

                data = croma.getData(palette);

                if (!data) {
                    return;
                }

                // Toggle love
                data.loved = !(data.loved);

                croma.setData(palette, data);

                croma.loveItem(palette);
            },
            remove: function(palette) {
                var data,
                    router = this.get("target.router");

                if (!palette) {
                    return;
                }

                data = croma.getData(palette);

                croma.removeItem(palette, false, function() {
                    croma.setData(palette, null);

                    router.refresh();

                    croma.showToast({
                        body: "Deleted " + palette + ". Tap to dismiss.",
                        actions: {
                            undo: function() {
                                croma.setData(palette, data);

                                router.refresh();
                            }
                        }
                    });
                });
            }
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

                if (!croma.validateName(palette)) {
                    croma.showToast({
                        body: "Invalid palette name " + palette + ".",
                        timeout: 3000
                    });

                    return;
                }

                if (croma.getData(palette)) {
                    croma.showToast({
                        body: "A palette with same name already exists.",
                        timeout: 3000
                    });

                    return;
                }

                if (croma.validateName(oldname, true)) {
                    data = croma.getData(oldname) || {};

                    croma.setData(oldname);
                }

                croma.setData(palette, data);

                App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
            }
        },

        queryParams: [ "oldname" ],
        oldname: null
    });

    // Render the colors route
    App.PaletteNewRoute = Ember.Route.extend({
        model: function() {
            return {
                cromaImage: croma.getPalette(true),
                unlockPro: !croma.isPro()
            };
        }
    });

    App.PaletteNewController = Ember.ObjectController.extend({
        actions: {
            getpalette: croma.getPalette,
            unlockpro: croma.unlockPro
        }
    });

    // Render the show palette route
    App.PaletteShowRoute = Ember.Route.extend({
        model: function(params) {
            var palette = [],
                colors, c;

            if (!(params && params.palette)) {
                App.Router.router.transitionTo("index");
            }

            colors = croma.queryToPalette(params.palette);

            for (var i = 0, l = colors.length; i < l; i++) {
                c = colors[i].tohex();

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
            save: function(palette, action) {
                var color,
                    name = "_$extracted",
                    count = 0,
                    data = {
                        created: new Date().getTime(),
                        loved: false,
                        colors: {}
                    };

                if (!(palette && palette instanceof Array)) {
                    return;
                }

                for (var i = 0, l = palette.length; i < l; i++) {
                    if (!croma.isPro() && i === max) {
                        croma.showToast({
                            body: "Unlock pro to save more than " + max + " colors.",
                            actions: {
                                unlock: croma.unlockPro
                            },
                            timeout: 3000
                        });

                        break;
                    }

                    color = palette[i].value;

                    if (color) {
                        data.colors[color] = {
                            created: new Date().getTime() + count
                        };
                    }

                    count++;
                }

                croma.setData(name, data);

                if (action === "save") {
                    App.Router.router.transitionTo("palette.name", { queryParams: { oldname: name, from: null } });
                } else if (action === "add") {
                    App.Router.router.transitionTo("palette.list", { queryParams: { oldname: name, from: null } });
                }
            }
        },

        queryParams: [ "palette" ],
        palette: null
    });

    // Render the list route
    App.PaletteListRoute = Ember.Route.extend({
        model: function() {
            var palettes = croma.getData(),
                data = [];

            if (!palettes) { return; }

            for (var p in palettes) {
                // Exclude names beginning with "_$"
                if (!croma.validateName(p)) {
                    continue;
                }

                data.push(p);
            }

            return data.sort(bydate);
        }
    });

    App.PaletteListController = Ember.ObjectController.extend({
        actions: {
            add: function(palette) {
                var oldname = this.get("oldname"),
                    olddata, currdata, oldcolors, currcolors;

                olddata = croma.getData(oldname) || {};
                currdata = croma.getData(palette) || {};
                oldcolors = olddata.colors;
                currcolors = currdata.colors;

                currdata.colors = $.extend(true, {}, currcolors, oldcolors);

                croma.setData(palette, currdata);

                App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
            }
        },

        queryParams: [ "oldname", "palette" ],
        oldname: null,
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
                    cssStr: "background-color:" + c,
                    created: current.colors[c].created
                });
            }

            return {
                name: name,
                colors: data.sort(bydate)
            };
        }
    });

    App.ColorsController = Ember.ObjectController.extend({
        actions: {
            add: function(palette) {
                var data;

                if (!palette) {
                    return;
                }

                data = croma.getData(palette);

                if (!croma.isPro() && data && data.colors && Object.getOwnPropertyNames(data.colors).length >= 4) {
                    croma.showToast({
                        body: "Unlock pro to add more than " + max + " colors.",
                        actions: {
                            unlock: croma.unlockPro
                        },
                        timeout: 3000
                    });

                    return;
                }

                App.Router.router.transitionTo("picker", { queryParams: { palette: palette } });
            },
            remove: function(palette, color) {
                var data, oldcolor,
                    router = this.get("target.router");

                if (!(palette && color)) {
                    return;
                }

                croma.removeItem(palette, color, function() {
                    data = croma.getData(palette);

                    oldcolor = data.colors[color];

                    delete data.colors[color];

                    croma.setData(palette, data);

                    router.refresh();

                    croma.showToast({
                        body: "Deleted " + color + ". Tap to dismiss.",
                        actions: {
                            undo: function() {
                                data = croma.getData(palette);

                                data.colors[color] = oldcolor;

                                croma.setData(palette, data);

                                router.refresh();
                            }
                        }
                    });
                });
            }
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
            var color, name, objs, strs, cssStr;

            if (!(params && params.color)) {
                App.Router.router.transitionTo("index");
            }

            color = new Color(params.color);

            color.hexVal = color.tohex();

            color.palettes = [];

            for (var i in color) {
                if ((/.*scheme$/i).test(i) && typeof color[i] === "function") {
                    objs = color[i]();

                    if (!croma.isPro() && objs.length > 4) {
                        continue;
                    }

                    name = croma.parseCamelCase(i).replace(/scheme/i, "").trim();
                    strs = [];

                    for (var j = 0; j < objs.length; j++) {
                        cssStr = "background-color:" + objs[j].tohex();

                        strs.push(cssStr);
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
                var colors = {},
                    value, query;

                if (!(palette && palette.colors)) {
                    return;
                }

                for (var i in palette.colors) {
                    if (palette.colors.hasOwnProperty(i) && palette.colors[i]) {
                        value = palette.colors[i];

                        if (value) {
                            colors[value.match(/#.*/)[0]] = true;
                        }
                    }
                }

                query = croma.paletteToQuery(colors);

                App.Router.router.transitionTo("palette.show", { queryParams: { palette: query } });
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

                if (croma.validateName(palette)) {
                    data = croma.getData(palette);

                    if (data) {
                        data.colors = data.colors || {};
                        data.colors[color] = {
                            created: new Date().getTime()
                        };
                    }

                    croma.setData(palette, data);

                    App.Router.router.transitionTo("colors", { queryParams: { palette: palette } });
                } else {
                    App.Router.router.transitionTo("palettes", { queryParams: { color: color } });
                }
            }
        },

        queryParams: [ "palette" ],
        palette: null
    });

});
