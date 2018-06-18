import React from "react-native";
import Constants from "../constants.json";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
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

export default class Card extends React.Component {
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
