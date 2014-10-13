var material = (function() {

    function isVisible(el) {
        var $el = $(el),
            viewTop = $(window).scrollTop(),
            viewBottom = viewTop + $(window).height(),
            compareTop = $el.offset().top,
            compareBottom = compareTop + $el.height();

        return ((compareTop <= viewBottom) && (compareBottom >= viewTop));
    }

    var animate = function(el, initial, final, reset, delay) {
        var offset, duration = 300,
            $item, $el = $(el);

        // Return if no element found
        if (!$el.length) {
            return;
        }

        // Set initial states
        $el.css(initial);

        delay = (typeof delay === "number" && !isNaN(delay)) ? delay : 0;

        // Set transition properties for each element
        for (var i = 0, l = $el.length; i < l; i++) {
            $item = $el.eq(i);

            // Continue if item not visible
            if (!isVisible($item)) {
                continue;
            }

            offset = $item.offset().left + $item.offset().top;
            delay += offset * 0.5;

            $item.css({
                "transition-delay": delay + "ms",
                "transition-duration": duration + "ms"
            });
        }

        // Transition the element
        $el.css(final);

        // Reset CSS properties after transition
        setTimeout(function() {
            $el.css(reset).css({
                "transition-delay": "",
                "transition-duration": ""
            });
        }, (delay + duration));
    };

    return {
        slideIn: function(el, delay) {
            animate(el, {
                "opacity": 0,
                "transform": "translate3d(0,50px,0)"
            }, {
                "opacity": 1,
                "transform": "translate3d(0,0,0)"
            }, {
                "opacity": "",
                "transform": ""
            }, delay);
        }
    };

}());

if (typeof define === "function" && define.amd) {
    // Define as AMD module
    define(function() {
        return material;
    });
} else if (typeof module !== "undefined" && module.exports) {
    // Export to CommonJS
    module.exports = material;
} else {
    window.material = material;
}
