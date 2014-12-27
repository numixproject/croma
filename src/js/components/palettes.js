/* jshint browser: true */

var App = require("../core/app.js"),
    Color = require("../core/color.js"),
    utils = require("../utils.js");

App.PalettesRoute.model = function(state) {
    var data = {},
        isPro = utils.isPro(),
        color = state.params ? state.params.color : null,
        colorObj, objs, arr;

    if (!color) {
        return;
    }

    colorObj = new Color(color);

    data.hexVal = colorObj.tohex();

    data.palettes = [];

    for (var i in colorObj) {
        if ((/.*scheme$/i).test(i) && typeof colorObj[i] === "function") {
            objs = (!isPro && i.toLowerCase() === "monochromaticscheme") ? colorObj[i](App.vars.maxColors) : colorObj[i]();

            if (!isPro && objs.length > App.vars.maxColors) {
                continue;
            }

            // For the first color, push our initial color to retain it
            // While palette generation, the hex value might change a bit
            // Don't do this for monochromatic since the first color is not the color we passed
            arr = (i.toLowerCase() === "monochromaticscheme") ? [ objs[0].tohex() ] : [ data.hexVal ];

            for (var j = 1; j < objs.length; j++) {
                arr.push(objs[j].tohex());
            }

            data.palettes.push({
                colors: arr,
                name: utils.parseCamelCase(i).replace(/scheme/i, "").trim()
            });
        }
    }

    return data;
};

App.PalettesRoute.render = function(state, model) {
    var html = "";

    if (!model || !model.palettes || !(model.palettes instanceof Array)) {
        html += [
            "<div class='empty-area fx-fade-in'>",
            "<a class='empty-area-action'>An error occured!</a>",
            "</div>"
        ].join("");

        return html;
    }

    for (var i = 0, l = model.palettes.length; i < l; i++) {
        html += [
            "<div data-action='save' class='card-item card-item-action-container fx-come-in' data-index='" + i + "'>",
            "<div class='card-item-segment'>",
            "<div class='card-item-color-item-large' style='" + utils.generateBackground(model.palettes[i].colors) + "'></div>",
            "</div>",
            "<div class='card-item-segment'>",
            "<div class='card-item-text'>" + model.palettes[i].name + "</div>",
            "</div></div>"
        ].join("");
    }

    return html;
};

App.PalettesRoute.afterRender = function(state, model) {
    App.setTitle("Palettes");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.PalettesRoute.actions = {
    save: function(state, model) {
        var map = {},
            index = $(this).closest("[data-index]").attr("data-index"),
            colors = model.palettes[index].colors,
            query;

        if (!colors instanceof Array) {
            return;
        }

        for (var i = 0, l = colors.length; i < l; i++) {
            map[colors[i]] = true;
        }

        query = utils.paletteToQuery(map);

        App.transitionTo({
            route: "palette/show",
            params: { palette: query }
        });
    }
};
