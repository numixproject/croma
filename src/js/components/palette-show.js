/* jshint browser: true */

var App = require(".././framework.js"),
    croma = require(".././croma.js");

function savePalette(state, model) {
    var color,
        isPro = croma.isPro(),
        suggested = state.params.name,
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
        if (!isPro && i === max) {
            croma.showToast({
                body: "Unlock pro to save more than " + max + " colors.",
                actions: {
                    unlock: croma.unlockPro
                },
                persistent: true,
                timeout: 5000
            });

            break;
        }

        color = palette[i].value;

        if (color) {
            data.colors[color] = {
                created: new Date().getTime() + count
            };
        }

        count++;
    }

    croma.setData(name, data);

    return {
        oldname: name,
        suggested: suggested
    };
}

App.PaletteShowRoute.model = function(state) {
    var palette = [],
        colors;

    if (!(state.params && state.params.palette)) {
        App.trigger("navigate", { route: "index" });
    }

    colors = croma.queryToPalette(state.params.palette);

    for (var i = 0, l = colors.length; i < l; i++) {
        palette.push(colors[i].tohex());
    }

    return {
        name: state.params.name,
        palette: palette
    };
};

App.PaletteShowRoute.render = function(state, model) {
    var html = "";

    html += "<div class='card-item fx-animate-in'>";

    for (var i = 0, l = model.palette.length; i < l; i++) {
        html += "<div class='card-item-color-item' style='background-color:" + model.palette[i] + "'>" + model.palette[i] + "</div>";
    }

    html += [
        "</div>",
        "<div class='paper-button-container fx-animate-in'>",
        "<a data-action='save' class='paper-button paper-button-block fx-ripple'>Save as new palette</a>",
        "</div>"
    ].join("");

    if (croma.isPro()) {
        html += [
            "<div class='paper-button-container fx-animate-in'>",
            "<a data-action='add' class='paper-button paper-button-block fx-ripple'>Add to existing palette</a>",
            "</div>"
        ].join("");
    }

    return html;
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
