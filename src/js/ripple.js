var showRipple = function(event, color) {
	var pos = require("./position.js")(event),
		$element = $(event.currentTarget);

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
};

module.exports = showRipple;
