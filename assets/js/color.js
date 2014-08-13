/**
 * @fileOverview Color information and manipulation library.
 * @author Satyajit Sahoo <satyajit.happy@gmail.com>
 * @license GPL-3.0+
 */

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
            rebeccapurple: [ 102, 51, 153 ],
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
            },

            rgb2cmyk: function(values) {
                var c, m, y, k;

                c = 1 - (values[0] / 255);
                m = 1 - (values[1] / 255);
                y = 1 - (values[2] / 255);

                k = Math.min(Math.min(c, m), y);

                if (k === 1) {
                    c = m = y = 0;
                } else {
                    c = (c - k) / (1 - k);
                    m = (m - k) / (1 - k);
                    y = (y - k) / (1 - k);
                }

                return [
                    Math.round(c * 100),
                    Math.round(m * 100),
                    Math.round(y * 100),
                    Math.round(k * 100)
                ];
            },

            cmyk2rgb: function(values) {
                var c = values[0] / 100,
                    m = values[1] / 100,
                    y = values[2] / 100,
                    k = values[3] / 100;

                c = (c * (1 - k) + k);
                m = (m * (1 - k) + k);
                y = (y * (1 - k) + k);

                return [
                    Math.round((1 - c) * 255),
                    Math.round((1 - m) * 255),
                    Math.round((1 - y) * 255)
                ];
            },

            rgb2xyz: function(values) {
                var rgb = [
                        values[0] / 255,
                        values[1] / 255,
                        values[2] / 255
                    ];

                for (var i = 0, l = rgb.length; i < l; i++) {
                    if (rgb[i] > 0.04045) {
                        rgb[i] = Math.pow(((rgb[i] + 0.055) / 1.055), 2.4);
                    } else {
                        rgb[i] /= 12.92;
                    }

                    rgb[i] = rgb[i] * 100;
                }

                return [
                    Math.round(rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805),
                    Math.round(rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722),
                    Math.round(rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505)
                ];
            },

            xyz2rgb: function(values) {
                var xyz = [
                        values[0] / 100,
                        values[1] / 100,
                        values[2] / 100
                    ],
                    rgb = [];

                rgb[0] = (xyz[0] * 3.2406) + (xyz[1] * -1.5372) + (xyz[2] * -0.4986);
                rgb[1] = (xyz[0] * -0.9689) + (xyz[1] * 1.8758) + (xyz[2] * 0.0415);
                rgb[2] = (xyz[0] * 0.0557) + (xyz[1] * -0.2040) + (xyz[2] * 1.0570);

                for (var i = 0, l = rgb.length; i < l; i++) {
                    if (rgb[i] < 0) {
                        rgb[i] = 0;
                    }

                    if (rgb[i] > 0.0031308) {
                        rgb[i] = 1.055 * Math.pow(rgb[i], (1 / 2.4)) - 0.055;
                    } else {
                        rgb[i] *= 12.92;
                    }

                    rgb[i] = Math.round(rgb[i] * 255);
                }

                return rgb;
            },

            xyz2lab: function(values) {
                var white = [ 95.047, 100.000, 108.883 ],
                    xyz = [];

                for (var i = 0, l = values.length; i < l; i++) {
                    xyz[i] = values[i] / white[i];
                    xyz[i] = (xyz[i] > 0.008856) ? Math.pow(xyz[i], 1 / 3) : ((7.787 * xyz[i]) + (16 / 116));
                }

                return [
                    116 * xyz[1] - 16,
                    500 * (xyz[0] - xyz[1]),
                    200 * (xyz[1] - xyz[2])
                ];
            },

            lab2xyz: function(values) {
                var white = [ 95.047, 100.000, 108.883 ],
                    xyz = [], p;

                xyz[1] = (values[0] + 16) / 116;
                xyz[0] = (values[1] / 500) + xyz[1];
                xyz[2] = xyz[1] - (values[2] / 200);

                for (var i = 0, l = xyz.length; i < l; i++) {
                    p = Math.pow(xyz[i], 3);

                    xyz[i] = (p > 0.008856) ? p : ((xyz[i] - 16 / 116 ) / 7.787);
                    xyz[i] = Math.round(xyz[i] * white[i]);
                }

                return xyz;
            }
        },

        _fn = {
            colorObj: function(colors) {
                var objs = [],
                    c;

                if (colors instanceof Array) {
                    for (var i = 0, l = colors.length; i < l; i++) {
                        c = new ColorConstructor(colors[i]);

                        objs.push(c);
                    }

                    return objs;
                } else {
                    c = new ColorConstructor(colors);

                    return c;
                }
            },

            getType: function(color) {
                var models = {
                    hex: /(^#[0-9a-f]{6}$)|(^#[0-9a-f]{3}$)/i,
                    rgb: /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i,
                    hsl: /^hsla?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[%+]?[\s+]?,[\s+]?(\d+)[%+]?[\s+]?/i,
                    hsv: /^hsva?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[%+]?[\s+]?,[\s+]?(\d+)[%+]?[\s+]?/i,
                    cmyk: /^cmyk?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i,
                    lab: /^lab?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)?[\s+]?,[\s+]?(\d+)?[\s+]?/i,
                    name: function(color) {
                        if (color && typeof color == "string") {
                            color = color.toLowerCase();
                        }

                        return _names.hasOwnProperty(color);
                    }
                };

                for (var t in models) {
                    if ((typeof models[t] === "function" && models[t](color)) ||
                        (models[t] instanceof RegExp && models[t].test(color))) {
                        return t;
                    }
                }
            },

            getComponents: function(color) {
                var models = {
                        hex: function(color) {
                            var hex;

                            if (color.length === 4) {
                                color = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
                                    return "#" + r + r + g + g + b + b;
                                });
                            }

                            hex = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(color);

                            return {
                                rgb: [
                                    parseInt(hex[1], 16),
                                    parseInt(hex[2], 16),
                                    parseInt(hex[3], 16)
                                ]
                            };
                        },
                        rgb: function(color) {
                            var rgb = color.replace(/[rgba()]/g, "").split(",");

                            return {
                                rgb: [
                                    parseInt(rgb[0], 10),
                                    parseInt(rgb[1], 10),
                                    parseInt(rgb[2], 10)
                                ],
                                alpha: parseFloat(rgb[3])
                            };
                        },
                        hsl: function(color) {
                            var hsl = color.replace(/[hsla()]/g, "").split(",");

                            return {
                                hsl: [
                                    parseInt(hsl[0], 10),
                                    parseInt(hsl[1], 10),
                                    parseInt(hsl[2], 10)
                                ],
                                alpha: parseFloat(hsl[3])
                            };
                        },
                        hsv: function(color) {
                            var hsv = color.replace(/[hsva()]/g, "").split(",");

                            return {
                                hsv: [
                                    parseInt(hsv[0], 10),
                                    parseInt(hsv[1], 10),
                                    parseInt(hsv[2], 10)
                                ],
                                alpha: parseFloat(hsv[3])
                            };
                        },
                        cmyk: function(color) {
                            var cmyk = color.replace(/[cmyk()]/g, "").split(",");

                            return {
                                cmyk: [
                                    parseInt(cmyk[0], 10),
                                    parseInt(cmyk[1], 10),
                                    parseInt(cmyk[2], 10),
                                    parseInt(cmyk[3], 10)
                                ]
                            };
                        },
                        lab: function(color) {
                            var lab = color.replace(/[lab()]/g, "").split(",");

                            return {
                                lab: [
                                    parseInt(lab[0], 10),
                                    parseInt(lab[1], 10),
                                    parseInt(lab[2], 10)
                                ]
                            };
                        },
                        name: function(color) {
                            if (color && typeof color == "string") {
                                color = color.toLowerCase();
                            }

                            return { rgb: _names[color] };
                        }
                    },
                    c = {},
                    type = _fn.getType(color);

                if (typeof models[type] === "function") {
                    c = models[type].call(null, color);
                } else {
                    for (var t in models) {
                        c[t] = color[t];
                    }
                }

                c.rgb = (function() {
                    if (c.rgb instanceof Array) {
                        return c.rgb;
                    } else if (c.hsl instanceof Array) {
                        return _convert.hsl2rgb(c.hsl);
                    } else if (c.hsv instanceof Array) {
                        return _convert.hsv2rgb(c.hsv);
                    } else if (c.cmyk instanceof Array) {
                        return _convert.cmyk2rgb(c.cmyk);
                    } else if (c.lab instanceof Array) {
                        return _convert.xyz2rgb(_convert.lab2xyz(c.lab));
                    } else {
                        return [ 0, 0, 0 ];
                    }
                }());

                c.hsl = (function() {
                    if (c.hsl instanceof Array) {
                        return c.hsl;
                    } else if (c.hsv instanceof Array) {
                        return _convert.hsv2hsl(c.hsv);
                    } else if (c.rgb instanceof Array) {
                        return _convert.rgb2hsl(c.rgb);
                    } else if (c.cmyk instanceof Array) {
                        return _convert.rgb2hsl(_convert.cmyk2rgb(c.cmyk));
                    } else if (c.lab instanceof Array) {
                        return _convert.rgb2hsl(_convert.xyz2rgb(_convert.lab2xyz(c.lab)));
                    } else {
                        return [ 0, 0, 0 ];
                    }
                }());

                c.hsv = (function() {
                    if (c.hsv instanceof Array) {
                        return c.hsv;
                    } else if (c.hsl instanceof Array) {
                        return _convert.hsl2hsv(c.hsl);
                    } else if (c.rgb instanceof Array) {
                        return _convert.rgb2hsv(c.rgb);
                    } else if (c.cmyk instanceof Array) {
                        return _convert.rgb2hsv(_convert.cmyk2rgb(c.cmyk));
                    } else if (c.lab instanceof Array) {
                        return _convert.rgb2hsv(_convert.xyz2rgb(_convert.lab2xyz(c.lab)));
                    } else {
                        return [ 0, 0, 0 ];
                    }
                }());

                c.cmyk = (function() {
                    if (c.cmyk instanceof Array) {
                        return c.cmyk;
                    } else if (c.rgb instanceof Array) {
                        return _convert.rgb2cmyk(c.rgb);
                    } else if (c.hsl instanceof Array) {
                        return _convert.rgb2cmyk(_convert.hsl2rgb(c.hsl));
                    } else if (c.hsv instanceof Array) {
                        return _convert.rgb2cmyk(_convert.hsl2rgb(c.hsv));
                    } else if (c.lab instanceof Array) {
                        return _convert.rgb2cmyk(_convert.xyz2rgb(_convert.lab2xyz(c.lab)));
                    } else {
                        return [ 0, 0, 0 ];
                    }
                }());

                c.lab = (function() {
                    if (c.lab instanceof Array) {
                        return c.lab;
                    } else if (c.rgb instanceof Array) {
                        return _convert.xyz2lab(_convert.rgb2xyz(c.rgb));
                    } else if (c.cmyk instanceof Array) {
                        return _convert.xyz2lab(_convert.rgb2xyz(_convert.cmyk2rgb(c.cmyk)));
                    } else if (c.hsl instanceof Array) {
                        return _convert.xyz2lab(_convert.rgb2xyz(_convert.hsl2rgb(c.hsl)));
                    } else if (c.hsv instanceof Array) {
                        return _convert.xyz2lab(_convert.rgb2xyz(_convert.hsl2rgb(c.hsv)));
                    } else {
                        return [ 0, 0, 0 ];
                    }
                }());

                c.alpha = (typeof c.alpha === "number" && (c.alpha || c.alpha === 0)) ? Math.max(Math.min(c.alpha, 1), 0) : 1;

                return c;
            },

            getScheme: function(hsl, degrees) {
                var scheme = [],
                    hue, color;

                for (var i = 0, l = degrees.length; i < l; i++) {
                    hue = (hsl[0] + degrees[i]) % 360;

                    scheme.push({
                        hsl: [ hue, hsl[1], hsl[2] ]
                    });
                }

                return _fn.colorObj(scheme);
            }
        };

    function ColorConstructor(color) {
        var components;

        if (!color) {
            color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
        }

        // Properties
        components = _fn.getComponents(color);

        for (var c in components) {
            if (components.hasOwnProperty(c)) {
                this[c] = components[c];
            }
        }
    }

    // Methods
    ColorConstructor.prototype.tohex = function() {
        var r = ("0" + parseInt(this.rgb[0], 10).toString(16)).slice(-2),
            g = ("0" + parseInt(this.rgb[1], 10).toString(16)).slice(-2),
            b = ("0" + parseInt(this.rgb[2], 10).toString(16)).slice(-2);

        return "#" + r + g + b;
    };

    ColorConstructor.prototype.torgb = function() {
        return "rgba(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + "," + this.alpha + ")";
    };

    ColorConstructor.prototype.tohsl = function() {
        return "hsla(" + this.hsl[0] + "," + this.hsl[1] + "%," + this.hsl[2] + "%," + this.alpha + ")";
    };

    ColorConstructor.prototype.tohsv = function() {
        return "hsva(" + this.hsv[0] + "," + this.hsv[1] + "%," + this.hsv[2] + "%," + this.alpha + ")";
    };

    ColorConstructor.prototype.tocmyk = function() {
        return "cmyk(" + this.cmyk[0] + "," + this.cmyk[1] + "," + this.cmyk[2] + "," + this.cmyk[3] + ")";
    };

    ColorConstructor.prototype.tolab = function() {
        return "lab(" + this.lab[0] + "," + this.lab[1] + "," + this.lab[2] + ")";
    };

    ColorConstructor.prototype.name = function() {
        var name;

        for (var n in _names) {
            if (_names.hasOwnProperty(n) && _names[n].join(",") === this.rgb.join(",")) {
                name = n;
                break;
            }
        }

        return name;
    };

    ColorConstructor.prototype.luminance = function() {
        var lum = [],
            chan;

        for (var i = 0; i < this.rgb.length; i++) {
            chan = this.rgb[i] / 255;

            lum[i] = (chan <= 0.03928) ? (chan / 12.92) : Math.pow(((chan + 0.055) / 1.055), 2.4);
        }

        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    };

    ColorConstructor.prototype.darkness = function() {
        var yiq = (this.rgb[0] * 299 + this.rgb[1] * 587 + this.rgb[2] * 114) / 1000;

        return yiq / 255;
    };

    // Color manipulation
    ColorConstructor.prototype.lighten = function(ratio) {
        var hsl = this.hsl.slice(0);

        hsl[2] += hsl[2] * Math.max(Math.min(ratio, 1), 0);

        return _fn.colorObj({
            hsl: hsl,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.darken = function(ratio) {
        var hsl = this.hsl.slice(0);

        hsl[2] -= hsl[2] * Math.max(Math.min(ratio, 1), 0);

        return _fn.colorObj({
            hsl: hsl,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.saturate = function(ratio) {
        var hsl = this.hsl.slice(0);

        hsl[1] += hsl[1] * Math.max(Math.min(ratio, 1), 0);

        return _fn.colorObj({
            hsl: hsl,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.desaturate = function(ratio) {
        var hsl = this.hsl.slice(0);

        hsl[1] -= hsl[1] * Math.max(Math.min(ratio, 1), 0);

        return _fn.colorObj({
            hsl: hsl,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.rotate = function(degrees) {
        var hsl = this.hsl.slice(0);

        hsl[0] = (hsl[0] + degrees) % 360;
        hsl[0] = hsl[0] < 0 ? 360 + hsl[0] : hsl[0];

        return _fn.colorObj({
            hsl: hsl,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.mix = function(newColor, weight) {
        weight = 1 - (weight ? weight : 0.5);

        var c = _fn.colorObj(newColor),
            t1 = (weight * 2) - 1,
            d = this.alpha() - c.alpha(),
            weight1 = (((t1 * d === -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2,
            weight2 = 1 - weight1,
            rgb = [],
            alpha;

        for (var i = 0; i < this.rgb.length; i++) {
            rgb[i] = this.rgb[i] * weight1 + c.rgb[i] * weight2;
        }

        alpha = this.alpha() * weight + c.alpha() * (1 - weight);

        return _fn.colorObj({
            rgb: rgb,
            alpha: alpha
        });
    };

    ColorConstructor.prototype.negate = function() {
        var rgb = [];

        for (var i = 0; i < 3; i++) {
            rgb[i] = 255 - this.rgb[i];
        }

        return _fn.colorObj({
            rgb: rgb,
            alpha: this.alpha
        });
    };

    ColorConstructor.prototype.greyscale = function() {
        var val = (this.rgb[0] * 0.3) + (this.rgb[1] * 0.59) + (this.rgb[2] * 0.11);

        return _fn.colorObj({
            rgb: [ val, val, val ],
            alpha: this.alpha
        });
    };

    // Color schemes
    ColorConstructor.prototype.complementaryScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 180 ]);
    };

    ColorConstructor.prototype.splitComplementaryScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 150, 320 ]);
    };

    ColorConstructor.prototype.splitComplementaryCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 150, 300 ]);
    };

    ColorConstructor.prototype.splitComplementaryCCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 60, 210 ]);
    };

    ColorConstructor.prototype.triadicScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 120, 240 ]);
    };

    ColorConstructor.prototype.clashScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 90, 270 ]);
    };

    ColorConstructor.prototype.tetradicScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 90, 180, 270 ]);
    };

    ColorConstructor.prototype.neutralScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 15, 30, 45, 60, 75 ]);
    };

    ColorConstructor.prototype.analogousScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 30, 60, 90, 120, 150 ]);
    };

    ColorConstructor.prototype.fourToneCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 60, 180, 240 ]);
    };

    ColorConstructor.prototype.fourToneCCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 120, 180, 300 ]);
    };

    ColorConstructor.prototype.fiveToneAScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 115, 155, 205, 245 ]);
    };

    ColorConstructor.prototype.fiveToneBScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 40, 90, 130, 245 ]);
    };

    ColorConstructor.prototype.fiveToneCScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 50, 90, 205, 320 ]);
    };

    ColorConstructor.prototype.fiveToneDScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 40, 155, 270, 310 ]);
    };

    ColorConstructor.prototype.fiveToneEScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 115, 2, 30, 270, 320 ]);
    };

    ColorConstructor.prototype.sixToneCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 30, 120, 150, 240, 270 ]);
    };

    ColorConstructor.prototype.sixToneCCWScheme = function() {
        return _fn.getScheme(this.hsl, [ 0, 90, 120, 210, 240, 330 ]);
    };

    return ColorConstructor;
}());
