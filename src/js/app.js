/* jshint browser: true */
/* global $, Ember, Color, Casket, picker */

$(function() {
    var App = Ember.Application.create(),
        casket = new Casket(),
        colors = [],
        loved = [];

    try {
        casket.query("croma");
    } catch (err) {
        casket.create("croma", { colors: [], loved: [] });
    }

    colors = casket.query("croma", "colors").results;
    loved = casket.query("croma", "loved").results;

    App.Router.map(function() {
        this.resource("picker");
        this.resource("details");
    });

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
            love: function(color) {
                if (loved.indexOf(color) > -1) {
                    casket.drop("croma", "loved", color);
                    loved.removeObject(color);
                } else {
                    casket.push("croma", "loved", color);
                    loved.pushObject(color);
                }
            },

            delete: function(color) {
                casket.drop("croma", "colors", color);
                casket.drop("croma", "loved", color);
                colors.removeObject(color);
            }
        }
    });

    App.DetailsRoute = Ember.Route.extend({
        model: function(params) {
            var color = new Color(params.color),
                objs, strs, val;

            color.hexVal = color.tohex();
            color.cssStr = "background-color:" + color.hexVal;

            color.strings = [
                { key: "Name", value: color.name() },
                { key: "HEX", value: color.tohex() },
                { key: "RGB", value: color.torgb() },
                { key: "HSL", value: color.tohsl() },
                { key: "CMYK", value: color.tocmyk() },
                { key: "LAB", value: color.tolab() },
                { key: "Luminance", value: color.luminance() },
                { key: "Darkness", value: color.darkness() }
            ];

            color.schemes = [];

            for (var i in color) {
                if ((/.*scheme$/i).test(i) && typeof color[i] === "function") {
                    objs = color[i]();
                    strs = [];

                    for (var j = 0; j < objs.length; j++) {
                        val = objs[j].tohex();

                        strs.push({
                            value: val,
                            cssStr: "background-color:" + val
                        });
                    }

                    color.schemes.push(strs);
                }
            }

            return [ color ];
        }
    });

    App.DetailsController = Ember.ArrayController.extend({
        queryParams: [ "color" ],
        color: null
    });

    App.PickerController = Ember.ObjectController.extend({
        actions: {
            add: function() {
                var color = picker.value;

                if (casket.query("croma", "colors", color).match) {
                    // Color already in DB
                } else {
                    colors.pushObject(color);
                    casket.push("croma", "colors", color);
                }

                App.Router.router.transitionTo("index");
            },

            cancel: function() {
                App.Router.router.transitionTo("index");
            }
        }
    });

    App.PickerView = Ember.View.extend({
        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce("afterRender", this, picker.showPicker);
        }
    });
});
