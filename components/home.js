let React = require("react-native"),
    Palette = require("./palette.js"),
    Details = require("./details.js"),
    Page = require("./page.js"),
    store = require("../store/store.js");

var Home = React.createClass({
    onPress(palette) {
        this.props.navigator.push({
            title: palette.name,
            component: Details,
            rightButtonTitle: "Add",
            passProps: { palette }
        });
    },

    render() {
        return (
            <Page>
                {store.getPalettes().map(palette => <Palette palette={palette} key={palette.name} onPress={() => this.onPress(palette)} />)}
            </Page>
        );
    }
});

module.exports = Home;
