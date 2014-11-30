/* jshint browser: true */

var App = require(".././app.js"),
    Color = require(".././color.js"),
    utils = require(".././utils.js"),
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
    var s = 100, l,
        color,
        divs = "";

    for (var i = 0; i < 8; i++) {
        l = 10;

        for (var j = 0; j < 10; j++) {
            color = new Color({
                hsl: [ h, s, l ]
            }).tohex();

            divs += '<div class="picker-color-cell" style="background-color: ' + color + '"></div>';

            l += 9;
        }

        s = s - 12;
    }

    return divs;
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

App.PickerRoute.render = function() {
    var html = "";

    html += [
        "<div class='card-item'>",
        "<div class='card-item-picker fx-ripple' data-color='rgba(255,255,255,0.1)'>",
        "<div class='picker-wrapper'>",
        "<div class='picker-row picker-hues'></div>",
        "<div class='picker-row picker-shades'></div>",
        "</div></div>",
         "<div class='card-item-segment'>",
         "<div class='card-item-container card-item-input-wrap'>",
         "<div class='paper-input-container'>",
         "<input type='text' class='card-item-input picker-input paper-input' placeholder='Enter a color' autofocus>",
         "<span class='paper-input-highlight'></span>",
         "<span class='paper-input-bar'></span>",
         "</div></div>",
         "<div class='card-item-color-button picker-color-button'></div>",
         "</div></div>"
    ].join("");

    return html;
};

App.PickerRoute.afterRender = function() {
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

        $(this).on(moveEvent, function(e) {
            updateColor(e.target);
        });
    }).on(endEvent, function() {
        $(this).off(moveEvent);
    });

    $picker.on("click", ".picker-color-cell", function() {
        updateColor(this);
    });

    $text.on("DOMSubtreeModified input paste change", function() {
        var value = $(this).val();

        if (!(value && value.length > 2)) {
            return;
        }

        setColor(value, false);
    });

    App.setTitle("Pick a color");

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
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

            actiondone = true;

            App.trigger("navigate", { route: "colors", params: { palette: palette } });
        } else {
            App.trigger("navigate", { route: "palettes", params: { color: color } });
        }
    }
};
