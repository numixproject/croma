import React from "react-native";
import Card from "./card";
import CardAction from "./card-action";
import Constants from "../constants.json";

const {
    StyleSheet,
    TouchableHighlight,
    View,
    Text
} = React;

const styles = StyleSheet.create({
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

export default class ColorCard extends React.Component {
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
