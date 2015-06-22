var Color = require("pigment/full"),
    App = require("../core/app.js"),
    utils = require("../utils.js");

App.PalettesRoute.model = function(state) {
    var model = {},
        isPro = utils.isPro(),
        color = state.params ? state.params.color : null,
        colorObj, objs, arr;

    if (!color) {
        return model;
    }

    colorObj = new Color(color);

    model.hexVal = colorObj.tohex();

    model.palettes = [];

    for (var i in colorObj) {
        if ((/.*scheme$/i).test(i) && typeof colorObj[i] === "function") {
            objs = (!isPro && i.toLowerCase() === "monochromaticscheme") ? colorObj[i](App.vars.maxColors) : colorObj[i]();

            if (!isPro && objs.length > App.vars.maxColors) {
                continue;
            }

            // For the first color, push our initial color to retain it
            // While palette generation, the hex value might change a bit
            // Don't do this for monochromatic since the first color is not the color we passed
            arr = (i.toLowerCase() === "monochromaticscheme") ? [ objs[0].tohex() ] : [ model.hexVal ];

            for (var j = 1; j < objs.length; j++) {
                arr.push(objs[j].tohex());
            }

            model.palettes.push({
                colors: arr,
                name: utils.parseCamelCase(i).replace(/scheme/i, "").trim(),
                background: utils.generateBackground(arr)
            });
        }
    }

    return model;
};

App.PalettesRoute.afterRender = function(...args) {
    App.setTitle("Palettes");

    App.Global.afterRender(...args);
};

App.PalettesRoute.actions = {
    save: function(state, model) {
        var map = {},
            index = $(this).closest("[data-index]").attr("data-index"),
            colors = model.palettes[index].colors,
            query;

        if (!Array.isArray(colors)) {
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
