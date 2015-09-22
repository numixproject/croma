let Constants = require("./constants.json"),
    React = require("react-native"),
    Home = require("./components/home.js");

let {
    AppRegistry,
    Navigator,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} = React;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: Constants.colorPrimary
    },
    title: {
        color: Constants.colorWhite,
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 14,
        paddingHorizontal: 4
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16
    },
    scene: {
        flex: 1,
        marginTop: 56,
        backgroundColor: Constants.colorLightGray
    }
});

const NavigationBarRouteMapper = {
    LeftButton(route, navigator) {
        if (route.index === 0) {
            return null;
        }

        return (
            <TouchableOpacity onPress={() => navigator.pop()}>
                <Image source={require("image!ic_back_white")} style={styles.icon} />
            </TouchableOpacity>
        );
    },

    RightButton(route) {
        if (route.rightButtonIcon) {
            return (
                <TouchableOpacity onPress={route.onRightButtonPress}>
                    <route.rightButtonIcon style={styles.icon} />
                </TouchableOpacity>
            );
        }
    },

    Title(route) {
        return (
            <Text style={styles.title}>
                {route.title}
            </Text>
        );
    }
};

class Croma extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Navigator
                style={styles.nav}
                initialRoute={{
                    title: "Palettes",
                    component: Home,
                    rightButtonTitle: "Add",
                    index: 0,
                    onRightButtonPress: () => {
                    }
                }}
                renderScene={(route, navigator) =>
                    <route.component
                        {...route.passProps}
                        navigator={navigator}
                        style={styles.scene}
                        />
                }
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={NavigationBarRouteMapper}
                        style={styles.navbar}
                    />
                }
            />
        );
    }
}

AppRegistry.registerComponent("Croma", () => Croma);
