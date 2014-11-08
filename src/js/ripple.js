var ripple = function(el) {
	var getPostion = require("./position.js"),
		$el = $(el);

	if (!$el.length) {
		return;
	}

	$el.off("mousedown.ripple touchstart.ripple").on("mousedown.ripple touchstart.ripple", function(e) {
		var $this = $(this),
			$ripple = $("<div>").addClass("ripple"),
			position = getPostion(e);

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
			top: position[1] + "px"
		}).addClass("ripple-animate");

		$this.data("ripple-animating", true).append($ripple);

		setTimeout(function() {
			$this.data("ripple-animating", false);
		}, 500);
	});
};

module.exports = ripple;
