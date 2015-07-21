let React = require("react-native"),
    Palette = require("./palette.js"),
    Full = require("./full.js"),
    Page = require("./page.js");

var Details = React.createClass({
    propTypes: {
        palette: React.PropTypes.object
    },

    onPress(color) {
        this.props.navigator.push({
            title: color.color,
            component: Full,
            passProps: { color }
        });
    },

    render() {
        return (
            <Page>
                {this.props.palette.colors.map(color => <Palette palette={{
                    name: color.color,
                    colors: [ color ]
                }} key={color.name} onPress={() => this.onPress(color)} />)}
            </Page>
        );
    }
});

module.exports = Details;
