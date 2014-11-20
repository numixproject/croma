/* jshint browser: true */

var App = require(".././app.js"),
    Color = require(".././color.js"),
    utils = require(".././utils.js");

App.DetailsRoute.model = function(state) {
        var color;

        if (!(state.params && state.params.color)) {
            App.trigger("navigate", { route: "index" });
        }

        color = new Color(state.params.color);

        color.hexVal = color.tohex();

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
};

App.DetailsRoute.render = function(state, model) {
    var html = [
        "<div class='card-item fx-animate-in'>",
        "<div class='card-item-color-item-large' style='background-color:" + model.hexVal + "'></div>",
        "<div class='card-item-info-wrap'>"
    ].join(""),
        strings = model.strings;

    for (var i = 0, l = strings.length; i < l; i++) {
        if (!strings[i].value) {
            continue;
        }

        html += [
            "<div class='card-item-info'>",
            "<span class='card-item-label'>" + strings[i].key + "</span>",
            "<span class='card-item-value'>" + strings[i].value + "</span>",
            "</div>"
        ].join("");
    }

    html += [
        "</div></div>",
        "<div class='paper-button-container fx-animate-in'>",
        "<a data-action='topalettes' class='paper-button paper-button-block fx-ripple'>See color palettes</a>",
        "</div>"
    ].join("");

    return html;
};

App.DetailsRoute.actions = {
    topalettes: function(state) {
        var color = state.params.color;

        App.trigger("navigate", {
            route: "palettes",
            params: { color: color }
        });
    }
};
