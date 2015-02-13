function ripple(el) {
    var getPosition = function(event) {
            var $element = $(event.currentTarget),
                startX = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX,
                startY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY,
                posX = startX - $element.offset().left,
                posY = startY - $element.offset().top;

            return [ posX, posY ];
        },
        $el = $(el);

    if (!$el.length) {
        return;
    }

    $el.off("click.ripple").on("click.ripple", function(e) {
        var $this = $(this),
            $ripple,
            position, color,
            rippleTimer;

        if ($this.is(":hidden")) {
            return;
        }

        position = getPosition(e);

        color = $this.attr("data-color") || "";
        rippleTimer = $this.data("rippleTimer");

        if (rippleTimer) {
            clearTimeout(rippleTimer);
        }

        $this.find(".ripple").remove();

        $ripple = $("<div>").addClass("ripple").css({
            left: position[0] + "px",
            top: position[1] + "px",
            backgroundColor: color
        }).addClass("ripple-animate");

        $this.data("rippleTimer", setTimeout(function() {
            $ripple.remove();
        }, 1000)).css({
            position: "relative",
            overflow: "hidden"
        }).append($ripple);
    });
}

module.exports = {
    ripple: ripple
};
