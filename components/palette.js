let Constants = require("../constants.json"),
    Card = require("./card.js"),
    React = require("react-native");

let { StyleSheet, View, Text } = React;

let styles = StyleSheet.create({
    palette: {
        alignItems: "stretch",
        flexDirection: "row",
        height: 100
    },
    color: {
        flex: 1
    },
    label: {
        padding: Constants.spacing * 1.5
    }
});

var Palette = React.createClass({
    render() {
        return (
            <Card {...this.props}>
                <View>
                    <View style={styles.palette}>
                        {this.props.palette.colors.map(item => <View style={[ styles.color, { backgroundColor: item.color } ]} key={item.color} />)}
                    </View>
                    <Text style={styles.label}>{this.props.palette.name}</Text>
                </View>
            </Card>
        );
    }
});

module.exports = Palette;
