import App from "../core/app";
import utils from "../utils";

App.PaletteListRoute.model = function(state) {
    var palettes = utils.getData(),
        model = [];

    if (!palettes) {
        return;
    }

    for (var p in palettes) {
        // Exclude names beginning with "_$"
        if (!utils.validateName(p)) {
            continue;
        }

        model.push(p);
    }

    return model.sort(utils.sortByDate);
};

App.PaletteListRoute.afterRender = function(...args) {
    App.setTitle("Choose a palette");

    App.Global.afterRender(...args);
};

App.PaletteListRoute.actions = {
    add: function(state, model) {
        var oldname = state.params ? state.params.oldname : null,
            palette = $(this).closest("[data-palette]").attr("data-palette"),
            olddata, currdata, oldcolors, currcolors;

        olddata = utils.getData(oldname) || {};
        currdata = utils.getData(palette) || {};
        oldcolors = olddata.colors;
        currcolors = currdata.colors;

        currdata.colors = $.extend(true, {}, currcolors, oldcolors);

        utils.setData(palette, currdata);

        App.vars.actionDone = true;

        App.transitionTo({
            route: "colors",
            params: { palette: palette }
        });
    }
};
