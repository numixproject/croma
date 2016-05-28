import $ from 'jquery';
import App from '../core/app.js';
import utils from '../utils.js';

App.ColorsRoute.tags = [ 'add' ];

App.ColorsRoute.model = state => {
    const name = state.params ? state.params.palette : null, data = [];

    if (!name) {
        return data;
    }

    const current = utils.getData(name);

    if (!current) {
        return data;
    }

    for (const c in current.colors) {
        data.push({
            color: c,
            created: current.colors[c].created
        });
    }

    return data.sort(utils.sortByDate);
};

App.ColorsRoute.afterRender = (...args) => {
    App.setTitle(args[0].params.palette || 'Error!');

    App.Global.afterRender(...args);
};

App.ColorsRoute.actions = {
    todetails() {
        const color = $(this).closest('[data-color]').attr('data-color');

        App.transitionTo({
            route: 'details',
            params: { color }
        });
    },
    add(state) {
        const palette = state.params ? state.params.palette : null;
        const data = utils.getData(palette);

        if (!utils.isPro() && data && data.colors && Object.getOwnPropertyNames(data.colors).length >= App.vars.maxColors) {
            utils.showToast({
                body: `Unlock pro to add more than ${App.vars.maxColors} colors.`,
                actions: {
                    unlock: utils.unlockPro
                },
                persistent: true,
                timeout: 5000
            });

            return;
        }

        App.transitionTo({
            route: 'picker',
            params: { palette }
        });
    },
    remove(state) {
        let data;
        let oldcolor;
        const palette = state.params ? state.params.palette : null;
        const color = $(this).closest('[data-color]').attr('data-color');

        utils.removeItem(palette, color, () => {
            data = utils.getData(palette);

            oldcolor = data.colors[color];

            delete data.colors[color];

            utils.setData(palette, data);

            utils.showToast({
                body: `Deleted ${color}. Tap to dismiss.`,
                actions: {
                    undo() {
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
