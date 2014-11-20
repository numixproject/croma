/* jshint browser: true */

var App = require(".././app.js"),
    utils = require(".././utils.js");

App.PaletteListRoute.model = function(state) {
    var palettes = utils.getData(),
        data = [];

    if (!palettes) {
        return;
    }

    for (var p in palettes) {
        // Exclude names beginning with "_$"
        if (!utils.validateName(p)) {
            continue;
        }

        data.push(p);
    }

    return data.sort(utils.sortByDate);
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
        html += "<div class='card-item card-item-select-item fx-animate-in fx-ripple' data-action='add' data-palette='" + model[i] + "'>" + model[i] + "</div>";
    }

    return html;
};

App.PaletteListRoute.afterRender = function(state) {
    App.setTitle("Choose a palette");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.PaletteListRoute.actions = {
    add: function(state, model) {
        var oldname = state.params.oldname,
            palette = $(this).closest("[data-palette]").attr("data-palette"),
            olddata, currdata, oldcolors, currcolors;

        olddata = utils.getData(oldname) || {};
        currdata = utils.getData(palette) || {};
        oldcolors = olddata.colors;
        currcolors = currdata.colors;

        currdata.colors = $.extend(true, {}, currcolors, oldcolors);

        utils.setData(palette, currdata);

        actiondone = true;

        App.trigger("navigate", { route: "colors", params: { palette: palette } });
    }
};
