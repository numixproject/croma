import App from "../core/app";
import utils from "../utils";

App.PaletteNameRoute.tags = [ "action" ];

App.PaletteNameRoute.afterRender = function(...args) {
    var state = args[0],
        suggested = state.params ? state.params.suggested : null,
        $input = $("#palette-name");

    // Prefill palette name
    if (utils.validateName(suggested)) {
        $input.val(suggested);
    }

    $input.focus();

    App.setTitle("Name your palette");

    App.Global.afterRender(...args);
};

App.PaletteNameRoute.actions = {
    done: function(state) {
        var palette = $("#palette-name").val() || "",
            oldname = state.params ? state.params.oldname : null,
            data = {};

        if (!utils.validateName(palette)) {
            utils.showToast({
                body: "Invalid palette name " + palette + ".",
                timeout: 3000
            });

            return;
        }

        if (utils.getData(palette)) {
            utils.showToast({
                body: "A palette with same name already exists.",
                timeout: 3000
            });

            return;
        }

        if (utils.validateName(oldname, true)) {
            data = utils.getData(oldname) || {};

            utils.setData(oldname);
        }

        utils.setData(palette, data);

        App.vars.actionDone = true;

        App.transitionTo({
            route: "colors",
            params: { palette: palette }
        });
    }
};
