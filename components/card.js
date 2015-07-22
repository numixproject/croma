let Constants = require("../constants.json"),
    React = require("react-native");

let { StyleSheet, View } = React;

let styles = StyleSheet.create({
    outer: {
        shadowColor: Constants.colorBlack,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.24,
        shadowRadius: 1.5,
        margin: Constants.spacing / 2
    },
    inner: {
        backgroundColor: Constants.colorWhite,
        borderRadius: 2,
        overflow: "hidden"
    }
});

let Card = React.createClass({
    propTypes: {
        children: React.PropTypes.any
    },

    render() {
        return (
            <View style={styles.outer}>
                <View {...this.props} style={[ styles.inner, this.props.style ]}>
                    {this.props.children}
                </View>
            </View>
        );
    }
});

module.exports = Card;
