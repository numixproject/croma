/* jshint browser: true */

var App = require(".././framework.js"),
    croma = require(".././croma.js");

App.PaletteListRoute.model = function(state) {
    var palettes = croma.getData(),
        data = [];

    if (!palettes) {
        return;
    }

    for (var p in palettes) {
        // Exclude names beginning with "_$"
        if (!croma.validateName(p)) {
            continue;
        }

        data.push(p);
    }

    return data.sort(croma.sortByDate);
};

App.PaletteListRoute.render = function(state, model) {
    var html = "";

    if (!model.length) {
        html += [
            "<div class='empty-area'><div class='empty-area-action'>",
            "No palettes found",
            "</div></div>"
        ].join("");

        return html;
    }

    for (var i = 0, l = model.length; i < l; i++) {
        html += "<div class='card-item card-item-select-item fx-animate-in fx-ripple' data-action='add'>" + model[i] + "</div>";
    }

    return html;
};

App.PaletteListRoute.actions = {
    add: function(palette) {
        var oldname = state.params.oldname,
            olddata, currdata, oldcolors, currcolors;

        olddata = croma.getData(oldname) || {};
        currdata = croma.getData(palette) || {};
        oldcolors = olddata.colors;
        currcolors = currdata.colors;

        currdata.colors = $.extend(true, {}, currcolors, oldcolors);

        croma.setData(palette, currdata);

        actiondone = true;

        App.trigger("navigate", { route: "colors", params: { palette: palette } });
    }
};
