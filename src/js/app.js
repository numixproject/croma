/* jshint browser: true */
/* global $, Ember, Color, storage, picker */

$(function() {
    var App = Ember.Application.create();

    // Convert camelCase to sentence
    function parseCamelCase(text) {
        if ((!text) || typeof text !== "string") {
            return "";
        }

        return text.replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
                    .replace(/^./, function(str) { return str.toUpperCase(); });
    }

    // Delete a color from the UI and database
    function deleteItem(palette, color) {
        var $el, palettes, current;

        if ((!palette) || typeof palette !== "string") {
            return;
        }

        palettes = storage.get("palettes");

        if (color) {
            if (palettes) {
                current = palettes[palette];
            } else {
                return;
            }

            if (current) {
                delete palettes[palette].colors[color];
            }

            $el = $("[data-palette=" + palette + "][data-color=" + color + "]");
        } else {
            if (palettes) {
                delete palettes[palette];
            }

            $el = $("[data-palette=" + palette + "]");
        }

        storage.set("palettes", palettes);

        // Swipe out the card
        $el.velocity({
            translateX: "100%",
            opacity: 0
        }, {
            duration: 300,
            easing: [ 0.7, 0.1, 0.57, 0.79 ]
        }).velocity({
            height: 0,
            paddingTop: 0,
            paddingBottom: 0
        }, {
            duration: 300,
            complete: function() {
                $(this).remove();
            }
        });
    }

    // Toggle love color in the UI and database
    function loveItem(palette) {
        var $card, $button,
            palettes, current;

        if ((!palette) || typeof palette !== "string") {
            return;
        }

        palettes = storage.get("palettes");

        if (palettes) {
            current = palettes[palette];
        } else {
            return;
        }

        $card = $("[data-palette=" + palette + "]");

        $button = $card.find(".card-item-action-love");

        // Add class to animate the click
        $button.addClass("clicked");

        setTimeout(function() {
            $button.removeClass("clicked");
        }, 500);

        // Toggle love
        if (current.loved) {
            $card.removeClass("card-item-loved");

            palettes[palette].loved = false;
        } else {
            $card.addClass("card-item-loved");

            palettes[palette].loved = true;
        }

        storage.set("palettes", palettes);
    }

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
            love: loveItem,
            delete: deleteItem
        }
    });

    // Render the colors route
    App.ColorsRoute = Ember.Route.extend({
        model: function(params) {
            var name = params.palette,
                palettes = storage.get("palettes"),
                current,
                data = [];

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
            delete: deleteItem
        }
    });

    App.ColorsController = Ember.ObjectController.extend({
        queryParams: [ "palette" ],
        palette: null
    });

    // Render the details route
    App.DetailsRoute = Ember.Route.extend({
        model: function(params) {
            var color = new Color(params.color);

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
            var color = new Color(params.color),
                name, objs, strs, val;

            color.hexVal = color.tohex();

            color.schemes = [];

            for (var i in color) {
                if ((/.*scheme$/i).test(i) && typeof color[i] === "function") {
                    name = parseCamelCase(i).replace(/scheme/i, "").trim();
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
