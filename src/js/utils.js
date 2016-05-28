import $ from 'jquery';
import Color from 'pigment/full';
import Storage from './core/storage';
import fxos from './fxos';

const utils = (() => {
    const productId = 'ultimate';

    const store = new Storage();

    return {

        // Convert camelCase to sentence
        parseCamelCase: (text) => {
            if (typeof text !== 'string') {
                return '';
            }

            return text
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
            .replace(/^./, (str) => str.toUpperCase());
        },

        getData: (palette) => {
            const palettes = store.get('palettes') || {};

            if (palette) {
                return palettes[palette];
            } else {
                return palettes;
            }
        },

        setData: (palette, data) => {
            if (!palette) {
                return null;
            }

            const palettes = utils.getData();

            if (typeof data === 'undefined' || data === null) {
                delete palettes[palette];
            } else {
                palettes[palette] = data;
            }

            return store.set('palettes', palettes);
        },

        // Remove a card from the UI
        removeItem: (palette, color, callback) => {
            if (typeof palette !== 'string') {
                return;
            }

            let $el;

            if (color) {
                $el = $(`[data-color="${color}"]`);
            } else {
                $el = $(`[data-palette="${palette}"]`);
            }

            // Let's save the styles so we can undo them
            $el.data('styles', {
                height: $el.css('height'),
                paddingTop: $el.css('padding-top'),
                paddingBottom: $el.css('padding-bottom'),
                marginTop: $el.css('margin-top'),
                marginBottom: $el.css('margin-bottom')
            });

            // Swipe out the card
            $el.velocity({
                opacity: 0,
                translateX: '100%'
            }, {
                duration: 300,
                easing: [ 0.7, 0.1, 0.57, 0.79 ]
            }).velocity({
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                translateX: 0
            }, {
                duration: 150,
                complete: () => {
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },

        // Undo remove a card from the UI
        undoRemoveItem: (palette, color, callback) => {
            if (typeof palette !== 'string') {
                return;
            }

            let $el;

            if (color) {
                $el = $(`[data-color="${color}"]`);
            } else {
                $el = $(`[data-palette="${palette}"]`);
            }

            // Restore the card
            $el.velocity(
                $el.data('styles'), 150
            ).velocity({ opacity: 1 }, {
                duration: 150,
                complete: () => {
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },

        // Toggle love color in the UI and database
        loveItem: (palette) => {
            if (typeof palette !== 'string') {
                return;
            }

            const $card = $(`[data-palette="${palette}"]`), $button = $card.find('.card-item-action-love');

            // Add class to animate the click
            $button.addClass('clicked');

            setTimeout(() => {
                $button.removeClass('clicked');
            }, 500);

            // Toggle love
            $card.toggleClass('card-item-loved');
        },

        // Trigger a file download
        downloadFile: (filename, content) => {
            const el = document.createElement('a');

            el.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
            el.setAttribute('download', filename);
            el.click();
        },

        // Convert color hashmap to human readable text
        paletteToText: (palette, colors) => {
            const content = [
                `Name: ${palette}\n`,
                'Colors:'
            ];

            for (const c in colors) {
                content.push(c);
            }

            return `${content.join('\n')}\n`;
        },

        // Convert query parameter to array
        queryToPalette: (q) => {
            const query = decodeURIComponent(q);

            if ((/^(([0-9]{1,3},){2}[0-9]{1,3}(,.)?[:])+[:]?$/).test(`${query}:`)) {
                const colors = query.replace(/:$/, '').split(':'), objs = [];

                for (const c of colors) {
                    const rgb = c.split(',');

                    objs.push(new Color({
                        red: parseInt(rgb[0], 10),
                        green: parseInt(rgb[1], 10),
                        blue: parseInt(rgb[2], 10),
                        alpha: rgb[3] ? parseFloat(rgb[3]) : rgb[3]
                    }));
                }

                return objs;
            } else {
                return Color.parse(query);
            }
        },

        // Convert color hashmap to query parameter
        paletteToQuery: (colors) => {
            let query = '';

            for (const c in colors) {
                const rgb = new Color(c).rgb;

                query += `${rgb.join(',')}:`;
            }

            return encodeURI(query);
        },

        // Convert color hashmap to link
        paletteToPath: (colors, name) => {
            let path = '#/palette/show?';

            if (name) {
                path += `name=${encodeURIComponent(name)}&`;
            }

            path += `palette=${utils.paletteToQuery(colors)}`;

            return path;
        },

        // Convert colors hashmap to GIMP Palette
        paletteToGPL: (palette, colors) => {
            const content = [
                'GIMP Palette',
                `Name: ${palette}`,
                'Columns: 4',
                '#'
            ];

            for (const c in colors) {
                const rgb = new Color(c).rgb;

                content.push(
                    `${rgb.join('\t')}\t${c}`
                );
            }

            return `${content.join('\n')}\n`;
        },

        // Share a palette
        shareItem: (palette) => {
            if ((!palette) || typeof palette !== 'string') {
                return;
            }

            const data = utils.getData(palette);

            if ('androidTools' in window && window.androidTools.shareWithLink) {
                try {
                    window.androidTools.shareWithLink('Share palette', utils.paletteToText(palette, data.colors), utils.paletteToPath(data.colors, palette));
                } catch (e) {
                    utils.showToast({
                        body: e,
                        timeout: 3000
                    });
                }
            } else if (fxos.supported) {
                fxos.shareWithLink('Share palette', utils.paletteToText(palette, data.colors), utils.paletteToPath(data.colors, palette));
            } else {
                utils.downloadFile(`${palette}.gpl`, utils.paletteToGPL(palette, data.colors));
            }
        },

        // Get palette from an image
        getPalette: (check) => {
            const supported = ('imageUtils' in window && window.imageUtils.getPalette);

            if (check === true) {
                return supported;
            }

            if (supported) {
                try {
                    window.imageUtils.getPalette();
                } catch (e) {
                    utils.showToast({
                        body: e,
                        timeout: 3000
                    });
                }
            }

            return false;
        },

        // Copy text to clipboard
        copyToClipboard: (label, text) => {
            const supported = ('androidTools' in window && window.androidTools.copyToClipboard);

            if (label === true) {
                return supported;
            }

            if (supported) {
                try {
                    window.androidTools.copyToClipboard(label, text);
                } catch (e) {
                    utils.showToast({
                        body: e,
                        timeout: 3000
                    });
                }
            }

            return false;
        },

        // Check if pro version
        isPro: () => {
            let purchased = false;

            if ('inAppBilling' in window && window.inAppBilling.isPurchased) {
                try {
                    purchased = (window.inAppBilling.isPurchased(productId) === 'true');
                } catch (e) {
                    purchased = false;
                }
            } else {
                purchased = true;
            }

            return purchased;
        },

        // Unlock pro version with IAP
        unlockPro: () => {
            const supported = ('inAppBilling' in window && window.inAppBilling.purchase);

            if (supported) {
                try {
                    window.inAppBilling.purchase(productId);
                } catch (e) {
                    utils.showToast({
                        body: e,
                        timeout: 3000
                    });
                }
            } else {
                location.href = 'https://play.google.com/store/apps/details?id=org.numixproject.croma';
            }
        },

        // Show a toast
        // @param {{ body: String, actions: Object, timeout: Number, persistent: Boolean }} options
        showToast: (options) => {
            let $wrapper = $('.toast-notification-wrapper'),
                $container = $wrapper.find('.toast-notification-container');

            if (!$wrapper.length) {
                $wrapper = $('<div>').addClass('toast-notification-wrapper');
                $wrapper.appendTo('body');
            }

            if (!$container.length) {
                $container = $('<div>').addClass('toast-notification-container');
                $container.appendTo($wrapper);
            }

            const $toast = $('<div>').addClass('toast-notification'), $segment = $('<div>').addClass('toast-notification-segment').html(options.body);

            $toast.append($segment);

            if (options.actions) {
                for (const action in options.actions) {
                    if (typeof options.actions[action] === 'function') {
                        $toast.append(
                            $('<div>').addClass(`toast-notification-segment toast-notification-action toast-notification-action-${action}`)
                            .text(action)
                            .on('click', options.actions[action])
                        );
                    }
                }
            }

            if (options.persistent) {
                $toast.addClass('toast-persistent');
            }

            $toast.on('click', function() {
                utils.hideToast(this);
            }).appendTo($container);

            if (options.timeout) {
                setTimeout(() => {
                    utils.hideToast($toast);
                }, options.timeout);
            }

            $(window).off('hashchange.toast').on('hashchange.toast', function(e) {
                const event = e.originalEvent;

                this.source = e.type;

                if (event && event.oldURL.replace('#/', '') !== event.newURL.replace('#/', '')) {
                    utils.hideToast.apply(this);
                }
            });

            return $toast;
        },

        // Hide toast
        hideToast(el, duration = 300) {
            /* eslint-disable no-nested-ternary */
            const $el = el ? $(el) : (this.source === 'hashchange') ? $('.toast-notification:not(.toast-persistent)') : $('.toast-notification');

            if ($.fn.velocity) {
                $el.velocity({
                    opacity: 0
                }, (duration / 2)).velocity({
                    height: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginTop: 0,
                    marginBottom: 0
                }, (duration / 2), function() {
                    $(this).remove();
                });
            } else {
                $el.remove();
            }
        },

        // Genrate legacy webkit gradient
        makeWebkitGradient: (colors, direction) => {
            let css = `-webkit-gradient(linear,${(direction === 'to bottom') ? 'left top,left bottom' : 'left top,right top'},`;

            for (let i = 0, l = colors.length; i < l; i++) {
                css += `color-stop(${(i / l) * 100}%,${colors[i]}),color-stop(${((i + 1) / l) * 100}%,${colors[i]})${(i === (l - 1)) ? '' : ','}`;
            }

            css += ')';

            return css;

        },

        // Generate CSS gradient
        makeGradient: (colors, direction) => {
            let css = `linear-gradient(${direction ? direction : 'to right'},`;

            for (let i = 0, l = colors.length; i < l; i++) {
                css += `${colors[i]} ${(i / l) * 100}%,${colors[i]} ${((i + 1) / l) * 100}%${(i === (l - 1)) ? '' : ','}`;
            }

            css += ')';

            return css;
        },

        // Prefix CSS properties
        prefixCss: (property, value) => {
            const prefixes = [ '-webkit-', '-moz-', '-o-', '' ];
            let css = '';

            for (const prefix of prefixes) {
                css += `${property}:${prefix}${value};`;
            }

            return css;
        },

        generateBackground: (colors, direction) => {
            if (!Array.isArray(colors)) {
                return '';
            }

            return `background-image:${utils.makeWebkitGradient(colors, direction)};${utils.prefixCss('background-image', utils.makeGradient(colors, direction))};`;
        },

        sortByDate: (a, b) => {
            if (a.created > b.created) {
                return -1;
            } else if (a.created < b.created) {
                return 1;
            } else {
                return 0;
            }
        },

        validateName: (name, tmp) => ((name && typeof name === 'string' && !(/^(null|undefined)$/).test(name)) && (tmp || !(/(^_\$.*|"|'|<|>)/).test(name)))
    };
})();

export default utils;
