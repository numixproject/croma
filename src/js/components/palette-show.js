import App from '../core/app.js';
import utils from '../utils.js';

function savePalette(state, model) {
    const isPro = utils.isPro();
    const suggested = state.params ? state.params.name : null;
    const palette = model.palette;
    const name = '_$extracted';
    let count = 0;

    const data = {
        created: new Date().getTime(),
        loved: false,
        colors: {}
    };

    if (!Array.isArray(palette)) {
        return {};
    }

    for (let i = 0, l = palette.length; i < l; i++) {
        if (!isPro && i === App.vars.maxColors) {
            utils.showToast({
                body: `Unlock pro to save more than ${App.vars.maxColors} colors.`,
                actions: {
                    unlock: utils.unlockPro
                },
                persistent: true,
                timeout: 5000
            });

            break;
        }

        if (palette[i].color) {
            data.colors[palette[i].color] = {
                created: new Date().getTime() + count
            };
        }

        count++;
    }

    utils.setData(name, data);

    App.vars.actionDone = true;

    return {
        oldname: name,
        suggested
    };
}

App.PaletteShowRoute.model = state => {
    const palette = [];

    if (!(state.params && state.params.palette)) {
        return {};
    }

    const colors = utils.queryToPalette(state.params.palette);

    for (let i = 0, l = colors.length; i < l; i++) {
        palette.push({
            color: colors[i].tohex(),
            dark: (colors[i].darkness() > 0.5)
        });
    }

    return {
        name: state.params.name,
        palette,
        isPro: utils.isPro()
    };
};

App.PaletteShowRoute.afterRender = (...args) => {
    App.setTitle(args[1].name || 'Colors');

    App.Global.afterRender(...args);
};

App.PaletteShowRoute.actions = {
    save(state, model) {
        const data = savePalette(state, model);

        App.transitionTo({
            route: 'palette/name',
            params: {
                oldname: data.oldname,
                suggested: data.suggested
            }
        });
    },
    add(state, model) {
        const data = savePalette(state, model);

        App.transitionTo({
            route: 'palette/list',
            params: {
                oldname: data.oldname,
                suggested: data.suggested
            }
        });
    }
};
