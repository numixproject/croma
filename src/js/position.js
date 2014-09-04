var getPosition = function(event) {
	var $element = $(event.currentTarget),
		startX = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX,
		startY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY,
		posX = startX - $element.offset().left,
		posY = startY - $element.offset().top;

	return [ posX, posY ];
};

module.exports = getPosition;
