import App from ".././core/app";
import utils from ".././utils";

App.IndexRoute.tags = [ "home", "add" ];

App.IndexRoute.model = function() {
    let palettes = utils.getData();

    if (!palettes) { return; }

    let data = [];

    for (let p in palettes) {
        // Exclude names beginning with "_$"
        if (!(palettes[p] && utils.validateName(p))) {
            continue;
        }

        let arr = [];

        if (palettes[p].colors) {
            for (let c in palettes[p].colors) {
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

App.IndexRoute.afterRender = function(...args) {
    App.setTitle("Croma");

    App.Global.afterRender(...args);
};

App.IndexRoute.actions = {
    tocolors: function() {
        let palette = $(this).closest("[data-palette]").attr("data-palette");

        App.transitionTo({
            route: "colors",
            params: { palette: palette }
        });
    },
    edit: function() {
        let palette = $(this).closest("[data-palette]").attr("data-palette");

        App.transitionTo({
            route: "palette/name",
            params: {
                oldname: palette,
                rename: true
            }
        });
    },
    add: function() {
        App.transitionTo({
            route: "palette/new"
        });
    },
    share: function() {
        let palette = $(this).closest("[data-palette]").attr("data-palette");

        utils.shareItem(palette);
    },
    remove: function() {
        let palette = $(this).closest("[data-palette]").attr("data-palette"),
            data = utils.getData(palette);

        utils.setData(palette);
        utils.removeItem(palette, false, () => {
            utils.showToast({
                body: "Deleted " + palette + ". Tap to dismiss.",
                actions: {
                    undo: () => {
                        utils.setData(palette, data);
                        utils.undoRemoveItem(palette, false);
                    }
                }
            });
        });
    }
};
