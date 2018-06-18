let data = require("./data.json");

class Store {
    getAll() {
        let model = [];

        for (let palette in data) {
            let colors = [],
                p = data[palette];

            if (p && p.colors) {
                let c = p.colors;

                for (var color in c) {
                    colors.push({ color, time: c && c[color] ? c.created : Date.now() });
                }

                model.push({ name: palette, time: p ? p.created : Date.now(), colors });
            }
        }

        return model;
    }
}

module.exports = new Store();
