import React from "react-native";
import Constants from "./constants.json";
import Home from "./views/home";

const {
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    AlertIOS
} = React;

const styles = StyleSheet.create({
    nav: { flex: 1 }
});

export default class Croma extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NavigatorIOS
                style={styles.nav}
                initialRoute={{
                    title: "Palettes",
                    component: Home,
                    rightButtonTitle: "Add",
                    onRightButtonPress: () => {
                        AlertIOS.alert(
                            "Whatcha doin?",
                            "You can't add a palette yet, silly",
                            [ { text: "Okay" } ]
                        );
                    }
                }}
                barTintColor={Constants.colorPrimary}
                titleTextColor={Constants.colorText}
                tintColor={Constants.colorText}
            />
        );
    }
}

AppRegistry.registerComponent("Croma", () => Croma);
