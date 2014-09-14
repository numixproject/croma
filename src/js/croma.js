/* jshint browser: true */
/* global $ */

var croma = (function() {
	var Color = require("./color.js"),
		storage = require("./storage");

	return {

		// Convert camelCase to sentence
		parseCamelCase: function(text) {
				if ((!text) || typeof text !== "string") {
				return "";
			}

			return text.replace(/([a-z])([A-Z])/g, '$1 $2')
			.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
			.replace(/^./, function(str) { return str.toUpperCase(); });
		},

		getData: function(palette) {
			var palettes = storage.get("palettes") || {};

			if (palette) {
				return palettes[palette];
			} else {
				return palettes;
			}
		},

		setData: function(palette, data) {
			var palettes = croma.getData(),
				current;

			if ((!palette) || typeof palette !== "string") {
				return;
			}

			if (data) {
				palettes[palette] = data;
			} else {
				delete palettes[palette];
			}

			return storage.set("palettes", palettes);
		},

		// Remove a color from the UI and database
		removeItem: function(palette, color) {
			var $el, olddata, data;

			if ((!palette) || typeof palette !== "string") {
				return;
			}

			olddata = croma.getData(palette);

			data = $.extend({}, olddata);

			if (color) {
				delete data.colors[color];

				$el = $("[data-palette='" + palette + "'][data-color='" + color + "']");
			} else {
				data = null;

				$el = $("[data-palette='" + palette + "']");
			}

			croma.setData(palette, data);

			// Swipe out the card
			$el.velocity({
				translateX: "100%",
				opacity: 0
			}, {
				duration: 300,
				easing: [ 0.7, 0.1, 0.57, 0.79 ]
			}).velocity({
				height: 0,
				paddingTop: 0,
				paddingBottom: 0
			}, {
				duration: 150,
				complete: function() {
					$(this).remove();
				}
			});

			croma.showToast({
				body: "Deleted " + palette,
				actions: {
					undo: function() {
						croma.setData(palette, olddata);
					}
				}
			});
		},

		// Toggle love color in the UI and database
		loveItem: function(palette) {
			var $card, $button,
				data;

			if ((!palette) || typeof palette !== "string") {
				return;
			}

			data = croma.getData(palette);

			if (!data) {
				return;
			}

			$card = $("[data-palette='" + palette + "']");

			$button = $card.find(".card-item-action-love");

			// Add class to animate the click
			$button.addClass("clicked");

			setTimeout(function() {
				$button.removeClass("clicked");
			}, 500);

			// Toggle love
			if (data.loved) {
				$card.removeClass("card-item-loved");

				data.loved = false;
			} else {
				$card.addClass("card-item-loved");

				data.loved = true;
			}

			croma.setData(palette, data);
		},

		// Trigger a file download
		downloadFile: function(filename, content) {
			var el = document.createElement("a");

			el.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
			el.setAttribute("download", filename);
			el.click();
		},

		// Convert color hashmap to human readable text
		paletteToText: function(palette, colors) {
			var content = [
				"Name: " + palette + "\n",
				"Colors:"
			];

			for (var c in colors) {
				content.push(c);
			}

			return content.join("\n") + "\n";
		},

		// Convert color hashmap to link
		paletteToPath: function(colors) {
			var rgb,
				path = "#/palette/show?palette=";

			for (var c in colors) {
				rgb = new Color(c).rgb;

				path += rgb.join(",") + "|";
			}

			return path;
		},

		// Convert colors hashmap to GIMP Palette
		paletteToGPL: function(palette, colors) {
			var rgb,
				content = [
				"GIMP Palette",
				"Name: " + palette,
				"Columns: 4",
				"#"
			];

			for (var c in colors) {
				rgb = new Color(c).rgb;

				content.push(
					rgb.join("\t") + "\t" + c
				);
			}

			return content.join("\n") + "\n";
		},

		// Share a palette
		shareItem: function(palette) {
			var data;

			if ((!palette) || typeof palette !== "string") {
				return;
			}

			data = croma.getData(palette);

			if ("androidUtils" in window && androidUtils.shareWithLink) {
				androidUtils.shareWithLink("Share palette", croma.paletteToText(palette, data.colors), croma.paletteToPath(data.colors));
			} else {
				croma.downloadFile(palette + ".gpl", croma.paletteToGPL(palette, data.colors));
			}
		},

		// Get palette from an image
		getPalette: function(check) {
				var supported = ("imageUtils" in window && imageUtils.getPalette);

				if (check) {
				return supported;
			}

			if (supported) {
				imageUtils.getPalette();
			}
		},

		// Validate name
		validateName: function(name, tmp) {
			return ((name && name !== "undefined" && name !== "null") && (tmp || !(/^_\$.*/).test(name)));
		},

		// Show a toast
		// @param {{ body: String, actions: Object, timeout: Number }} options
		showToast: function(options) {
			var $toast,
				$wrapper = $(".toast-notification-wrapper"),
				$container = $wrapper.find(".toast-notification-container"),
				$segment;

			if (!$wrapper.length) {
				$wrapper = $("<div>").addClass("toast-notification-wrapper");
				$wrapper.appendTo("body");
			}

			if (!$container.length) {
				$container = $("<div>").addClass("toast-notification-container");
				$container.appendTo($wrapper);
			}

			$toast = $("<div>")
			.addClass("toast-notification");

			$segment = $("<div>").addClass("toast-notification-segment").html(options.body).appendTo($toast);

			if (options.actions) {
				for (var action in options.actions) {
					if (typeof options.actions[action] === "function") {
						$toast.append(
							$("<div>").addClass("toast-notification-segment toast-notification-action toast-notification-action-" + action)
							.text(action)
							.on("click", options.actions[action])
						);
					}
				}
			}

			$toast.find(".toast-notification-segment").on("click", function() {
				$toast.remove();
			});

			$toast.appendTo($container);

			if (options.timeout) {
				setTimeout(function() {
					$toast.remove();
				}, options.timeout);
			}

			return $toast;
		}
	};
}());

module.exports = croma;
