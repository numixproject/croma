/* jshint browser: true */

var App = require(".././app.js"),
    Color = require(".././color.js"),
    utils = require(".././utils.js");

App.DetailsRoute.model = function(state) {
        var color = state.params ? state.params.color : null,
            model = {},
            colorObj;

    if (!color) {
        App.trigger("navigate", { route: "index" });

        utils.showToast({
            body: "No color specified.",
            persistent: true,
            timeout: 3000
        });
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

    return model;
};

App.DetailsRoute.render = function(state, model) {
    var html = [
        "<div class='card-item'>",
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
        "<div class='paper-button-container'>",
        "<a data-action='topalettes' class='paper-button paper-button-block fx-ripple'>See color palettes</a>",
        "</div>"
    ].join("");

    return html;
};

App.DetailsRoute.afterRender = function(state) {
    App.setTitle(state.params.color);

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.DetailsRoute.actions = {
    topalettes: function(state) {
        var color = state.params ? state.params.color : null;

        App.trigger("navigate", {
            route: "palettes",
            params: { color: color }
        });
    }
};
