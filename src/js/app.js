/* jshint browser: true */
/* global $, Ember, Color, storage, picker */

$(function() {
    var App = Ember.Application.create(),
        colors = [],
        loved = [];

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
    function deleteColor(color) {
        if ((!color) || typeof color !== "string") {
            return;
        }

        color = new Color(color).tohex();

        // Drop color from database
        storage.drop("croma", "colors", color);
        storage.drop("croma", "loved", color);
        colors.removeObject(color);
        loved.removeObject(color);

        // Swipe out the card
        $("[data-color=" + color + "]").velocity({
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
    function loveColor(color) {
        var $card, $button;

        if ((!color) || typeof color !== "string") {
            return;
        }

        color = new Color(color).tohex();

        $card = $("[data-color=" + color + "]");

        $button = $card.find(".card-item-action-love");

        // Add class to animate the click
        $button.addClass("clicked");

        setTimeout(function() {
            $button.removeClass("clicked");
        }, 500);

        // Toggle love
        if (loved.indexOf(color) > -1) {
            $card.removeClass("card-item-loved");
            storage.drop("croma", "loved", color);
            loved.removeObject(color);
        } else {
            $card.addClass("card-item-loved");
            storage.push("croma", "loved", color);
            loved.pushObject(color);
        }
    }

    // If the database doesn't exist, create one
    try {
        storage.query("croma");
    } catch (err) {
        storage.create("croma", { colors: [], loved: [] });
    }

    // Get values from database
    colors = storage.query("croma", "colors").results;
    loved = storage.query("croma", "loved").results;

    // Add routes
    App.Router.map(function() {
        this.resource("picker");
        this.resource("details");
        this.resource("schemes");
        this.resource("fullscreen");
    });

    // Render the index route
    App.IndexRoute = Ember.Route.extend({
        model: function() {
            var data = [],
                color;

            for (var i = 0, l = colors.length; i < l; i++) {
                color = colors[i];

                data.push({
                    color: color,
                    isLoved: (loved.indexOf(color) > -1),
                    cssStr: "background-color:" + color
                });
            }

            return data.reverse();
        }
    });

    App.IndexController = Ember.ObjectController.extend({
        actions: {
            love: loveColor,
            delete: deleteColor
        }
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
    App.PickerView = Ember.View.extend({
        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce("afterRender", this, picker.showPicker);
        }
    });

    App.PickerController = Ember.ObjectController.extend({
        actions: {
            add: function() {
                var color = picker.value;

                if ((!color) || typeof color !== "string") {
                    return;
                }

                color = new Color(color).tohex();

                if (storage.query("croma", "colors", color).match) {
                    // Color already in DB
                } else {
                    colors.pushObject(color);
                    storage.push("croma", "colors", color);
                }

                App.Router.router.transitionTo("index");
            },

            cancel: function() {
                App.Router.router.transitionTo("index");
            }
        }
    });
});
