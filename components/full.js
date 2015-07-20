let React = require("react-native"),
    Color = require("pigment/full");

let { StyleSheet, Text, View } = React;

let styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        fontSize: 36,
        textAlign: "center",
        margin: 10
    },
    info: {
        flexDirection: "row",
        textAlign: "center",
        marginBottom: 5
    }
});

var Full = React.createClass({
    getItems(c) {
        return [
            { key: "RGB", value: c.torgb() },
            { key: "HSL", value: c.tohsl() },
            { key: "HSV", value: c.tohsv() },
            { key: "HWB", value: c.tohwb() },
            { key: "CMYK", value: c.tocmyk() },
            { key: "Luminance", value: parseFloat(c.luminance()).toFixed(2) },
            { key: "Darkness", value: parseFloat(c.darkness()).toFixed(2) }
        ];
    },
    render() {
        let c = new Color(this.props.color.color),
            hex = c.tohex(),
            darkness = c.darkness();

        return (
            <View style={[ styles.container, { backgroundColor: hex } ]}>
                <Text style={[ styles.header, { color: darkness > 0.5 ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.7)" } ]}>{hex.toUpperCase()}</Text>

                {this.getItems(c).map(item =>
                    <View style={styles.info}>
                        <Text style={{ color: darkness > 0.5 ? "rgba(255,255,255,.5)" : "rgba(0,0,0,.5)" }}>{item.key} </Text>
                        <Text style={{ color: darkness > 0.5 ? "#fff" : "#000" }}>{item.value}</Text>
                    </View>
                )}
            </View>
        );
    }
});

module.exports = Full;
