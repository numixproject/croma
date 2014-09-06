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

		// Delete a color from the UI and database
		deleteItem: function(palette, color) {
			var $el, data;

			if ((!palette) || typeof palette !== "string") {
				return;
			}

			data = croma.getData(palette);

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
		}
	};
}());

module.exports = croma;
