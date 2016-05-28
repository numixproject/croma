import $ from 'jquery';
import App from '../core/app.js';
import utils from '../utils.js';

App.PaletteNameRoute.tags = [ 'action' ];

App.PaletteNameRoute.model = state => {
    const rename = state.params ? state.params.rename : null;
    const oldname = state.params ? state.params.oldname : null;
    let title;
    let placeholder;

    if (rename) {
        title = 'Rename palette';
        placeholder = `Enter new name for ${oldname}`;
    } else {
        title = 'Add new palette';
        placeholder = 'Enter a name for the palette';
    }

    return {
        title,
        placeholder
    };
};

App.PaletteNameRoute.afterRender = (...args) => {
    const state = args[0], suggested = state.params ? state.params.suggested : null, $input = $('#palette-name');

    // Prefill palette name
    if (utils.validateName(suggested)) {
        $input.val(suggested);
    }

    $input.focus();

    App.setTitle('');

    App.Global.afterRender(...args);
};

App.PaletteNameRoute.actions = {
    done(state) {
        const palette = $('#palette-name').val() || '';
        const oldname = state.params ? state.params.oldname : null;
        let data = {};

        if (!utils.validateName(palette)) {
            utils.showToast({
                body: `Invalid palette name ${palette}.`,
                timeout: 3000
            });

            return;
        }

        if (utils.getData(palette)) {
            utils.showToast({
                body: 'A palette with same name already exists.',
                timeout: 3000
            });

            return;
        }

        if (utils.validateName(oldname, true)) {
            data = utils.getData(oldname) || {};

            utils.setData(oldname);
        }

        utils.setData(palette, data);

        App.vars.actionDone = true;

        App.transitionTo({
            route: 'colors',
            params: { palette }
        });
    }
};
