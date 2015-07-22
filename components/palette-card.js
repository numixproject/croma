let Constants = require("../constants.json"),
    Card = require("./card.js"),
    React = require("react-native");

let { StyleSheet, TouchableHighlight, View, Text } = React;

let styles = StyleSheet.create({
    palette: {
        alignItems: "stretch",
        flexDirection: "row",
        height: 100
    },
    color: { flex: 1 },
    label: { padding: Constants.spacing * 2 }
});

let PaletteCard = React.createClass({
    propTypes: {
        palette: React.PropTypes.object
    },

    render() {
        return (
            <Card>
                <TouchableHighlight {...this.props} underlayColor={Constants.colorWhite}>
                    <View style={styles.palette}>
                        {this.props.palette.colors.map(item => <View style={[ styles.color, { backgroundColor: item.color } ]} key={item.color} />)}
                    </View>
                </TouchableHighlight>
                <Text style={styles.label}>{this.props.palette.name}</Text>
            </Card>
        );
    }
});

module.exports = PaletteCard;
