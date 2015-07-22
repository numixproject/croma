let Constants = require("../constants.json"),
    React = require("react-native"),
    ColorCard = require("./color-card.js"),
    Details = require("./details.js");

let { StyleSheet, ListView } = React;

let styles = StyleSheet.create({
    page: {
        backgroundColor: Constants.colorLightGray,
        padding: Constants.spacing / 2
    }
});

let Colors = React.createClass({
    propTypes: {
        palette: React.PropTypes.object
    },

    onPress(color) {
        this.props.navigator.push({
            title: color.color,
            component: Details,
            passProps: { color }
        });
    },

    getInitialState() {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        return {
            dataSource: ds.cloneWithRows(this.props.palette.colors)
        };
    },

    renderRow(color) {
        return (
            <ColorCard
                color={color}
                key={color.name}
                onPress={() => this.onPress(color)}
            />
        );
    },

    render() {
        return (
            <ListView
                style={styles.page}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
            />
        );
    }
});

module.exports = Colors;
