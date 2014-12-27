/* jshint browser: true */

var App = require("../core/app.js"),
    utils = require("../utils.js");

App.PaletteNameRoute.tags = [ "action" ];

App.PaletteNameRoute.render = function(state, model) {
    var html = "";

    html += [
        "<div class='card-item fx-come-in'>",
        "<div class='card-item-container'>",
        "<div class='card-item-header'>Add new palette</div>",
        "<div class='paper-input-container'>",
        "<input id='palette-name' type='text' placeholder='Enter a name for the palette'",
        "class='card-item-input-block card-item-input-name paper-input' autocapitalize='on' autofocus>",
        "<span class='paper-input-highlight'></span>",
        "<span class='paper-input-bar'></span>",
        "</div></div></div>"
    ].join("");

    return html;
};

App.PaletteNameRoute.afterRender = function(state) {
    var suggested = state.params ? state.params.suggested : null,
        $input = $("#palette-name");

    // Prefill palette name
    if (utils.validateName(suggested)) {
        $input.val(suggested);
    }

    $input.focus();

    App.setTitle("Name your palette");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.PaletteNameRoute.actions = {
    done: function(state) {
        var palette = $("#palette-name").val() || "",
            oldname = state.params ? state.params.oldname : null,
            data = {};

        if (!utils.validateName(palette)) {
            utils.showToast({
                body: "Invalid palette name " + palette + ".",
                timeout: 3000
            });

            return;
        }

        if (utils.getData(palette)) {
            utils.showToast({
                body: "A palette with same name already exists.",
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
            route: "colors",
            params: { palette: palette }
        });
    }
};
