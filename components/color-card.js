let Constants = require("../constants.json"),
    Card = require("./card.js"),
    React = require("react-native");

let { StyleSheet, TouchableHighlight, View, Text } = React;

let styles = StyleSheet.create({
    color: { height: 100 },
    label: { padding: Constants.spacing * 2 }
});

let ColorCard = React.createClass({
    propTypes: {
        color: React.PropTypes.object
    },

    render() {
        return (
            <Card>
                <TouchableHighlight {...this.props} underlayColor={Constants.colorWhite}>
                    <View style={[ styles.color, { backgroundColor: this.props.color.color } ]} />
                </TouchableHighlight>
                <Text style={styles.label}>{this.props.color.color}</Text>
            </Card>
        );
    }
});

module.exports = ColorCard;
