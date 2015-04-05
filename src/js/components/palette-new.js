import App from "../core/app";
import utils from "../utils";

App.PaletteNewRoute.tags = [ "new" ];

App.PaletteNewRoute.model = function() {
    return {
        getPalette: utils.getPalette(true),
        isPro: utils.isPro()
    };
};

App.PaletteNewRoute.afterRender = function(...args) {
    App.setTitle("Add new palette");

    App.Global.afterRender(...args);
};

App.PaletteNewRoute.actions = {
    topicker: function() {
        App.transitionTo({ route: "picker" });
    },
    topalettename: function() {
        App.transitionTo({ route: "palette/name" });
    },
    getpalette: utils.getPalette,
    unlockpro: utils.unlockPro
};
