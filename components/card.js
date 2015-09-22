let Constants = require("../constants.json"),
    React = require("react-native");

let { StyleSheet, View } = React;

let styles = StyleSheet.create({
    outer: {
        marginVertical: Constants.spacing / 2,
        marginHorizontal: Constants.spacing
    },
    inner: {
        backgroundColor: Constants.colorWhite,
        borderRadius: 2,
        overflow: "hidden"
    }
});

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.outer}>
                <View {...this.props} style={[ styles.inner, this.props.style ]}>
                    {this.props.children}
                </View>
            </View>
        );
    }
}

Card.propTypes = {
    children: React.PropTypes.any
};

module.exports = Card;
