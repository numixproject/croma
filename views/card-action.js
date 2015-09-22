import React from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const {
    StyleSheet,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    icon: {
        flex: 0,
        height: 48,
        padding: 14
    }
});

export default class CardAction extends React.Component {
    render() {
        return (
            <TouchableHighlight underlayColor={"rgba(0, 0, 0, .1)"}>
                <Icon size={20} color="#555" style={styles.icon} {...this.props} />
            </TouchableHighlight>
        );
    }
}

CardAction.propTypes = {
    palette: React.PropTypes.object
};
