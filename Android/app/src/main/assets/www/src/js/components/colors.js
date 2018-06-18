import App from "../core/app";
import utils from "../utils";

App.ColorsRoute.tags = [ "add" ];

App.ColorsRoute.model = function(state) {
    var name = state.params ? state.params.palette : null,
        current,
        data = [];

    if (!name) {
        return;
    }

    current = utils.getData(name);

    if (!current) {
        return;
    }

    for (var c in current.colors) {
        data.push({
            color: c,
            created: current.colors[c].created
        });
    }

    return data.sort(utils.sortByDate);
};

App.ColorsRoute.afterRender = function(state) {
    App.setTitle(state.params.palette || "Error!");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.ColorsRoute.actions = {
    todetails: function(state) {
        var color = $(this).closest("[data-color]").attr("data-color");

        App.transitionTo({
            route: "details",
            params: { color: color }
        });
    },
    add: function(state) {
        var data,
            palette = state.params ? state.params.palette : null;

        data = utils.getData(palette);

        if (!utils.isPro() && data && data.colors && Object.getOwnPropertyNames(data.colors).length >= App.vars.maxColors) {
            utils.showToast({
                body: "Unlock pro to add more than " + App.vars.maxColors + " colors.",
                actions: {
                    unlock: utils.unlockPro
                },
                persistent: true,
                timeout: 5000
            });

            return;
        }

        App.transitionTo({
            route: "picker",
            params: { palette: palette }
        });
    },
    remove: function(state) {
        var data, oldcolor,
            palette = state.params ? state.params.palette : null,
            color = $(this).closest("[data-color]").attr("data-color");

        utils.removeItem(palette, color, function() {
            data = utils.getData(palette);

            oldcolor = data.colors[color];

            delete data.colors[color];

            utils.setData(palette, data);

            utils.showToast({
                body: "Deleted " + color + ". Tap to dismiss.",
                actions: {
                    undo: function() {
                        data = utils.getData(palette);

                        data.colors[color] = oldcolor;

                        utils.setData(palette, data);
                        utils.undoRemoveItem(palette, color);
                    }
                }
            });
        });
    }
};
