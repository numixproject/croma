/* jshint browser: true */

var App = require("../core/app.js"),
    Color = require("../core/color.js"),
    utils = require("../utils.js");

App.DetailsRoute.model = function(state) {
        var color = state.params ? state.params.color : null,
            model = {},
            colorObj;

    if (!color) {
        return;
    }

    colorObj = new Color(color);

    model.hexVal = colorObj.tohex();

    model.strings = [
        { key: "Name", value: colorObj.name() },
        { key: "HEX", value: colorObj.tohex() },
        { key: "RGB", value: colorObj.torgb() },
        { key: "HSL", value: colorObj.tohsl() },
        { key: "HSV", value: colorObj.tohsv() },
        { key: "CMYK", value: colorObj.tocmyk() },
        { key: "LAB", value: colorObj.tolab() },
        { key: "Luminance", value: parseFloat(colorObj.luminance()).toFixed(2) },
        { key: "Darkness", value:  parseFloat(colorObj.darkness()).toFixed(2) }
    ];

    model.copy = utils.copyToClipboard(true);

    return model;
};

App.DetailsRoute.afterRender = function(state) {
    App.setTitle(state.params.color || "Error!");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.DetailsRoute.actions = {
    topalettes: function(state) {
        var color = state.params ? state.params.color : null;

        App.transitionTo({
            route: "palettes",
            params: { color: color }
        });
    },

    copy: function() {
        var label = $(this).find(".card-item-label").text(),
            text = $(this).find(".card-item-value").text();

        utils.copyToClipboard(label, text);
    }
};
