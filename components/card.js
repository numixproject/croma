let Constants = require("../constants.json"),
    React = require("react-native");

let { StyleSheet, TouchableHighlight } = React;

let styles = StyleSheet.create({
    card: {
        margin: Constants.spacing,
        backgroundColor: Constants.colorWhite,
        borderRadius: 2,
        shadowColor: Constants.colorBlack,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.16,
        shadowRadius: 1.5
    },
    wrapper: { flex: 1 }
});

var Card = React.createClass({
    render() {
        return (
            <TouchableHighlight
                {...this.props}
                style={[ styles.card, this.props.style ]}
                underlayColor={Constants.colorWhite}
                >
                {this.props.children}
            </TouchableHighlight>
        );
    }
});

module.exports = Card;
