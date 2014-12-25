/* jshint browser: true */

var App = require(".././app.js"),
    utils = require(".././utils.js");

App.IndexRoute.tags = [ "home", "add" ];

App.IndexRoute.model = function() {
    var palettes = utils.getData(),
        arr = [],
        data = [],
        color;

    if (!palettes) { return; }

    for (var p in palettes) {
        // Exclude names beginning with "_$"
        if (!(palettes[p] && utils.validateName(p))) {
            continue;
        }

        arr = [];

        if (palettes[p].colors) {
            for (var c in palettes[p].colors) {
                if (palettes[p].colors[c]) {
                    arr.push(c);
                }
            }
        }

        data.push({
            name: p,
            colors: arr,
            created: palettes[p].created
        });
    }

    return data.sort(utils.sortByDate);
};

App.IndexRoute.render = function(state, model) {
    var html = "";

    if (!model.length) {
        html += [
            "<div class='empty-area fx-fade-in'>",
            "<a data-action='add' class='empty-area-action'>Tap to add palette.</a>",
            "</div>"
        ].join("");

        return html;
    }

    for (var i = 0, l = model.length; i < l; i++) {
        html += [
            "<div class='card-item fx-come-in' data-palette='" + model[i].name + "'>",
            "<div class='card-item-segment' data-action='tocolors'>",
            "<div class='card-item-color-item-large' style='" + utils.generateBackground(model[i].colors) + "'></div>",
            "</div>",
            "<div class='card-item-segment'>",
            "<div class='card-item-text'>" + model[i].name + "</div>",
            "<div class='card-item-actions'>",
            "<div class='card-item-action card-item-action-share' data-action='share'></div>",
            "<div class='card-item-action card-item-action-remove' data-action='remove'></div>",
            "</div></div></div>"
        ].join("");
    }

    return html;
};

App.IndexRoute.afterRender = function() {
    App.setTitle("Croma");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.IndexRoute.actions = {
    tocolors: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        App.transitionTo({
            route: "colors",
            params: { palette: palette }
        });
    },
    add: function() {
        App.transitionTo({
            route: "palette/new"
        });
    },
    share: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        utils.shareItem(palette);
    },
    remove: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette"),
            data;

        data = utils.getData(palette);

        utils.setData(palette);
        utils.removeItem(palette, false, function() {
            utils.showToast({
                body: "Deleted " + palette + ". Tap to dismiss.",
                actions: {
                    undo: function() {
                        utils.setData(palette, data);
                        utils.undoRemoveItem(palette, false);
                    }
                }
            });
        });
    }
};
