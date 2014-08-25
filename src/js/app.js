/* jshint browser: true */
/* global $, Ember, Color, Casket, picker */

(function() {
    var App = Ember.Application.create(),
        casket = new Casket(),
        results = [];

    try {
        casket.query("croma");
    } catch (err) {
        casket.create("croma", { colors: [], loved: [] });
    }

    results = casket.query("croma", "colors").results;

    App.Router.map(function() {
        this.resource("picker");
        this.resource("details");
    });

    App.IndexRoute = Ember.Route.extend({
        model: function() {
            return results;
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

    App.PickerView = Ember.View.extend({
        click: function(e) {
            var $target = $(e.target);

            if ($target.hasClass("card-item-button")) {
                if ($target.hasClass("card-item-button-ok")) {
                    results.pushObject(picker.value).reverse();
                }

                App.Router.router.transitionTo("index");
            }
        },

        didInsertElement: function() {
            this._super();

            Ember.run.scheduleOnce('afterRender', this, picker.showPicker);
        }
    });
}());
