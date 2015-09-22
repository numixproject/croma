import React from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24
    }
});

export default class CardAction extends React.Component {
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }

    render() {
        return (
            <View {...this.props}>
                <Icon
                    ref={c => this._root = c}
                    name={this.props.name}
                    size={24}
                    color={this.props.color}
                    style={styles.icon}
                />
            </View>
        );
    }
}

CardAction.propTypes = {
    name: React.PropTypes.string.isRequired,
    color: React.PropTypes.oneOf([ "white", "black" ]).isRequired
};
