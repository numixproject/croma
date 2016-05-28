import $ from 'jquery';
import App from '../core/app.js';
import utils from '../utils.js';

App.PaletteListRoute.model = () => {
    const palettes = utils.getData(), model = [];

    if (!palettes) {
        return model;
    }

    for (const p in palettes) {
        // Exclude names beginning with "_$"
        if (!utils.validateName(p)) {
            continue;
        }

        model.push(p);
    }

    return model.sort(utils.sortByDate);
};

App.PaletteListRoute.afterRender = (...args) => {
    App.setTitle('Choose a palette');

    App.Global.afterRender(...args);
};

App.PaletteListRoute.actions = {
    add(state) {
        const oldname = state.params ? state.params.oldname : null;
        const palette = $(this).closest('[data-palette]').attr('data-palette');

        const olddata = utils.getData(oldname) || {};
        const currdata = utils.getData(palette) || {};
        const oldcolors = olddata.colors;
        const currcolors = currdata.colors;

        currdata.colors = $.extend(true, {}, currcolors, oldcolors);

        utils.setData(palette, currdata);

        App.vars.actionDone = true;

        App.transitionTo({
            route: 'colors',
            params: { palette }
        });
    }
};
