/* jshint browser: true */
/* global $ */

var Picker = (function() {
	var Color = require("./color.js");

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

	return function() {
		var _this = this;

		_this.value = "#f06860";

		_this.showPicker = function() {
			var $picker = $(".picker-wrapper"),
				$hues = $picker.find(".picker-hues"),
				$shades = $picker.find(".picker-shades"),
				$text = $(".picker-input"),
				startEvent = "touchstart mousedown pointerdown",
				moveEvent = "touchmove mousemove pointermove",
				endEvent = "touchend touchleave touchcancel mouseup pointerup",
				colorTimer;

			_this.setColor(_this.value);

			$hues.empty().append(renderHues());
			$shades.empty().append(renderShades(348));

			$picker.on(startEvent, function(e) {
				_this.updateColor(e.target);

				$(this).on(moveEvent, function(e) {
					_this.updateColor(e.target);
				});
			}).on(endEvent, function() {
				$(this).off(moveEvent);

				clearInterval(colorTimer);
			});

			$picker.on("click", ".picker-color-cell", function() {
				_this.updateColor(this);
			});

			$text.on("DOMSubtreeModified input paste change", function() {
				var value = $(this).val();

				_this.setColor(value, false);
			});
		};

		_this.updateColor = function(target) {
			var $shades = $(".picker-shades"),
				hue = $(target).data("hue"),
				color = $(target).css("background-color");

			_this.setColor(color);

			if (hue) {
				$shades.empty().append(renderShades(hue));
			}
		};

		_this.setColor = function(value, update) {
			var $colorbutton = $(".picker-color-button"),
				$text = $(".picker-input"),
				color;

			if (!(value && value !== "undefined")) {
				return;
			}

			color = new Color(value).tohex();

			if (update !== false) {
				$text.val(color);
			}

			_this.value = color;

			$colorbutton.css({ "background-color": color });
		};
	};
}());

module.exports = new Picker();
