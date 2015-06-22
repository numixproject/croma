function ripple(el) {
    let $el = $(el);

    if (!$el.length) {
        return;
    }

    function getPosition(event) {
        let $element = $(event.currentTarget),
            startX = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX,
            startY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY,
            posX = startX - $element.offset().left,
            posY = startY - $element.offset().top;

        return [ posX, posY ];
    }

    $el.off("click.ripple").on("click.ripple", function(e) {
        let $this = $(this);

        if ($this.is(":hidden")) {
            return;
        }

        let rippleTimer = $this.data("rippleTimer");

        if (rippleTimer) {
            clearTimeout(rippleTimer);
        }

        let [ left, top ] = getPosition(e);

        $this.find(".ripple").remove();

        let $ripple = $("<div>").addClass("ripple").css({
            left: left + "px",
            top: top + "px",
            backgroundColor: $this.attr("data-color") || ""
        }).addClass("ripple-animate");

        $this.data("rippleTimer", setTimeout(function() {
            $ripple.remove();
        }, 1000)).css({
            position: "relative",
            overflow: "hidden"
        }).append($ripple);
    });
}

module.exports = { ripple };
