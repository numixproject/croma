/* global MozActivity */

const fxos = (() => {
    const domain = 'http://croma.numixproject.org';

    function shareItem(title, body) {
        return new MozActivity({
            name: 'new',
            data: {
                type: 'mail',
                url: `mailto:?Subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
            }
        });
    }

    return {
        supported: !!('MozActivity' in window),
        shareItem,
        shareWithLink: (title, content, path) => shareItem(title, `${content}\n${domain}/${path}`)
    };
})();

export default fxos;
