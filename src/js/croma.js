/* jshint browser: true */
/* global $, Color, storage */

window.croma = {

	// Convert camelCase to sentence
	parseCamelCase: function(text) {
			if ((!text) || typeof text !== "string") {
			return "";
		}

		return text.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
		.replace(/^./, function(str) { return str.toUpperCase(); });
	},

	// Delete a color from the UI and database
	deleteItem: function(palette, color) {
		var $el, palettes, current;

		if ((!palette) || typeof palette !== "string") {
			return;
		}

		palettes = storage.get("palettes");

		if (color) {
			if (palettes) {
				current = palettes[palette];
			} else {
				return;
			}

			if (current) {
				delete palettes[palette].colors[color];
			}

			$el = $("[data-palette=" + palette + "][data-color=" + color + "]");
		} else {
			if (palettes) {
				delete palettes[palette];
			}

			$el = $("[data-palette=" + palette + "]");
		}

		storage.set("palettes", palettes);

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
			duration: 300,
			complete: function() {
				$(this).remove();
			}
		});
	},

	// Toggle love color in the UI and database
	loveItem: function(palette) {
		var $card, $button,
			palettes, current;

		if ((!palette) || typeof palette !== "string") {
			return;
		}

		palettes = storage.get("palettes");

		if (palettes) {
			current = palettes[palette];
		} else {
			return;
		}

		$card = $("[data-palette=" + palette + "]");

		$button = $card.find(".card-item-action-love");

		// Add class to animate the click
		$button.addClass("clicked");

		setTimeout(function() {
			$button.removeClass("clicked");
		}, 500);

		// Toggle love
		if (current.loved) {
			$card.removeClass("card-item-loved");

			palettes[palette].loved = false;
		} else {
			$card.addClass("card-item-loved");

			palettes[palette].loved = true;
		}

		storage.set("palettes", palettes);
	}
};
