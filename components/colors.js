let Constants = require("../constants.json"),
    React = require("react-native"),
    ColorCard = require("./color-card.js"),
    Details = require("./full.js");

let { StyleSheet, ListView } = React;

let styles = StyleSheet.create({
    page: {
        backgroundColor: Constants.colorLightGray,
        padding: Constants.spacing / 2
    }
});

class Colors extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(this.props.palette.colors)
        };
    }

    onPress(color) {
        this.props.navigator.push({
            title: color.color,
            component: Details,
            passProps: { color }
        });
    }

    renderRow(color) {
        return (
            <ColorCard
                color={color}
                key={color.name}
                onPress={() => this.onPress(color)}
            />
        );
    }

    render() {
        return (
            <ListView
                style={styles.page}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}

Colors.propTypes = {
    palette: React.PropTypes.object
};


module.exports = Colors;
