/* jshint browser: true */

var App = require(".././app.js"),
    utils = require(".././utils.js");

App.ColorsRoute.model = function(state) {
    var name, current,
        data = [];

    if (!(state.params && state.params.palette)) {
        App.trigger("navigate", { route: "index" });
    }

    name = state.params.palette;
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

App.ColorsRoute.render = function(state, model) {
    var html = "";

    if (!model.length) {
        html += [
            "<div class='empty-area'>",
            "<a data-action='add' class='empty-area-action'>Tap to add color.</a>",
            "</div>"
        ].join("");

        return html;
    }

    for (var i = 0, l = model.length; i < l; i++) {
        html += [
            "<div class='card-item fx-animate-in' data-color='" + model[i].color + "'>",
            "<div class='card-item-color-item-large fx-ripple' data-action='todetails' style='background-color:" + model[i].color + "'></div>",
            "<div class='card-item-segment'>",
            "<div class='card-item-text'>" + model[i].color + "</div>",
            "<div class='card-item-actions'>",
            "<div class='card-item-action card-item-action-remove' data-action='remove'></div>",
            "</div></div></div>"
        ].join("");
    }

    return html;
};

App.ColorsRoute.actions = {
    todetails: function(state) {
        var color = $(this).closest("[data-color]").attr("data-color");

        App.trigger("navigate", {
            route: "details",
            params: { color: color }
        });
    },
    add: function(state) {
        var data,
            palette = state.params.palette;

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

        App.trigger("navigate", {
            route: "picker",
            params: { palette: palette }
        });
    },
    remove: function(state) {
        var data, oldcolor,
            palette = state.params.palette;
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
