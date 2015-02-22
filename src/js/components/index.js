/* jshint browser: true */

var App = require(".././core/app.js"),
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
            background: utils.generateBackground(arr),
            created: palettes[p].created
        });
    }

    return {
	palettes: data.sort(utils.sortByDate),
	share: !("external" in window && window.external && "getUnityObject" in window.external && window.external.getUnityObject("1.0"))
	};
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
    rename: function() {
        var palette = $(this).closest("[data-palette]").attr("data-palette");

        App.transitionTo({
            route: "palette/name",
            params: { oldname: palette }
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
