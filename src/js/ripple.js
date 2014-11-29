var ripple = function(el) {
	var getPosition = require("./position.js"),
		$el = $(el);

	if (!$el.length) {
		return;
	}

	$el.off("click.ripple").on("click.ripple", function(e) {
		var $this = $(this),
			$ripple = $("<div>").addClass("ripple"),
			position = getPosition(e),
			color = $this.attr("data-color");

		if ($this.data("ripple-animating")) {
			return;
		}

		$this.find(".ripple").remove();

		$this.css({
			position: "relative",
			transform: "translateZ(0)",
			overflow: "hidden"
		});

		$ripple.css({
			left: position[0] + "px",
			top: position[1] + "px",
			background: color ? color : ""
		}).addClass("ripple-animate");

		$this.data("ripple-animating", true).append($ripple);

		setTimeout(function() {
			$this.data("ripple-animating", false);
			$ripple.remove();
		}, 1000);
	});
};

module.exports = ripple;
