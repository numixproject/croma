import $ from 'jquery';
import Color from 'pigment';
import App from '../core/app.js';
import utils from '../utils.js';

App.DetailsRoute.model = state => {
    const color = state.params ? state.params.color : null;
    const model = {};

    if (!color) {
        return model;
    }

    const colorObj = new Color(color);

    model.hexVal = colorObj.tohex();

    model.strings = [
        { key: 'Name', value: colorObj.toname() },
        { key: 'HEX', value: colorObj.tohex() },
        { key: 'RGB', value: colorObj.torgb() },
        { key: 'HSL', value: colorObj.tohsl() },
        { key: 'HSV', value: colorObj.tohsv() },
        { key: 'HWB', value: colorObj.tohwb() },
        { key: 'CMYK', value: colorObj.tocmyk() },
        { key: 'LAB', value: colorObj.tolab() },
        { key: 'Luminance', value: parseFloat(colorObj.luminance()).toFixed(2) },
        { key: 'Darkness', value: parseFloat(colorObj.darkness()).toFixed(2) }
    ];

    model.copy = utils.copyToClipboard(true);

    return model;
};

App.DetailsRoute.afterRender = (...args) => {
    App.setTitle(args[0].params.color || 'Error!');

    App.Global.afterRender(...args);
};

App.DetailsRoute.actions = {
    topalettes(state) {
        const color = state.params ? state.params.color : null;

        App.transitionTo({
            route: 'palettes',
            params: { color }
        });
    },

    copy() {
        const label = $(this).find('.card-item-label').text(), text = $(this).find('.card-item-value').text();

        utils.copyToClipboard(label, text);
    }
};
