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
    palette: {
        alignItems: "stretch",
        flexDirection: "row",
        height: 100
    },
    color: { flex: 1 },
    bottom: {
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        flex: 1,
        marginHorizontal: Constants.spacing * 2
    }
});

export default class PaletteCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card>
                <TouchableHighlight {...this.props} underlayColor={Constants.colorWhite}>
                    <View style={styles.palette}>
                        {this.props.palette.colors.map(item => <View style={[ styles.color, { backgroundColor: item.color } ]} key={item.color} />)}
                    </View>
                </TouchableHighlight>
                <View style={styles.bottom}>
                    <Text style={styles.label}>{this.props.palette.name}</Text>
                    <CardAction name="create" />
                    <CardAction name="delete" />
                </View>
            </Card>
        );
    }
}

PaletteCard.propTypes = {
    palette: React.PropTypes.object
};
