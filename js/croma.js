/* jshint browser: true */
/* global $ */

var croma = {
    utils: {
        test: function(color) {
            if (!color) {
                return;
            }

            if (color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i)) {
                return "rgb";
            } else if (color.match(/(^#[0-9a-f]{6}$)|(^#[0-9a-f]{3}$)/i)) {
                return "hex";
            }
        },
        tohexval: function(color) {
            if (croma.utils.test(color) !== "hex") {
                return;
            }

            var hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
                return "#" + r + r + g + g + b + b;
            });

            return hex;
        },
        tohex: function(color) {
            if (croma.utils.test(color) === "hex") {
                return color;
            }

            if (croma.utils.test(color) !== "rgb") {
                return;
            }

            var rgb = (/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i).exec(color);

            if (rgb && rgb.length) {
                var r = ("0" + parseInt(rgb[1],10).toString(16)).slice(-2),
                    g = ("0" + parseInt(rgb[2],10).toString(16)).slice(-2),
                    b = ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);

                return "#" + r + g + b;
            }
        },
        torgb: function(color) {
            if (croma.utils.test(color) === "rgb") {
                return color;
            }

            color = croma.utils.tohexval(color);

            if (!color) {
                return;
            }

            var hex = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(color);

            if (hex && hex.length) {
                var r = parseInt(hex[1], 16),
                    g = parseInt(hex[2], 16),
                    b = parseInt(hex[3], 16);

                return "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    },
    database: {
        set: function(key, value) {
            if (!key || !value) {
                return;
            }

            localStorage.setItem(
                JSON.stringify(key),
                JSON.stringify(value)
            );
        },
        get: function(key) {
            if (!key) {
                return;
            }

            var data = localStorage.getItem(
                JSON.stringify(key)
            );

            return JSON.parse(data);
        },
        check: function(key, value) {
            if (!key || !value) {
                return;
            }

            var data = croma.database.get(key);

            if (data && data.length && data instanceof Array) {
                if (data.indexOf(value) > -1) {
                    return true;
                } else {
                    return false;
                }
            } else if (data && data === value) {
                return true;
            } else {
                return false;
            }
        },
        add: function(key, value) {
            if (!key || !value) {
                return;
            }

            var data = croma.database.get(key);

            if (data && data.length && data instanceof Array) {
                if (value.length && value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        if (data.indexOf(value[i]) === -1) {
                            data.push(value[i]);
                        }
                    }
                } else {
                    if (data.indexOf(value) === -1) {
                        data.push(value);
                    }
                }

                value = data;
            }

            croma.database.set(key, value);
        },
        remove: function(key, value) {
            if (!key) {
                return;
            }

            var data = croma.database.get(key);

            if (value && data && data.length && data instanceof Array) {
                var index;

                if (value.length && value instanceof Array) {
                    for (var i = 0; i < value.length; i++) {
                        index = data.indexOf(value[i]);

                        if (index > -1) {
                            data.splice(index, 1);
                        }
                    }
                } else {
                    index = data.indexOf(value);

                    if (index > -1) {
                        data.splice(index, 1);
                    }
                }

                croma.database.set(key, data);
            } else {
                localStorage.removeItem(
                    JSON.stringify(key)
                );
            }
        }
    },
    canvas: {
        getcolor: function(x, y, canvas) {
            var imageData = $(canvas).get(0).getContext("2d").getImageData(x, y, 1, 1).data,
                color = "rgb(" + imageData[0] + "," + imageData[1] + "," + imageData[2] + ")";

            return color;
        },
        rainbow: function(canvas) {
            var $canvas = $(canvas),
                sheet = $canvas.get(0).getContext("2d"),
                img = new Image(),
                gradient = sheet.createLinearGradient(0, 0, $canvas.width(), 0);

            sheet.canvas.width = $canvas.parent().innerWidth();

            gradient.addColorStop(0,    "rgb(255,   0,   0)");
            gradient.addColorStop(0.15, "rgb(255,   0, 255)");
            gradient.addColorStop(0.33, "rgb(0,     0, 255)");
            gradient.addColorStop(0.49, "rgb(0,   255, 255)");
            gradient.addColorStop(0.67, "rgb(0,   255,   0)");
            gradient.addColorStop(0.84, "rgb(255, 255,   0)");

            sheet.fillStyle = gradient;
            sheet.fillRect(0, 0, sheet.canvas.width, sheet.canvas.height);

            gradient = sheet.createLinearGradient(0, 0, 0, $canvas.height());
            gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
            gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

            sheet.fillStyle = gradient;
            sheet.fillRect(0, 0, sheet.canvas.width, sheet.canvas.height);

            $(window).on("resize", function() {
                clearTimeout($(this).data("resizeTimer"));

                $(this).data("resizeTimer", setTimeout(function() {
                    var width = $canvas.parent().innerWidth();

                    sheet.canvas.width = width;

                    croma.canvas.rainbow($canvas);
                }, 500));
            });
        }
    },
    ui: {
        position: function(event) {
            var $element = $(event.currentTarget),
                startX = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX,
                startY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY,
                posX = startX - $element.offset().left,
                posY = startY - $element.offset().top;

            return [ posX, posY ];
        },
        intoview: function(element, container) {
            var $element = $(element),
                $container = $(container);

            if (($element.offset().top - $container.offset().top) < 0 ||
                $element.offset().top > $container.height()) {
                $element.velocity("scroll", {
                    duration: 150,
                    container: $container
                });
            }
        },
        swipeout: function(element) {
            $(element).velocity({
                translateX: "100%",
                opacity: 0
            }, {
                duration: 300,
                easing: [0.7,0.1,0.57,0.79]
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
        ripple: function(event) {
            var $element = $(event.currentTarget),
                pos = croma.ui.position(event);

            var $ripple = $('<svg class="ripple">' +
                            '<circle cx="' + pos[0] +'" cy="' + pos[1] + '" r="0" fill="#000" opacity="0.1"/>' +
                            '</svg>'),
                $circle = $ripple.find("circle");

            $ripple.css({
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%"
            });

            $element.find(".ripple").remove();

            $element.css({ position: "relative" })
                    .append($ripple);

            $circle.velocity(
                { r: $ripple.outerWidth() },
                {
                    easing: "easeOutQuad",
                    duration: 500,
                    step: function(val) {
                        $(this).attr("r", val);
                    }
                }
            ).velocity({ opacity: 0 }, 300, function() {
                $ripple.remove();
            });
        },
        modal: function(body) {
            var $modal = $(".modal"),
                $backdrop = $(".backdrop");

            if (!$backdrop.length) {
                $backdrop = $("<div>").addClass("backdrop");
                $backdrop.appendTo("body");
                $backdrop.velocity("stop").velocity("fadeIn", 300);
            }

            if ($modal.length) {
                $modal.empty().html(body);
            } else {
                $modal = $("<div>").addClass("modal").html(body);
                $modal.appendTo("body");
                $modal.velocity("stop").velocity("fadeIn", 300);
            }

            $modal.css({
                "margin-top" : $modal.outerHeight() / -2,
                "margin-left" : $modal.outerWidth() / -2
            });

            $modal.dismiss = function() {
                [ $modal, $backdrop ].forEach(function($el) {
                    $el.velocity("stop").velocity("fadeOut", 300, function() {
                        $(this).remove();
                    });
                });

                $.event.trigger({
                    type: "modaldismiss",
                    time: new Date(),
                    target: $modal
                });
            };

            $(document).on("keydown", function(e) {
                if (e.keyCode === 27) {
                    $modal.dismiss();
                }
            });

            $backdrop.on("click", $modal.dismiss);

            $modal.find(".modal-remove").on("click", $modal.dismiss);

            return $modal;
        },
        picker: function(value) {
            var $modal = $("<div>").addClass("color-picker-dialog"),
                $content = $("<div>").addClass("modal-content"),
                $info = $("<div>").addClass("card-item-info"),
                $buttons = $("<div>").addClass("card-item-buttons"),
                $canvas = $("<canvas>").addClass("color-picker"),
                $container = $("<div>").addClass("color-picker-canvas").append($canvas),
                $colorvalue = $("<div>").addClass("card-item-value-text").attr("contenteditable", true),
                $colorbutton = $("<div>").addClass("card-item-action-color"),
                startEvent = "touchstart mousedown pointerdown",
                moveEvent = "touchmove mousemove pointermove",
                endEvent = "touchend touchleave touchcancel mouseup pointerup",
                colorTimer,
                setcolor = function(color, notext) {
                    if (croma.utils.tohex(color)) {
                        if (!notext) {
                            $colorvalue.text(croma.utils.tohex(color));
                        }

                        $colorbutton.css({ "background-color" : color });

                        croma.ui.picker.value = color;
                    }
                };

            croma.ui.picker.value = croma.ui.picker.value || "#f06760";

            setcolor(croma.ui.picker.value);

            $canvas.on(startEvent, function(event) {
                var pos = croma.ui.position(event),
                    color = croma.canvas.getcolor(pos[0], pos[1], this);

                setcolor(color);

                $(this).on(moveEvent, function(event) {
                    pos = croma.ui.position(event);
                    color = croma.canvas.getcolor(pos[0], pos[1], this);

                    setcolor(color);
                });
            }).on(endEvent, function(e) {
                $(this).off(moveEvent);

                clearInterval(colorTimer);
            });

            $colorvalue.on("DOMSubtreeModified input paste", function() {
                var color = croma.utils.tohex($(this).text());

                setcolor(color, true);
            });

            $info.append(
                $("<div>").addClass("card-item-value").append($colorvalue),
                $("<div>").addClass("card-item-actions").append($colorbutton)
            );

            $buttons.append(
                $("<div>").addClass("card-item-button card-item-button-ok modal-remove").text("Add"),
                $("<div>").addClass("card-item-button card-item-button-cancel modal-remove").text("Cancel")
            );

            $buttons.find(".card-item-button").on("click", croma.ui.ripple);

            $content.append(
                $container,
                $info,
                $buttons
            ).appendTo($modal);

            croma.ui.modal($modal);
            croma.canvas.rainbow($canvas);

            return $modal;
        }
    },
    cards: {
        add: function(color) {
            var $container = $(".card-area");

            if (color instanceof Array) {
                for (var i = 0; i < color.length; i++) {
                    croma.cards.add(color[i]);
                }

                return;
            }

            color = croma.utils.tohexval(croma.utils.tohex(color));

            if ((!color) || typeof color !== "string" || $container.find("[data-color=" + color + "]").length) {
                return;
            }

            var $card = $("<div>").addClass("card-item").attr("data-color", color),
                $color = $("<div>").addClass("card-item-color").css({ "background-color" : color }),
                $info = $("<div>").addClass("card-item-info"),
                $value = $("<div>").addClass("card-item-value").text(color),
                $actions = $("<div>").addClass("card-item-actions").append(
                    $("<div>").addClass("card-item-action card-item-action-love"),
                    $("<div>").addClass("card-item-action card-item-action-delete"),
                    $("<div>").addClass("card-item-action card-item-action-share")
                );

            $color.on("click", croma.ui.ripple);

            $info.append(
                $value,
                $actions
            );

            $card.append(
                $color,
                $info
            ).prependTo($container);

            $card.velocity("stop").velocity("fadeIn", 300);

            croma.ui.intoview($card, $container.parent());
            croma.database.add("colors", [ color ]);

            return $card;
        },
        remove: function(color) {
            var $container = $(".card-area"),
                $cards;

            if (color) {
                if (color instanceof Array) {
                    for (var i = 0; i < color.length; i++) {
                        croma.cards.remove(color[i]);
                    }

                    return;
                }

                color = croma.utils.tohexval(croma.utils.tohex(color));

                if ((!color) || typeof color !== "string") {
                    return;
                }

                $cards = $container.find("[data-color=" + color + "]");

                croma.database.remove("colors", color);
                croma.database.remove("loved", color);
            } else {
                $cards = $container.find("[data-color]");

                croma.database.remove("colors");
                croma.database.remove("loved");
            }

            if ($cards) {
                croma.ui.swipeout($cards);
            }

            return $cards;
        },
        love: function(color, value) {
            var $container = $(".card-area"),
                $cards;

            if (!color) {
                return;
            }

            if (color instanceof Array) {
                for (var i = 0; i < color.length; i++) {
                    croma.cards.love(color[i]);
                }

                return;
            }

            color = croma.utils.tohexval(croma.utils.tohex(color));

            if ((!color) || typeof color !== "string") {
                return;
            }

            $cards = $container.find("[data-color=" + color + "]");

            if (value === false) {
                $cards.removeClass("card-item-loved");

                croma.database.remove("loved", color);
            } else {
                $cards.addClass("card-item-loved");

                croma.database.add("loved", [ color ]);
            }

            return $cards;
        }
    }
};

window.croma = croma;
