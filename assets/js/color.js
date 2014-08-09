/* jshint indent: 4 */

var Color = (function() {
    var utils = {
        rgbToHsl: function(values) {
			var r = values[0] / 255,
                g = values[1] / 255,
                b = values[2] / 255,
                max = Math.max(r, g, b),
				min = Math.min(r, g, b),
                h, s, l = (max + min) / 2,
                d = max - min;

			if (max === min) {
				h = s = 0;
			} else {
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

				switch (max) {
                    case r:
                        h = ((g - b) / d) + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = ((b - r) / d) + 2;
                        break;
                    case b:
                        h = ((r - g) / d) + 4;
                        break;
				}

				h = h / 6;
			}

			return [ h, s, l ];
        },

		hslToRgb: function(values) {
			var h = values[0],
                s = values[1],
                l = values[2],
                r, g, b,
                p, q,
                hue2Rgb = function(p, q, t) {
                    if (t < 0) {
                        t += 1;
                    } else if (t > 1) {
                        t -= 1;
                    }

                    if (t < (1 / 6)) {
                        return p + ((q - p) * 6 * t);
                    }

                    if (t < (1 / 2)) {
                        return q;
                    }

                    if (t < (2 / 3)) {
                        return p + ((q - p) * ((2 / 3) - t) * 6);
                    }

                    return p;
                };

			if (s === 0) {
				r = g = b = l;
			} else {
                q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                p = 2 * l - q;

				r = hue2Rgb(p, q, h + 1 / 3);
				g = hue2Rgb(p, q, h);
				b = hue2Rgb(p, q, h - 1 / 3);
			}

			return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)
            ];
		},

        rgbToHsv: function(values) {
			var r = values[0] / 255,
                g = values[1] / 255,
                b = values[2] / 255,
                max = Math.max(r, g, b),
				min = Math.min(r, g, b),
                h, s, v = max,
                d = max - min;

            s = (max === 0) ? 0 : d / max;

            if (max == min){
                h = 0;
            } else {
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }

                h = h / 6;
            }

            return [ h, s, v ];
        },

        hsvToRgb: function(values) {
			var h = values[0],
                s = values[1],
                v = values[2],
                r, g, b,
                i = Math.floor(h * 6),
                f = h * 6 - i,
                p = v * (1 - s),
                q = v * (1 - f * s),
                t = v * (1 - (1 - f) * s);

            switch (i % 6){
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }

			return [
                Math.round(r * 255),
                Math.round(g * 255),
                Math.round(b * 255)
            ];
        },

        getType: function(color) {
            if ((/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i).test(color)) {
                return "rgb";
            } else if ((/^hsla?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i).test(color)) {
                return "hsl";
            } else if ((/^hsva?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i).test(color)) {
                return "hsv";
            } else if ((/(^#[0-9a-f]{6}$)|(^#[0-9a-f]{3}$)/i).test(color)) {
                return "hex";
            }
        }
    };

    return function(color) {
        var _this = this,
            hex, rgb, hsl, hsv,
            type;

		if (!color) {
			color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
		}

		type = utils.getType(color);

        // Values
        if (type === "hex" || type === "rgb") {
            if (type === "hex") {
				if (color.length === 4) {
					color = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
						return "#" + r + r + g + g + b + b;
					});
				}

                hex = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(color);

                _this.rgb = [
                    parseInt(hex[1], 16),
                    parseInt(hex[2], 16),
                    parseInt(hex[3], 16)
                ];
            } else if (type === "rgb") {
				_this.rgb = color.replace(/[rgba()]/g, "").split(",").slice(0, 3);
            }

            _this.hsl = utils.rgbToHsl(_this.rgb);
            _this.hsv = utils.rgbToHsv(_this.rgb);
        } else if (type === "hsl") {
			_this.hsl = color.replace(/[hsla()]/g, "").split(",").slice(0, 3);
            _this.rgb = utils.hslToRgb(_this.hsl);
            _this.hsv = utils.rgbToHsv(_this.rgb);
        } else if (type === "hsv") {
			_this.hsv = color.replace(/[hsva()]/g, "").split(",").slice(0, 3);
            _this.rgb = utils.hslToRgb(_this.hsv);
            _this.hsl = utils.rgbToHsv(_this.rgb);
        } else {
            _this.rgb = [ 0, 0, 0 ];
            _this.hsl = [ 0, 0, 0 ];
            _this.hsv = [ 0, 0, 0 ];
		}

        // Methods
        _this.tohex = function() {
            var r = ("0" + parseInt(_this.rgb[0], 10).toString(16)).slice(-2),
                g = ("0" + parseInt(_this.rgb[1], 10).toString(16)).slice(-2),
                b = ("0" + parseInt(_this.rgb[2], 10).toString(16)).slice(-2);

            return "#" + r + g + b;
        };

        _this.torgb = function() {
            return "rgb(" + _this.rgb[0] + "," + _this.rgb[1] + "," + _this.rgb[2] + ")";
        };

        _this.tohsl = function() {
            return "hsl(" + _this.hsl[0] + "," + _this.hsl[1] + "," + _this.hsl[2] + ")";
        };

        _this.tohsv = function() {
            return "hsv(" + _this.hsv[0] + "," + _this.hsv[1] + "," + _this.hsv[2] + ")";
        };
    };
}());
