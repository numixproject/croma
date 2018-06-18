import $ from 'jquery';
import App from '.././core/app';
import utils from '.././utils';

App.IndexRoute.tags = [ 'home', 'add' ];

App.IndexRoute.model = () => {
    const palettes = utils.getData();

    if (!palettes) { return {}; }

    const data = [];

    for (const p in palettes) {
        // Exclude names beginning with "_$"
        if (!(palettes[p] && utils.validateName(p))) {
            continue;
        }

        const arr = [];

        if (palettes[p].colors) {
            for (const c in palettes[p].colors) {
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
        share: !('external' in window && window.external && 'getUnityObject' in window.external && window.external.getUnityObject('1.0'))
    };
};

App.IndexRoute.afterRender = (...args) => {
    App.setTitle('Croma');

    App.Global.afterRender(...args);
};

App.IndexRoute.actions = {
    tocolors() {
        const palette = $(this).closest('[data-palette]').attr('data-palette');

        App.transitionTo({
            route: 'colors',
            params: { palette }
        });
    },
    edit() {
        const palette = $(this).closest('[data-palette]').attr('data-palette');

        App.transitionTo({
            route: 'palette/name',
            params: {
                oldname: palette,
                rename: true
            }
        });
    },
    add() {
        App.transitionTo({
            route: 'palette/new'
        });
    },
    share() {
        const palette = $(this).closest('[data-palette]').attr('data-palette');

        utils.shareItem(palette);
    },
    remove() {
        const palette = $(this).closest('[data-palette]').attr('data-palette'), data = utils.getData(palette);

        utils.setData(palette);
        utils.removeItem(palette, false, () => {
            utils.showToast({
                body: `Deleted ${palette}. Tap to dismiss.`,
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
