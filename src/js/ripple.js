var ripple = function(el) {
	var getPosition = require("./position.js"),
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
			transform: "translateZ(0)",
			overflow: "hidden"
		}).append($ripple);
	});
};

module.exports = ripple;
