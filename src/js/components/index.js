/* jshint browser: true */

var App = require(".././framework.js"),
    croma = require(".././croma.js");

App.IndexRoute.model = function() {
    var palettes = croma.getData(),
        arr = [],
        data = [],
        color;

    if (!palettes) { return; }

    for (var p in palettes) {
        // Exclude names beginning with "_$"
        if (!(palettes[p] && croma.validateName(p))) {
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

    return data.sort(croma.sortByDate);
};

App.IndexRoute.render = function(state, model) {
    var html = "";

    if (!model.length) {
        html += [
            "<div class='empty-area'>",
            "<a action='add' class='empty-area-action'>Tap to add palette.</a>",
            "</div>"
        ].join("");

        return html;
    }

    for (var i = 0, l = model.length; i < l; i++) {
        html += [
            "<div class='card-item fx-animate-in' data-palette='" + model[i].name + "'>",
            "<div class='card-item-segment' data-action='tocolors'>",
            "<div class='card-item-color-item-large fx-ripple' style='" + croma.generateBackground(model[i].colors) + "'></div>",
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

App.IndexRoute.actions = {
    tocolors: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        App.trigger("navigate", {
            route: "colors",
            params: { palette: palette }
        });
    },
    add: function() {
        App.trigger("navigate", {
            route: "palette/new"
        });
    },
    share: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        croma.shareItem(palette);
    },
    remove: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette"),
            data;

        data = croma.getData(palette);

        croma.setData(palette);
        croma.removeItem(palette, false, function() {
            croma.showToast({
                body: "Deleted " + palette + ". Tap to dismiss.",
                actions: {
                    undo: function() {
                        croma.setData(palette, data);
                        croma.undoRemoveItem(palette, false);
                    }
                }
            });
        });
    }
};
