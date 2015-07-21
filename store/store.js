var data = require("./data.json");

module.exports = {
    getAll() {
        var model = [],
            colors, c, p;

        for (var palette in data) {
            colors = [];
            p = data[palette];

            if (p && p.colors) {
                c = p.colors;

                for (var color in c) {
                    colors.push({ color, time: c && c[color] ? c.created : Date.now() });
                }

                model.push({ name: palette, time: p ? p.created : Date.now(), colors });
            }
        }

        return model;
    }
};
