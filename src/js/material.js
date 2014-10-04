var material = (function() {

    var animateIn = function(el) {
        var delay, item, offset,
            duration = 150,
            $el = $(el);

        // Return if no element found
        if (!$el.length) {
            return;
        }

        // Set initial opacity and enable hardware acceleration
        $el.css({
            "opacity": 0,
            "transform": "scale(0) translateZ(0)"
        });

        // Set transition properties for each element
        for (var i = 0, l = $el.length; i < l; i++) {
            item = $el[i];

            offset = item.offsetLeft + item.offsetTop;
            delay = offset * 0.5;

            $(item).css({
                "transition-delay": delay + "ms",
                "transition-duration": duration + "ms"
            });
        }

        // Transition the element
        $el.css({
            "opacity": 1,
            "transform": "scale(1) translateZ(0)"
        });

        // Reset CSS properties after transition
        setTimeout(function() {
            $el.css({
                "opacity": "",
                "transform": "",
                "transition-delay": "",
                "transition-duration": "",
                "transition-timing-function": ""
            });
        }, (delay + duration));
    };

    return {
        animateIn: animateIn
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
