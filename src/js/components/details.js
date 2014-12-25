/* jshint browser: true */

var App = require(".././app.js"),
    Color = require(".././color.js"),
    utils = require(".././utils.js");

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

    return model;
};

App.DetailsRoute.render = function(state, model) {
    var html = "",
        strings;

    if (!model) {
        html += [
            "<div class='empty-area fx-fade-in'>",
            "<a class='empty-area-action'>An error occured!</a>",
            "</div>"
        ].join("");

        return html;
    }

    html = [
        "<div class='card-item fx-come-in'>",
        "<div class='card-item-color-item-large' style='background-color:" + model.hexVal + "'></div>",
        "<div class='card-item-info-wrap'>"
    ].join("");

    strings = model.strings;

    for (var i = 0, l = strings.length; i < l; i++) {
        if (!strings[i].value) {
            continue;
        }

        html += [
            "<div class='card-item-info" + (utils.copyToClipboard(true) ? " fx-ripple card-item-info-action-copy' data-action='copy'" : "'") + ">",
            "<span class='card-item-label'>" + strings[i].key + "</span>",
            "<span class='card-item-value'>" + strings[i].value + "</span>",
            "</div>"
        ].join("");
    }

    html += [
        "</div></div>",
        "<div class='paper-button-container fx-come-in'>",
        "<a data-action='topalettes' class='paper-button paper-button-block'>See color palettes</a>",
        "</div>"
    ].join("");

    return html;
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
