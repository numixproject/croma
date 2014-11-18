/* jshint browser: true */

var App = require(".././framework.js"),
    Color = require(".././color.js"),
    croma = require(".././croma.js"),
    value = "#f06860";

function renderHues() {
    var vals = [ 288, 312, 348, 36, 60, 96, 144, 180, 204, 264, 300, 336, 24, 48, 84, 120, 156, 192, 216, 276 ],
        h = 0, s = 100, l = 50,
        color, divs = "";

    for (var i = 0; i < 20; i++) {
        h = vals[i];

        color = new Color({
            hsl: [ h, s, l ]
        }).tohex();

        divs += '<div class="picker-color-cell" style="background-color: ' + color + '" data-hue="' + h + '"></div>';
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
        "<div class='card-item fx-animate-in'>",
        "<div class='card-item-picker fx-ripple'>",
        "<div class='picker-wrapper'>",
        "<div class='picker-hues'></div>",
        "<div class='picker-shades'></div>",
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
        endEvent = "touchend touchleave touchcancel mouseup pointerup",
        colorTimer;

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

        clearInterval(colorTimer);
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

    App.Global.afterRender.apply(this, Array.prototype.slice.call(arguments));
};

App.PickerRoute.actions = {
    done: function(state) {
        var palette = state.params ? state.params.palette : null,
            color, data;

        console.log(palette);

        if ((!value) || typeof value !== "string") {
            return;
        }

        color = new Color(value).tohex();

        if (croma.validateName(palette)) {
            data = croma.getData(palette);

            if (data) {
                data.colors = data.colors || {};
                data.colors[color] = {
                    created: new Date().getTime()
                };
            }

            croma.setData(palette, data);

            actiondone = true;

            App.trigger("navigate", { route: "colors", params: { palette: palette } });
        } else {
            App.trigger("navigate", { route: "palettes", params: { color: color } });
        }
    }
};
