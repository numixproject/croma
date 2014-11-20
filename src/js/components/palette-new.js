/* jshint browser: true */

var App = require(".././app.js"),
    utils = require(".././utils.js");

App.PaletteNewRoute.tags = [ "new" ];

App.PaletteNewRoute.render = function(state, model) {
    var html = "";

    html += "<div class='section-content-center'><div class='section-content-center-inner'>";

    if (utils.getPalette(true)) {
        html += [
            "<div class='paper-button-container fx-animate-in'>",
            "<a data-action='getpalette' class='paper-button paper-button-block fx-ripple'>",
            "Get palette from image",
            "</a></div>"
        ].join("");
    }

    html += [
        "<div class='paper-button-container fx-animate-in'>",
        "<div class='paper-button paper-button-block fx-ripple' data-action='topicker'>",
        "Get palette from color",
        "</div></div>",
        "<div class='paper-button-container fx-animate-in'>",
        "<div class='paper-button paper-button-block fx-ripple' data-action='topalettename'>",
        "Add colors manually",
        "</div></div>"
    ].join("");

    if (!utils.isPro()) {
        html += [
            "<div class='paper-button-container fx-animate-in unlock'>",
            "<a data-action='unlockpro' class='paper-button paper-button-block fx-ripple'>",
            "Unlock pro",
            "</a></div>"
        ].join("");
    }

    html += "</div></div>";

    return html;
};

App.PaletteNewRoute.actions = {
    topicker: function() {
        App.trigger("navigate", { route: "picker" });
    },
    topalettename: function() {
        App.trigger("navigate", { route: "palette/name" });
    },
    getpalette: utils.getPalette,
    unlockpro: utils.unlockPro
};
