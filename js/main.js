/* jshint browser: true */
/* global $, croma */

$(function() {
    var $container = $(".card-area-wrapper"),
        colors = croma.database.get("colors"),
        loved = croma.database.get("loved"),
        changeView = function(view) {
            var $body = $("body"),
                classes;

            if (!$body.hasClass("view-" + view)) {
                if ($body.attr("class")) {
                    classes = $body.attr("class").replace(/view-\w+/g, "").trim();

                    $body.attr("class", classes);
                }

                $body.addClass("view-" + view);
            }
        },
        addCard = function(color) {
            if (!color) {
                return;
            }

            var $start = $(".start-area"),
                $card = croma.cards.add(color);

            if ($card && $card.length) {
                $card.on("click", function() {
                });

                $card.find(".card-item-action-love").on("click", function() {
                    var $button = $(this);

                    $button.addClass("clicked");

                    setTimeout(function() {
                        $button.removeClass("clicked");
                    }, 500);

                    if ($card.hasClass("card-item-loved")) {
                        croma.cards.love(color, false);
                    } else {
                        croma.cards.love(color);
                    }
                });

                $card.find(".card-item-action-delete").on("click", function() {
                    croma.cards.remove(color);
                });
            }

            if ($("[data-color]").length) {
                changeView("normal");
            }

            return $card;
        },
        removeCard = function(color) {
            if (!color) {
                return;
            }

            croma.cards.remove(color);

            if (!$("[data-color]").length) {
                changeView("empty");
            }
        };

    if (colors) {
        if (colors.length && colors instanceof Array) {
            for (var i = 0; i < colors.length; i++) {
                addCard(colors[i]);
            }
        } else {
            addCard(colors);
        }
    } else {
        changeView("empty");
    }

    if (loved) {
        if (loved.length && loved instanceof Array) {
            for (var l = 0; l < loved.length; l++) {
                croma.cards.love(loved[l]);
            }
        } else {
            croma.cards.love(loved);
        }
    }

    $(".header-action-button").on("click", croma.ui.ripple);

    $(".header-action-add").on("click", function() {
        var $modal = croma.ui.picker(),
            color;

        $modal.find(".card-item-button-ok").on("click", function() {
            addCard(croma.ui.picker.value);
        });
    });
});
