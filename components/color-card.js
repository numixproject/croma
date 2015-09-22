let Constants = require("../constants.json"),
    Card = require("./card.js"),
    CardAction = require("./card-action.js"),
    React = require("react-native");

let { StyleSheet, TouchableHighlight, View, Text } = React;

let styles = StyleSheet.create({
    color: { height: 100 },
    bottom: {
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        flex: 1,
        marginHorizontal: Constants.spacing * 2
    }
});

class ColorCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <TouchableHighlight {...this.props} underlayColor={Constants.colorWhite}>
                    <View style={[ styles.color, { backgroundColor: this.props.color.color } ]} />
                </TouchableHighlight>
                <View style={styles.bottom}>
                    <Text style={styles.label}>{this.props.color.color}</Text>
                    <CardAction name="delete" />
                </View>
            </Card>
        );
    }
}

ColorCard.propTypes = {
    color: React.PropTypes.object
};

module.exports = ColorCard;
