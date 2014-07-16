/* jshint browser: true */
/* global $ */

    $.Velocity.Sequences.swipeOut = function (el, options) {
        var duration = options.duration || 200;

        $.Velocity.animate(el,{
            translateX: "100%",
            opacity: 0
        }, {
            duration: duration,
            easing: [0.7,0.1,0.57,0.79]
        });

        $.Velocity.animate(el,{
            height: 0,
            paddingTop: 0,
            paddingBottom: 0
        }, {
            duration: duration,
            display: "none"
        });
    };
