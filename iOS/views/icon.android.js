import React from "react-native";

const {
    StyleSheet,
    View,
    Image
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
        const { name, color } = this.props;

        let image;

        switch (name) {
        case "back":
            image = color === "white" ? require("image!ic_back_white") : require("image!ic_back_black");
            break;
        case "create":
            image = color === "white" ? require("image!ic_create_white") : require("image!ic_create_black");
            break;
        case "delete":
            image = color === "white" ? require("image!ic_delete_white") : require("image!ic_delete_black");
            break;
        }


        return (
            <View {...this.props}>
                <Image
                    ref={c => this._root = c}
                    source={image}
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
