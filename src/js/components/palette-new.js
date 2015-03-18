import App from "../core/app";
import utils from "../utils";

App.PaletteNewRoute.tags = [ "new" ];

App.PaletteNewRoute.model = function(state) {
    return {
        getPalette: utils.getPalette(true),
        isPro: utils.isPro()
    };
};

App.PaletteNewRoute.afterRender = function(state) {
    App.setTitle("Add new palette");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
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
