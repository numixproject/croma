import App from '../core/app';
import utils from '../utils';

App.PaletteNewRoute.tags = [ 'new' ];

App.PaletteNewRoute.model = () => ({
    getPalette: utils.getPalette(true),
    isPro: utils.isPro()
});

App.PaletteNewRoute.afterRender = (...args) => {
    App.setTitle('Add new palette');

    App.Global.afterRender(...args);
};

App.PaletteNewRoute.actions = {
    topicker() {
        App.transitionTo({ route: 'picker' });
    },
    topalettename() {
        App.transitionTo({ route: 'palette/name' });
    },
    getpalette: utils.getPalette,
    unlockpro: utils.unlockPro
};
