import $ from 'jquery';

function ripple(el) {
    const $el = $(el);

    if (!$el.length) {
        return;
    }

    function getPosition(event) {
        const $element = $(event.currentTarget);
        const startX = event.originalEvent.touches ? event.originalEvent.touches[0].pageX : event.pageX;
        const startY = event.originalEvent.touches ? event.originalEvent.touches[0].pageY : event.pageY;
        const posX = startX - $element.offset().left, posY = startY - $element.offset().top;

        return [ posX, posY ];
    }

    $el.off('click.ripple').on('click.ripple', function(e) {
        const $this = $(this);

        if ($this.is(':hidden')) {
            return;
        }

        const rippleTimer = $this.data('rippleTimer');

        if (rippleTimer) {
            clearTimeout(rippleTimer);
        }

        const [ left, top ] = getPosition(e);

        $this.find('.ripple').remove();

        const $ripple = $('<div>').addClass('ripple').css({
            left: `${left}px`,
            top: `${top}px`,
            backgroundColor: $this.attr('data-color') || ''
        }).addClass('ripple-animate');

        $this.data('rippleTimer', setTimeout(() => {
            $ripple.remove();
        }, 1000)).css({
            position: 'relative',
            overflow: 'hidden'
        }).append($ripple);
    });
}

export default { ripple };
