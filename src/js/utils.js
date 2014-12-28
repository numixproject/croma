/* jshint browser: true */
/* global $ */

var utils = (function() {
	var Color = require("./core/color.js"),
		storage = require("./core/storage.js"),
		fxos = require("./fxos.js"),
		productId = "ultimate";

	return {

		// Convert camelCase to sentence
		parseCamelCase: function(text) {
			if (typeof text !== "string") {
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
			var palettes;

			if (!palette) {
				return;
			}

			palettes = utils.getData();

			if (typeof data === "undefined" || data === null) {
				delete palettes[palette];
			} else {
				palettes[palette] = data;
			}

			return storage.set("palettes", palettes);
		},

		// Remove a card from the UI
		removeItem: function(palette, color, callback) {
			var $el;

			if (typeof palette !== "string") {
				return;
			}

			if (color) {
				$el = $('[data-color="' + color + '"]');
			} else {
				$el = $('[data-palette="' + palette + '"]');
			}

			// Let's save the styles so we can undo them
			$el.data("styles", {
				height: $el.css("height"),
				paddingTop: $el.css("padding-top"),
				paddingBottom: $el.css("padding-bottom"),
				marginTop: $el.css("margin-top"),
				marginBottom: $el.css("margin-bottom")
			});

			// Swipe out the card
			$el.velocity({
				opacity: 0,
				translateX: "100%"
			}, {
				duration: 300,
				easing: [ 0.7, 0.1, 0.57, 0.79 ]
			}).velocity({
				height: 0,
				paddingTop: 0,
				paddingBottom: 0,
				marginTop: 0,
				marginBottom: 0,
				translateX: 0
			}, {
				duration: 150,
				complete: function() {
					if (callback && typeof callback === "function") {
						callback();
					}
				}
			});
		},

		// Undo remove a card from the UI
		undoRemoveItem: function(palette, color, callback) {
			var $el;

			if (typeof palette !== "string") {
				return;
			}

			if (color) {
				$el = $('[data-color="' + color + '"]');
			} else {
				$el = $('[data-palette="' + palette + '"]');
			}

			// Restore the card
			$el.velocity(
				$el.data("styles"), 150
			).velocity({ opacity: 1 }, {
				duration: 150,
				complete: function() {
					if (callback && typeof callback === "function") {
						callback();
					}
				}
			});
		},

		// Toggle love color in the UI and database
		loveItem: function(palette) {
			var $card, $button;

			if (typeof palette !== "string") {
				return;
			}

			$card = $('[data-palette="' + palette + '"]');

			$button = $card.find(".card-item-action-love");

			// Add class to animate the click
			$button.addClass("clicked");

			setTimeout(function() {
				$button.removeClass("clicked");
			}, 500);

			// Toggle love
			$card.toggleClass("card-item-loved");
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

		// Convert query parameter to array
		queryToPalette: function(query) {
			var colors, objs = [];

			query = decodeURIComponent(query);

			if ((/^(([0-9]{1,3},){2}[0-9]{1,3}[\:])+[\:]?$/).test(query + ":")) {
				colors = query.replace(/\:$/, "").split(":");

				for (var i = 0, l = colors.length; i < l; i++) {
					objs.push(new Color({
						rgb: colors[i].split(",")
					}));
				}

				return objs;
			} else {
				return Color.parse(query);
			}
		},

		// Convert color hashmap to query parameter
		paletteToQuery: function(colors) {
			var rgb, query = "";

			for (var c in colors) {
				rgb = new Color(c).rgb;

				query += rgb.join(",") + ":";
			}

			return encodeURI(query);
		},

		// Convert color hashmap to link
		paletteToPath: function(colors, name) {
			var path = "#/palette/show?";

			if (name) {
				path += "name=" + encodeURIComponent(name) + "&";
			}

			path += "palette=" + utils.paletteToQuery(colors);

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

			data = utils.getData(palette);

			if ("androidTools" in window && androidTools.shareWithLink) {
				try {
					androidTools.shareWithLink("Share palette", utils.paletteToText(palette, data.colors), utils.paletteToPath(data.colors, palette));
				} catch (e) {
					utils.showToast({
						body: e,
						timeout: 3000
					});
				}
			} else if (fxos.supported) {
				fxos.shareWithLink("Share palette", utils.paletteToText(palette, data.colors), utils.paletteToPath(data.colors, palette));
			} else {
				utils.downloadFile(palette + ".gpl", utils.paletteToGPL(palette, data.colors));
			}
		},

		// Get palette from an image
		getPalette: function(check) {
			var supported = ("imageUtils" in window && imageUtils.getPalette);

			if (check === true) {
				return supported;
			}

			if (supported) {
				try {
					imageUtils.getPalette();
				} catch (e) {
					utils.showToast({
						body: e,
						timeout: 3000
					});
				}
			}
		},

		// Copy text to clipboard
		copyToClipboard: function(label, text) {
			var supported = ("androidTools" in window && androidTools.copyToClipboard);

			if (label === true) {
				return supported;
			}

			if (supported) {
				try {
					androidTools.copyToClipboard(label, text);
				} catch (e) {
					utils.showToast({
						body: e,
						timeout: 3000
					});
				}
			}
		},

		// Check if pro version
		isPro: function() {
			var purchased = false;

			if ("inAppBilling" in window && inAppBilling.isPurchased) {
				try {
					purchased = (inAppBilling.isPurchased(productId) === "true") ? true : false;
				} catch (e) {
					purchased = false;
				}
			} else {
				purchased = true;
			}

			return purchased;
		},

		// Unlock pro version with IAP
		unlockPro: function() {
			var supported = ("inAppBilling" in window && inAppBilling.purchase);

			if (supported) {
				try {
					inAppBilling.purchase(productId);
				} catch (e) {
					utils.showToast({
						body: e,
						timeout: 3000
					});
				}
			} else {
				location.href = "https://play.google.com/store/apps/details?id=org.numixproject.croma";
			}
		},

		// Show a toast
		// @param {{ body: String, actions: Object, timeout: Number, persistent: Boolean }} options
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

			$toast = $("<div>").addClass("toast-notification");

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

			if (options.persistent) {
				$toast.addClass("toast-persistent");
			}

			$toast.on("click", function() {
				utils.hideToast(this);
			}).appendTo($container);

			if (options.timeout) {
				setTimeout(function() {
					utils.hideToast($toast);
				}, options.timeout);
			}

			$(window).off("hashchange.toast").on("hashchange.toast", function(e) {
				var event = e.originalEvent;

				this.source = e.type;

				if (event && event.oldURL.replace("#/", "") !== event.newURL.replace("#/", "")) {
					utils.hideToast.apply(this);
				}
			});

			return $toast;
		},

		// Hide toast
		hideToast: function(el, duration) {
			var $el = el ? $(el) : (this.source === "hashchange") ? $(".toast-notification:not(.toast-persistent)") : $(".toast-notification");

			duration = duration || 300;

			if ($.fn.velocity) {
				$el.velocity({
					opacity: 0
				}, (duration / 2)).velocity({
					height: 0,
					paddingTop: 0,
					paddingBottom: 0,
					marginTop: 0,
					marginBottom: 0
				}, (duration / 2), function() {
					$(this).remove();
				});
			} else {
				$el.remove();
			}
		},

		// Genrate legacy webkit gradient
		makeWebkitGradient: function(colors, direction) {
			var css;

			css = "-webkit-gradient(linear," + ((direction === "to bottom") ? "left top,left bottom" : "left top,right top") + ",";

			for (var i = 0, l = colors.length; i < l; i++) {
				css += "color-stop(" + ((i / l) * 100) + "%," + colors[i] + ")," + "color-stop(" + (((i + 1) / l) * 100) + "%," +
						colors[i] + ")" + ((i === (l - 1)) ? "" : ",");
			}

			css += ")";

			return css;

		},

		// Generate CSS gradient
		makeGradient: function(colors, direction) {
			var css;

			css = "linear-gradient(" + (direction ? direction : "to right") + ",";

			for (var i = 0, l = colors.length; i < l; i++) {
				css += colors[i] + " " + ((i / l) * 100) + "%," + colors[i] + " " + (((i + 1) / l) * 100) + "%" + ((i === (l - 1)) ? "" : ",");
			}

			css += ")";

			return css;
		},

		// Prefix CSS properties
		prefixCss: function(property, value) {
			var prefixes = [ "-webkit-", "-moz-", "-o-", "" ],
				css = "";

			for (var i = 0, l = prefixes.length; i < l; i++) {
				css += property + ":" + prefixes[i] + value + ";";
			}

			return css;
		},

		generateBackground: function(colors, direction) {
			if (!colors instanceof Array) {
				return;
			}

			return "background-image:" + utils.makeWebkitGradient(colors, direction) + ";" +
					utils.prefixCss("background-image", utils.makeGradient(colors, direction)) + ";";
		},

		sortByDate: function(a, b) {
			if (a.created > b.created) {
				return -1;
			} else if (a.created < b.created) {
				return 1;
			} else {
				return 0;
			}
		},

		validateName: function(name, tmp) {
			return ((name && typeof name === "string" && !(/^(null|undefined)$/).test(name)) && (tmp || !(/(^_\$.*|"|'|<|>)/).test(name)));
		}
	};
}());

module.exports = utils;
