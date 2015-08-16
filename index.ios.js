let Constants = require("./constants.json"),
    React = require("react-native"),
    Home = require("./components/home.js");

let { AppRegistry, StyleSheet, NavigatorIOS, AlertIOS } = React;

let styles = StyleSheet.create({
    nav: { flex: 1 }
});

class croma extends React.Component {
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

AppRegistry.registerComponent("croma", () => croma);
