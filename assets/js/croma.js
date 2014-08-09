/* jshint browser: true */
/* global $, Casket, Color */

var Croma = (function() {
    var _casket = new Casket();

    return function() {
        var _this = this;

        _this.canvas = {
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

                        _this.canvas.rainbow($canvas);
                    }, 500));
                });
            }
        };

        _this.ui = {
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
            ripple: function(event, color) {
                var $element = $(event.currentTarget),
                    pos = _this.ui.position(event);

                if (!(color && typeof color === "string")) {
                    color = "rgba(0,0,0,0.1)";
                }

                var $ripple = $('<svg class="ripple">' +
                                '<circle cx="' + pos[0] + '" cy="' + pos[1] + '" r="0" fill="' + color + '" opacity="1"/>' +
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

                if ($element.css("position") === "static") {
                    $element.css({ position: "relative" });
                }

                $element.append($ripple);

                $circle.velocity(
                    { r: $ripple.outerWidth() },
                    {
                        easing: "easeOutQuad",
                        duration: 500
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
                    "margin-top": $modal.outerHeight() / -2,
                    "margin-left": $modal.outerWidth() / -2
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
                        var hex = new Color(color).tohex();

                        if (hex) {
                            if (!notext) {
                                $colorvalue.text(hex);
                            }

                            $colorbutton.css({ "background-color": hex });

                            _this.ui.picker.value = color;
                        }
                    };

                _this.ui.picker.value = _this.ui.picker.value || "#f06760";

                setcolor(_this.ui.picker.value);

                $canvas.on(startEvent, function(event) {
                    var pos = _this.ui.position(event),
                        color = _this.canvas.getcolor(pos[0], pos[1], this);

                    setcolor(color);

                    $(this).on(moveEvent, function(event) {
                        pos = _this.ui.position(event);
                        color = _this.canvas.getcolor(pos[0], pos[1], this);

                        setcolor(color);
                    });
                }).on(endEvent, function(e) {
                    $(this).off(moveEvent);

                    clearInterval(colorTimer);
                });

                $colorvalue.on("DOMSubtreeModified input paste", function() {
                    var color = new Color($(this).text()).tohex();

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

                $buttons.find(".card-item-button").on("click", _this.ui.ripple);

                $content.append(
                    $container,
                    $info,
                    $buttons
                ).appendTo($modal);

                _this.ui.modal($modal);
                _this.canvas.rainbow($canvas);

                return $modal;
            }
        };

        _this.cards = {
            add: function(color) {
                var $container = $(".card-area");

                if (color instanceof Array) {
                    for (var i = 0; i < color.length; i++) {
                        _this.cards.add(color[i]);
                    }

                    return;
                }

                color = new Color(color).tohex();

                if ((!color) || typeof color !== "string" || $container.find("[data-color=" + color + "]").length) {
                    return;
                }

                var $card = $("<div>").addClass("card-item").attr("data-color", color),
                    $color = $("<div>").addClass("card-item-color").css({ "background-color": color }),
                    $info = $("<div>").addClass("card-item-info"),
                    $value = $("<div>").addClass("card-item-value").text(color),
                    $actions = $("<div>").addClass("card-item-actions").append(
                        $("<div>").addClass("card-item-action card-item-action-love"),
                        $("<div>").addClass("card-item-action card-item-action-delete"),
                        $("<div>").addClass("card-item-action card-item-action-share")
                    );

                $color.on("click", _this.ui.ripple);

                $info.append(
                    $value,
                    $actions
                );

                $card.append(
                    $color,
                    $info
                ).prependTo($container);

                $card.velocity("stop").velocity("fadeIn", 300);

                _this.ui.intoview($card, $container.parent());
                _casket.push("croma", "colors", color);

                return $card;
            },
            remove: function(color) {
                var $container = $(".card-area"),
                    $cards;

                if (color) {
                    if (color instanceof Array) {
                        for (var i = 0; i < color.length; i++) {
                            _this.cards.remove(color[i]);
                        }

                        return;
                    }

                    color = new Color(color).tohex();

                    if ((!color) || typeof color !== "string") {
                        return;
                    }

                    $cards = $container.find("[data-color=" + color + "]");

                    _casket.drop("croma", "colors", color);
                    _casket.drop("croma", "loved", color);
                } else {
                    $cards = $container.find("[data-color]");

                    _casket.drop("croma", "colors");
                    _casket.drop("croma", "loved");
                }

                if ($cards) {
                    _this.ui.swipeout($cards);
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
                        _this.cards.love(color[i]);
                    }

                    return;
                }

                color = new Color(color).tohex();

                if ((!color) || typeof color !== "string") {
                    return;
                }

                $cards = $container.find("[data-color=" + color + "]");

                if (value === false) {
                    $cards.removeClass("card-item-loved");

                    _casket.drop("croma", "loved", color);
                } else {
                    $cards.addClass("card-item-loved");

                    _casket.push("croma", "loved", color);
                }

                return $cards;
            }
        };
    };
})();

window.croma = new Croma();
