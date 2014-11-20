/* jshint browser: true */

var App = require(".././app.js"),
    Color = require(".././color.js"),
    utils = require(".././utils.js");

App.PalettesRoute.model = function(state) {
    var data = {},
        isPro = utils.isPro(),
        name, objs, arr, color;

    if (!(state.params && state.params.color)) {
        App.trigger("navigate", { route: "index" });
    }

    color = new Color(state.params.color);

    data.hexVal = color.tohex();

    data.palettes = [];

    for (var i in color) {
        if ((/.*scheme$/i).test(i) && typeof color[i] === "function") {
            objs = (!isPro && i.toLowerCase() === "monochromaticscheme") ? color[i](max) : color[i]();

            if (!isPro && objs.length > App.vars.maxColors) {
                continue;
            }

            name = utils.parseCamelCase(i).replace(/scheme/i, "").trim();
            arr = [];

            for (var j = 0; j < objs.length; j++) {
                arr.push(objs[j].tohex());
            }

            data.palettes.push({
                colors: arr,
                name: name
            });
        }
    }

    return data;
};

App.PalettesRoute.render = function(state, model) {
    var html = "";

    for (var i = 0, l = model.palettes.length; i < l; i++) {
        html += [
            "<div data-action='save' class='card-item card-item-action-container fx-animate-in fx-ripple' data-index='" + i + "'>",
            "<div class='card-item-segment'>",
            "<div class='card-item-color-item-large fx-ripple' style='" + utils.generateBackground(model.palettes[i].colors) + "'></div>",
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

        App.trigger("navigate", { route: "palette/show", params: { palette: query } });
    }
};
