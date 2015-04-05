import App from "../core/app";
import utils from "../utils";

function savePalette(state, model) {
    var isPro = utils.isPro(),
        suggested = state.params ? state.params.name : null,
        palette = model.palette,
        name = "_$extracted",
        count = 0,
        data = {
            created: new Date().getTime(),
            loved: false,
            colors: {}
        };

    if (!(palette && palette instanceof Array)) {
        return;
    }

    for (var i = 0, l = palette.length; i < l; i++) {
        if (!isPro && i === App.vars.maxColors) {
            utils.showToast({
                body: "Unlock pro to save more than " + App.vars.maxColors + " colors.",
                actions: {
                    unlock: utils.unlockPro
                },
                persistent: true,
                timeout: 5000
            });

            break;
        }

        if (palette[i].color) {
            data.colors[palette[i].color] = {
                created: new Date().getTime() + count
            };
        }

        count++;
    }

    utils.setData(name, data);

    App.vars.actionDone = true;

    return {
        oldname: name,
        suggested: suggested
    };
}

App.PaletteShowRoute.model = function(state) {
    var palette = [],
        colors;

    if (!(state.params && state.params.palette)) {
        return;
    }

    colors = utils.queryToPalette(state.params.palette);

    for (var i = 0, l = colors.length; i < l; i++) {
        palette.push({
            color: colors[i].tohex(),
            dark: (colors[i].darkness() > 0.5)
        });
    }

    return {
        name: state.params.name,
        palette: palette,
        isPro: utils.isPro()
    };
};

App.PaletteShowRoute.afterRender = function(...args) {
    App.setTitle(args[1].name || "Colors");

    App.Global.afterRender(...args);
};

App.PaletteShowRoute.actions = {
    save: function(state, model) {
        var data = savePalette(state, model);

        App.transitionTo({
            route: "palette/name",
            params: {
                oldname: data.oldname,
                suggested: data.suggested
            }
        });
    },
    add: function(state, model) {
        var data = savePalette(state, model);

        App.transitionTo({
            route: "palette/list",
            params: {
                oldname: data.oldname,
                suggested: data.suggested
            }
        });
    }
};
