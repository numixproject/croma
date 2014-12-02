/* jshint browser: true */

var App = require(".././app.js"),
    utils = require(".././utils.js");

function savePalette(state, model) {
    var isPro = utils.isPro(),
        suggested = state.params ? state.params.name : null,
        palette = model.palette,
        name = "_$extracted",
        count = 0,
        data = {
            created: new Date().getTime(),
            loved: false,
            colors: {}
        };

    if (!(palette && palette instanceof Array)) {
        return;
    }

    for (var i = 0, l = palette.length; i < l; i++) {
        if (!isPro && i === App.vars.maxColors) {
            utils.showToast({
                body: "Unlock pro to save more than " + App.vars.maxColors + " colors.",
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
        suggested: suggested
    };
}

App.PaletteShowRoute.model = function(state) {
    var palette = [],
        colors;

    if (!(state.params && state.params.palette)) {
        return;
    }

    colors = utils.queryToPalette(state.params.palette);

    for (var i = 0, l = colors.length; i < l; i++) {
        palette.push({
            color: colors[i].tohex(),
            dark: (colors[i].darkness() > 0.5)
        });
    }

    return {
        name: state.params.name,
        palette: palette
    };
};

App.PaletteShowRoute.render = function(state, model) {
    var html = "";

    if (!model || !model.palette || !(model.palette instanceof Array)) {
        html += [
            "<div class='empty-area fx-fade-in'>",
            "<a class='empty-area-action'>An error occured!</a>",
            "</div>"
        ].join("");

        return html;
    }

    html += "<div class='card-item fx-come-in'>";

    for (var i = 0, l = model.palette.length; i < l; i++) {
        html += [
            "<div class='card-item-color-item " + (model.palette[i].dark ? "card-item-color-item-dark" : "") + "' ",
            "style='background-color:" + model.palette[i].color + "'>" + model.palette[i].color + "</div>"
        ].join("");
    }

    html += [
        "</div>",
        "<div class='paper-button-container fx-come-in'>",
        "<a data-action='save' class='paper-button paper-button-block'>Save as new palette</a>",
        "</div>"
    ].join("");

    if (utils.isPro()) {
        html += [
            "<div class='paper-button-container fx-come-in'>",
            "<a data-action='add' class='paper-button paper-button-block'>Add to existing palette</a>",
            "</div>"
        ].join("");
    }

    return html;
};

App.PaletteShowRoute.afterRender = function(state, model) {
    App.setTitle(model.name || "Colors");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.PaletteShowRoute.actions = {
    save: function(state, model) {
        var data = savePalette(state, model);

        App.trigger("navigate", { route: "palette/name", params: { oldname: data.oldname, suggested: data.suggested } });
    },
    add: function(state, model) {
        var data = savePalette(state, model);

        App.trigger("navigate", { route: "palette/list", params: { oldname: data.oldname, suggested: data.suggested } });
    }
};
