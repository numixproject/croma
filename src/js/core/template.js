'use strict';

class Template {
    constructor() {
        this._cache = {};
    }

    compile(template) {
        /* eslint-disable no-new-func */
        if (typeof template !== 'string') {
            throw new Error('Template must be a string');
        }

        const fn = this._cache[template] = this._cache[template] ||

            // Generate a reusable function that will serve as a template generator
            // The data is passed as "model"
            new Function('model', ((() => {
                const parts = template.split(/<%|%>/);
                let body = 'var t=[],printtext=function(){t.push.apply(t,arguments);};';

                /* This function needs to be ES5 */
                function tohtml(s) {
                    // Escape &, <, > and quotes to prevent XSS
                    // Convert new lines to <br> tags
                    return s
                        .toString()
                        .replace(/&/g, '&#38')
                        .replace(/</g, '&#60;').replace(/>/g, '&#62;')
                        .replace(/"/g, '&#34').replace(/'/g, '&#39;')
                        .replace(/(?:\\r\\n|\\r|\\n)/g, '<br>');
                }

                body += `var tohtml=${tohtml.toString()};`;

                for (let i = 0, l = parts.length; i < l; i++) {
                    /* eslint-disable no-nested-ternary */
                    body += i % 2 ? (
                        parts[i][0] === '=' ? `printtext(tohtml(${parts[i].substr(1)}));` :
                        parts[i][0] === '-' ? `printtext(${parts[i].substr(1)});` : parts[i]
                    ) : `t.push('${parts[i].replace(/\n/g, '\\n\\\n').replace(/'/g, "\\'")}');`;

                    body += '\n';
                }

                body += ";return t.join('');";

                return body;
            })()));

        return fn;
    }

    render(template, data) {
        if (typeof template !== 'string') {
            throw new Error('Template must be a string');
        }

        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        return this.compile(template)(data);
    }
}

module.exports = Template; // eslint-disable-line import/no-commonjs
