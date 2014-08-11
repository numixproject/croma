/* jshint indent: 4 */

var Color = (function() {
    var _names = {
            aliceblue: [ 240, 248, 255 ],
            antiquewhite: [ 250, 235, 215 ],
            aqua: [ 0, 255, 255 ],
            aquamarine: [ 127, 255, 212 ],
            azure: [ 240, 255, 255 ],
            beige: [ 245, 245, 220 ],
            bisque: [ 255, 228, 196 ],
            black: [ 0, 0, 0 ],
            blanchedalmond: [ 255, 235, 205 ],
            blue: [ 0, 0, 255 ],
            blueviolet: [ 138, 43, 226 ],
            brown: [ 165, 42, 42 ],
            burlywood: [ 222, 184, 135 ],
            cadetblue: [ 95, 158, 160 ],
            chartreuse: [ 127, 255, 0 ],
            chocolate: [ 210, 105, 30 ],
            coral: [ 255, 127, 80 ],
            cornflowerblue: [ 100, 149, 237 ],
            cornsilk: [ 255, 248, 220 ],
            crimson: [ 220, 20, 60 ],
            cyan: [ 0, 255, 255 ],
            darkblue: [ 0, 0, 139 ],
            darkcyan: [ 0, 139, 139 ],
            darkgoldenrod: [ 184, 134, 11 ],
            darkgray: [ 169, 169, 169 ],
            darkgreen: [ 0, 100, 0 ],
            darkkhaki: [ 189, 183, 107 ],
            darkmagenta: [ 139, 0, 139 ],
            darkolivegreen: [ 85, 107, 47 ],
            darkorange: [ 255, 140, 0 ],
            darkorchid: [ 153, 50, 204 ],
            darkred: [ 139, 0, 0 ],
            darksalmon: [ 233, 150, 122 ],
            darkseagreen: [ 143, 188, 143 ],
            darkslateblue: [ 72, 61, 139 ],
            darkslategray: [ 47, 79, 79 ],
            darkturquoise: [ 0, 206, 209 ],
            darkviolet: [ 148, 0, 211 ],
            deeppink: [ 255, 20, 147 ],
            deepskyblue: [ 0, 191, 255 ],
            dimgray: [ 105, 105, 105 ],
            dodgerblue: [ 30, 144, 255 ],
            feldspar: [ 209, 146, 117 ],
            firebrick: [ 178, 34, 34 ],
            floralwhite: [ 255, 250, 240 ],
            forestgreen: [ 34, 139, 34 ],
            fuchsia: [ 255, 0, 255 ],
            gainsboro: [ 220, 220, 220 ],
            ghostwhite: [ 248, 248, 255 ],
            gold: [ 255, 215, 0 ],
            goldenrod: [ 218, 165, 32 ],
            gray: [ 128, 128, 128 ],
            green: [ 0, 128, 0 ],
            greenyellow: [ 173, 255, 47 ],
            honeydew: [ 240, 255, 240 ],
            hotpink: [ 255, 105, 180 ],
            indianred: [ 205, 92, 92 ],
            indigo: [ 75, 0, 130 ],
            ivory: [ 255, 255, 240 ],
            khaki: [ 240, 230, 140 ],
            lavender: [ 230, 230, 250 ],
            lavenderblush: [ 255, 240, 245 ],
            lawngreen: [ 124, 252, 0 ],
            lemonchiffon: [ 255, 250, 205 ],
            lightblue: [ 173, 216, 230 ],
            lightcoral: [ 240, 128, 128 ],
            lightcyan: [ 224, 255, 255 ],
            lightgoldenrodyellow: [ 250, 250, 210 ],
            lightgrey: [ 211, 211, 211 ],
            lightgreen: [ 144, 238, 144 ],
            lightpink: [ 255, 182, 193 ],
            lightsalmon: [ 255, 160, 122 ],
            lightseagreen: [ 32, 178, 170 ],
            lightskyblue: [ 135, 206, 250 ],
            lightslateblue: [ 132, 112, 255 ],
            lightslategray: [ 119, 136, 153 ],
            lightsteelblue: [ 176, 196, 222 ],
            lightyellow: [ 255, 255, 224 ],
            lime: [ 0, 255, 0 ],
            limegreen: [ 50, 205, 50 ],
            linen: [ 250, 240, 230 ],
            magenta: [ 255, 0, 255 ],
            maroon: [ 128, 0, 0 ],
            mediumaquamarine: [ 102, 205, 170 ],
            mediumblue: [ 0, 0, 205 ],
            mediumorchid: [ 186, 85, 211 ],
            mediumpurple: [ 147, 112, 216 ],
            mediumseagreen: [ 60, 179, 113 ],
            mediumslateblue: [ 123, 104, 238 ],
            mediumspringgreen: [ 0, 250, 154 ],
            mediumturquoise: [ 72, 209, 204 ],
            mediumvioletred: [ 199, 21, 133 ],
            midnightblue: [ 25, 25, 112 ],
            mintcream: [ 245, 255, 250 ],
            mistyrose: [ 255, 228, 225 ],
            moccasin: [ 255, 228, 181 ],
            navajowhite: [ 255, 222, 173 ],
            navy: [ 0, 0, 128 ],
            oldlace: [ 253, 245, 230 ],
            olive: [ 128, 128, 0 ],
            olivedrab: [ 107, 142, 35 ],
            orange: [ 255, 165, 0 ],
            orangered: [ 255, 69, 0 ],
            orchid: [ 218, 112, 214 ],
            palegoldenrod: [ 238, 232, 170 ],
            palegreen: [ 152, 251, 152 ],
            paleturquoise: [ 175, 238, 238 ],
            palevioletred: [ 216, 112, 147 ],
            papayawhip: [ 255, 239, 213 ],
            peachpuff: [ 255, 218, 185 ],
            peru: [ 205, 133, 63 ],
            pink: [ 255, 192, 203 ],
            plum: [ 221, 160, 221 ],
            powderblue: [ 176, 224, 230 ],
            purple: [ 128, 0, 128 ],
            red: [ 255, 0, 0 ],
            rosybrown: [ 188, 143, 143 ],
            royalblue: [ 65, 105, 225 ],
            saddlebrown: [ 139, 69, 19 ],
            salmon: [ 250, 128, 114 ],
            sandybrown: [ 244, 164, 96 ],
            seagreen: [ 46, 139, 87 ],
            seashell: [ 255, 245, 238 ],
            sienna: [ 160, 82, 45 ],
            silver: [ 192, 192, 192 ],
            skyblue: [ 135, 206, 235 ],
            slateblue: [ 106, 90, 205 ],
            slategray: [ 112, 128, 144 ],
            snow: [ 255, 250, 250 ],
            springgreen: [ 0, 255, 127 ],
            steelblue: [ 70, 130, 180 ],
            tan: [ 210, 180, 140 ],
            teal: [ 0, 128, 128 ],
            thistle: [ 216, 191, 216 ],
            tomato: [ 255, 99, 71 ],
            turquoise: [ 64, 224, 208 ],
            violet: [ 238, 130, 238 ],
            violetred: [ 208, 32, 144 ],
            wheat: [ 245, 222, 179 ],
            white: [ 255, 255, 255 ],
            whitesmoke: [ 245, 245, 245 ],
            yellow: [ 255, 255, 0 ],
            yellowgreen: [ 154, 205, 50 ]
        },

        _convert = {
            rgb2hsl: function(values) {
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

                    h /= 6;
                }

                return [
                    Math.round(h * 360),
                    Math.round(s * 100),
                    Math.round(l * 100)
                ];
            },

            hsl2rgb: function(values) {
                var h = values[0] / 360,
                    s = values[1] / 100,
                    l = values[2] / 100,
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

            rgb2hsv: function(values) {
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

                    h /= 6;
                }

                return [
                    Math.round(h * 360),
                    Math.round(s * 100),
                    Math.round(v * 100)
                ];
            },

            hsv2rgb: function(values) {
                var h = values[0] / 360,
                    s = values[1] / 100,
                    v = values[2] / 100,
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

            hsl2hsv: function(values) {
                var h = values[0] / 360,
                    s = values[1] / 100,
                    l = values[2] / 100,
                    v;

                s = s * ((l < 0.5) ? l : 1 - l);
                v = l + s;
                s = 2 * s / v;

                return [
                    Math.round(h * 360),
                    Math.round(s * 100),
                    Math.round(v * 100)
                ];
            },

            hsv2hsl: function(values) {
                var h = values[0] / 360,
                    s = values[1] / 100,
                    v = values[2] / 100,
                    l;

                l = (2 - s) * v;
                s = s * v / (l < 1 ? l : 2 - l);
                s = isNaN(s) ? 0 : s;
                l /= 2;

                return [
                    Math.round(h * 360),
                    Math.round(s * 100),
                    Math.round(l * 100)
                ];
            }
        },

        _utils = {
            getType: function(color) {
                if ((/(^#[0-9a-f]{6}$)|(^#[0-9a-f]{3}$)/i).test(color)) {
                    return "hex";
                } else if ((/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i).test(color)) {
                    return "rgb";
                } else if ((/^hsla?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[%+]?[\s+]?,[\s+]?(\d+)[%+]?[\s+]?/i).test(color)) {
                    return "hsl";
                } else if ((/^hsva?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[%+]?[\s+]?,[\s+]?(\d+)[%+]?[\s+]?/i).test(color)) {
                    return "hsv";
                } else if (_names.hasOwnProperty(color)) {
                    return "name";
                }
            },

            getComponents: function(color) {
                var components = {},
                    hex, rgb, hsl, hsv,
                    type = _utils.getType(color);

                if (type === "hex" || type === "rgb" || type === "name" || color.rgb instanceof Array) {
                    if (type === "hex") {
                        if (color.length === 4) {
                            color = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
                                return "#" + r + r + g + g + b + b;
                            });
                        }

                        hex = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(color);

                        components.rgb = [
                            parseInt(hex[1], 16),
                            parseInt(hex[2], 16),
                            parseInt(hex[3], 16)
                        ];
                    } else if (type === "rgb") {
                        rgb = color.replace(/[rgba()]/g, "").split(",");

                        components.rgb = [
                            parseInt(rgb[0], 10),
                            parseInt(rgb[1], 10),
                            parseInt(rgb[2], 10)
                        ];
                    } else if (type === "name") {
                        components.rgb = _names[color];
                    } else {
                        components.rgb = color.rgb;
                    }

                    components.hsl = _convert.rgb2hsl(components.rgb);
                    components.hsv = _convert.rgb2hsv(components.rgb);
                } else if (type === "hsl" || color.hsl instanceof Array) {
                    if (type === "hsl") {
                        hsl = color.replace(/[hsla()]/g, "").split(",");

                        components.hsl = [
                            parseInt(hsl[0], 10),
                            parseInt(hsl[1], 10),
                            parseInt(hsl[2], 10)
                        ];
                    } else {
                        components.hsl = color.hsl;
                    }

                    components.rgb = _convert.hsl2rgb(components.hsl);
                    components.hsv = _convert.hsl2hsv(components.hsl);
                } else if (type === "hsv" || color.hsv instanceof Array) {
                    if (type === "hsv") {
                        hsv = color.replace(/[hsva()]/g, "").split(",");

                        components.hsv = (color.hsv instanceof Array) ? color.hsv :  [
                            parseInt(hsv[0], 10),
                            parseInt(hsv[1], 10),
                            parseInt(hsv[2], 10)
                        ];
                    } else {
                        components.hsv = color.hsv;
                    }

                    components.rgb = _convert.hsv2rgb(components.hsv);
                    components.hsl = _convert.hsv2hsl(components.hsv);
                } else {
                    components.rgb = [ 0, 0, 0 ];
                    components.hsl = [ 0, 0, 0 ];
                    components.hsv = [ 0, 0, 0 ];
                }

                return components;
            },

            getScheme: function(hsl, degrees) {
                var scheme = [],
                    hue, color;

                for (var i = 0, l = degrees.length; i < l; i++) {
                    hue = (hsl[0] + degrees[i]) % 360;

                    color = new ColorConstructor({
                        hsl: [ hue, hsl[1], hsl[2] ]
                    });

                    scheme.push(color);
                }

                return scheme;
            }
        };

    function ColorConstructor(color) {
        var _this = this,
            components;

        if (!color) {
            color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        }

        // Properties
        components = _utils.getComponents(color);

        for (var c in components) {
            if (components.hasOwnProperty(c)) {
                _this[c] = components[c];
            }
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
            return "hsl(" + _this.hsl[0] + "," + _this.hsl[1] + "%," + _this.hsl[2] + "%)";
        };

        _this.tohsv = function() {
            return "hsv(" + _this.hsv[0] + "," + _this.hsv[1] + "%," + _this.hsv[2] + "%)";
        };

        _this.name = function() {
            var name;

            for (var n in _names) {
                if (_names.hasOwnProperty(n) && _names[n].join(",") === _this.rgb.join(",")) {
                    name = n;
                    break;
                }
            }

            return name;
        };

        _this.luminance = function() {
            var lum = [],
                chan;

            for (var i = 0; i < _this.rgb.length; i++) {
                chan = _this.rgb[i] / 255;

                lum[i] = (chan <= 0.03928) ? (chan / 12.92) : Math.pow(((chan + 0.055) / 1.055), 2.4);
            }

            return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
        };

        _this.darkness = function() {
            var yiq = (_this.rgb[0] * 299 + _this.rgb[1] * 587 + _this.rgb[2] * 114) / 1000;

            return yiq / 255;
        };

        // Color schemes
        _this.scheme = {
            complementary: function() {
                return _utils.getScheme(_this.hsl, [ 0, 180 ]);
            },

            splitComplementary: function() {
                return _utils.getScheme(_this.hsl, [ 0, 150, 320 ]);
            },

            splitComplementaryCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 150, 300 ]);
            },

            splitComplementaryCCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 60, 210 ]);
            },

            triadic: function() {
                return _utils.getScheme(_this.hsl, [ 0, 120, 240 ]);
            },

            clash: function() {
                return _utils.getScheme(_this.hsl, [ 0, 90, 270 ]);
            },

            tetradic: function() {
                return _utils.getScheme(_this.hsl, [ 0, 90, 180, 270 ]);
            },

            neutral: function() {
                return _utils.getScheme(_this.hsl, [ 0, 15, 30, 45, 60, 75 ]);
            },

            analogous: function() {
                return _utils.getScheme(_this.hsl, [ 0, 30, 60, 90, 120, 150 ]);
            },

            fourToneCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 60, 180, 240 ]);
            },

            fourToneCCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 120, 180, 300 ]);
            },

            fiveToneA: function() {
                return _utils.getScheme(_this.hsl, [ 0, 115, 155, 205, 245 ]);
            },

            fiveToneB: function() {
                return _utils.getScheme(_this.hsl, [ 0, 40, 90, 130, 245 ]);
            },

            fiveToneC: function() {
                return _utils.getScheme(_this.hsl, [ 0, 50, 90, 205, 320 ]);
            },

            fiveToneD: function() {
                return _utils.getScheme(_this.hsl, [ 0, 40, 155, 270, 310 ]);
            },

            fiveToneE: function() {
                return _utils.getScheme(_this.hsl, [ 0, 115, 2, 30, 270, 320 ]);
            },

            sixToneCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 30, 120, 150, 240, 270 ]);
            },

            sixToneCCW: function() {
                return _utils.getScheme(_this.hsl, [ 0, 90, 120, 210, 240, 330 ]);
            }
        };
    }

    return ColorConstructor;
}());
