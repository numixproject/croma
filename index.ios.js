let Constants = require("./constants.json"),
    React = require("react-native"),
    Home = require("./components/palettes.js");

let { AppRegistry, StyleSheet, NavigatorIOS, AlertIOS } = React;

let styles = StyleSheet.create({
    nav: { flex: 1 }
});

var croma = React.createClass({
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
});

AppRegistry.registerComponent("croma", () => croma);
