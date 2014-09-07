/* jshint browser: true */
/* global $ */

var Picker = (function() {
	var Color = require("./color.js"),
		getPosition = require("./position.js");

	return function() {
		var _this = this;

		_this.value = "#f06860";

		_this.getColor = function(position, canvas) {
			var imageData = $(canvas).get(0).getContext("2d").getImageData(position[0], position[1], 1, 1).data,
				color = "rgb(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ")";

			return color;
		};

		_this.drawSheet = function(sheet, width, height) {
			var gradient = sheet.createLinearGradient(0, 0, width, 0);

			sheet.canvas.width = width;
			sheet.canvas.height = height;

			gradient.addColorStop(0.00, "rgb(255,   0,   0)");
			gradient.addColorStop(0.15, "rgb(255,   0, 255)");
			gradient.addColorStop(0.33, "rgb(0,     0, 255)");
			gradient.addColorStop(0.49, "rgb(0,   255, 255)");
			gradient.addColorStop(0.67, "rgb(0,   255,   0)");
			gradient.addColorStop(0.84, "rgb(255, 255,   0)");
			gradient.addColorStop(1.00, "rgb(255,   0,   0)");

			sheet.fillStyle = gradient;
			sheet.fillRect(0, 0, sheet.canvas.width, sheet.canvas.height);

			gradient = sheet.createLinearGradient(0, 0, 0, height);
			gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
			gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
			gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
			gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

			sheet.fillStyle = gradient;
			sheet.fillRect(0, 0, sheet.canvas.width, sheet.canvas.height);
		};

		_this.showPicker = function() {
			var $picker = $(".picker-canvas"),
				$text = $(".picker-input"),
				$canvas = $picker.find("canvas"),
				$parent = $canvas.parent(),
				sheet, gradient;

			sheet = $canvas.get(0).getContext("2d");

			_this.drawSheet(sheet, $parent.innerWidth(), $parent.innerHeight());

			_this.setColor(_this.value);

			$text.focus();

			$(window).on("resize", function() {
				clearTimeout($(this).data("resizeTimer"));

				$(this).data("resizeTimer", setTimeout(function() {
					$parent = $canvas.parent();

					_this.drawSheet(sheet, $parent.innerWidth(), $parent.innerHeight());
				}, 250));
			});

			$canvas.on("click", function(e) {
				var value = _this.getColor(getPosition(e), $canvas),
					color = new Color(value).tohex();

				_this.setColor(value);
			});

			$text.on("DOMSubtreeModified input paste change", function() {
				var value = $(this).val();

				_this.setColor(value, false);
			});
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
