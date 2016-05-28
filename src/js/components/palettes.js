import $ from 'jquery';
import Color from 'pigment/full';
import App from '../core/app.js';
import utils from '../utils.js';

App.PalettesRoute.model = state => {
    const model = {};
    const isPro = utils.isPro();
    const color = state.params ? state.params.color : null;

    let objs;
    let arr;

    if (!color) {
        return model;
    }

    const colorObj = new Color(color);

    model.hexVal = colorObj.tohex();

    model.palettes = [];

    for (const i in colorObj) {
        if ((/.*scheme$/i).test(i) && typeof colorObj[i] === 'function') {
            objs = (!isPro && i.toLowerCase() === 'monochromaticscheme') ? colorObj[i](App.vars.maxColors) : colorObj[i]();

            if (!isPro && objs.length > App.vars.maxColors) {
                continue;
            }

            // For the first color, push our initial color to retain it
            // While palette generation, the hex value might change a bit
            // Don't do this for monochromatic since the first color is not the color we passed
            arr = (i.toLowerCase() === 'monochromaticscheme') ? [ objs[0].tohex() ] : [ model.hexVal ];

            for (let j = 1; j < objs.length; j++) {
                arr.push(objs[j].tohex());
            }

            model.palettes.push({
                colors: arr,
                name: utils.parseCamelCase(i).replace(/scheme/i, '').trim(),
                background: utils.generateBackground(arr)
            });
        }
    }

    return model;
};

App.PalettesRoute.afterRender = (...args) => {
    App.setTitle('Palettes');

    App.Global.afterRender(...args);
};

App.PalettesRoute.actions = {
    save(state, model) {
        const map = {};
        const index = $(this).closest('[data-index]').attr('data-index');
        const colors = model.palettes[index].colors;

        if (!Array.isArray(colors)) {
            return;
        }

        for (let i = 0, l = colors.length; i < l; i++) {
            map[colors[i]] = true;
        }

        const query = utils.paletteToQuery(map);

        App.transitionTo({
            route: 'palette/show',
            params: { palette: query }
        });
    }
};
