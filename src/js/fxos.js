/* global MozActivity */

let fxos = (() => {
    const domain = "http://croma.numixproject.org";

    function shareItem(title, body) {
        return new MozActivity({
            name: "new",
            data: {
                type: "mail",
                url: "mailto:?Subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body)
            }
        });
    }

    return {
        supported: !!("MozActivity" in window),
        shareItem: shareItem,
        shareWithLink: (title, content, path) => shareItem(title, content + "\n" + domain + "/" + path)
    };
})();

module.exports = fxos;
