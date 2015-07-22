let Constants = require("../constants.json"),
    React = require("react-native"),
    Palette = require("./palette.js"),
    Full = require("./full.js");

let { StyleSheet, ListView } = React;

let styles = StyleSheet.create({
    page: {
        backgroundColor: Constants.colorLightGray,
        padding: Constants.spacing / 2
    }
});

let Details = React.createClass({
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

    getInitialState() {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        return {
            dataSource: ds.cloneWithRows(this.props.palette.colors)
        };
    },

    renderRow(color) {
        return (
            <Palette
                palette={{ name: color.color, colors: [ color ] }}
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

module.exports = Details;
