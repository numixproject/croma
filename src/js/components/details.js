/* jshint browser: true */
/* global App */

var croma = require(".././croma.js"),
    Color = require(".././color.js");

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
    tocolors: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        App.trigger("navigate", {
            route: "colors",
            params: { palette: palette }
        });
    },
    add: function() {
        App.trigger("navigate", {
            route: "palette/new"
        });
    },
    share: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        croma.shareItem(palette);
    },
    remove: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette"),
            data;

        data = croma.getData(palette);

        croma.setData(palette);
        croma.removeItem(palette, false, function() {
            croma.showToast({
                body: "Deleted " + palette + ". Tap to dismiss.",
                actions: {
                    undo: function() {
                        croma.setData(palette, data);
                        croma.undoRemoveItem(palette, false);
                    }
                }
            });
        });
    }
};
