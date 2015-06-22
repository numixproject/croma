var Color = require("pigment/full"),
    App = require("../core/app.js"),
    utils = require("../utils.js"),
    value = "#f06860";

App.PickerRoute.tags = [ "action" ];

function renderHues() {
    var colors = [
            "#f50057", "#db0A5b", "#c51162", "#9c27b0", "#673ab7", "#4b77be", "#2196f3", "#03a9f4", "#00bcd4", "#1bbc9b",
            "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722", "#f44336", "#e00032"
        ],
        c, divs = "";

    for (var i = 0; i < 20; i++) {
        c = new Color(colors[i]);

        divs += '<div class="picker-color-cell" style="background-color: ' + c.tohex() + '" data-hue="' + c.hsl[0] + '"></div>';
    }

    return divs;
}

function renderShades(h) {
    var w = 100, b,
        color,
        divs = "";

    for (var i = 0; i < 8; i++) {
        b = 10;

        for (var j = 0; j < 10; j++) {
            color = new Color("hsl(" + h + "," + w + "," + b + ")").tohex();

            divs += '<div class="picker-color-cell" style="background-color: ' + color + '"></div>';

            b += 9;
        }

        w = w - 12;
    }

    return divs;
}

function setColor(color, update) {
    var $colorbutton = $(".picker-color-button"),
        $text = $(".picker-input");

    if (!(color && color !== "undefined")) {
        return;
    }

    value = new Color(color).tohex();

    if (update !== false) {
        $text.val(value);
    }

    $colorbutton.css({ "background-color": value });
}

function updateColor(target) {
    var $shades = $(".picker-shades"),
        hue = $(target).data("hue"),
        color = $(target).css("background-color");

    setColor(color);

    if (hue) {
        $shades.empty().append(renderShades(hue));
    }
}

App.PickerRoute.afterRender = function(...args) {
    var $picker = $(".picker-wrapper"),
        $hues = $picker.find(".picker-hues"),
        $shades = $picker.find(".picker-shades"),
        $text = $(".picker-input"),
        startEvent = "touchstart mousedown pointerdown",
        moveEvent = "touchmove mousemove pointermove",
        endEvent = "touchend touchleave touchcancel mouseup pointerup";

    setColor(value);

    $hues.empty().append(renderHues());

    $shades.empty().append(renderShades(
        new Color(value).hsl[0]
    ));

    $picker.on(startEvent, function(e) {
        updateColor(e.target);

        $(this).on(moveEvent, function(ev) {
            updateColor(ev.target);
        });
    }).on(endEvent, function() {
        $(this).off(moveEvent);
    });

    $picker.on("click", ".picker-color-cell", function() {
        updateColor(this);
    });

    $text.on("DOMSubtreeModified input paste change", function() {
        var color = $(this).val();

        if (!(color && color.length > 2)) {
            return;
        }

        setColor(color, false);
    });

    App.setTitle("");

    App.Global.afterRender(...args);
};

App.PickerRoute.actions = {
    done: function(state) {
        var palette = state.params ? state.params.palette : null,
            color, data;

        if ((!value) || typeof value !== "string") {
            return;
        }

        color = new Color(value).tohex();

        if (utils.validateName(palette)) {
            data = utils.getData(palette);

            if (data) {
                data.colors = data.colors || {};
                data.colors[color] = {
                    created: new Date().getTime()
                };
            }

            utils.setData(palette, data);

            App.vars.actiondone = true;

            App.transitionTo({
                route: "colors",
                params: { palette: palette }
            });
        } else {
            App.transitionTo({
                route: "palettes",
                params: { color: color }
            });
        }
    }
};
