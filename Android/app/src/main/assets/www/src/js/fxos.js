var fxos = (function() {
    var supported = !!("MozActivity" in window),
        domain = "http://croma.numixproject.org";

    function shareItem(title, body) {
        new MozActivity({
            name: "new",
            data: {
                type: "mail",
                url: "mailto:?Subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body)
            }
        });
    }

    return {
        supported: supported,
        shareItem: shareItem,
        shareWithLink: function(title, content, path) {
            var body = content + "\n" + domain + "/" + path;

            shareItem(title, body);
        }
    };
}());

export default fxos;
