import React from "react-native";
import Icon from "./icon";

const {
    StyleSheet,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    icon: {
        flex: 0,
        height: 48,
        width: 48,
        alignItems: "center",
        justifyContent: "center",
        opacity: .7
    }
});

export default class CardAction extends React.Component {
    render() {
        return (
            <TouchableHighlight {...this.props} underlayColor={"rgba(0, 0, 0, .1)"}>
                <Icon color="black" name={this.props.name} style={styles.icon} />
            </TouchableHighlight>
        );
    }
}

CardAction.propTypes = {
    palette: React.PropTypes.object
};
