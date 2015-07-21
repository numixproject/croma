let Constants = require("../constants.json"),
    React = require("react-native"),
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
        margin: Constants.spacing
    },
    info: {
        flexDirection: "row",
        textAlign: "center",
        marginBottom: Constants.spacing
    }
});

var Full = React.createClass({
    propTypes: {
        color: React.PropTypes.object
    },

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
                <Text style={[ styles.header, { color: darkness > 0.4 ? Constants.colorWhite : Constants.colorBlack, opacity: 0.7 } ]}>{hex.toUpperCase()}</Text>

                {this.getItems(c).map(item =>
                    <View style={styles.info}>
                        <Text style={{ color: darkness > 0.4 ? Constants.colorWhite : Constants.colorBlack, opacity: 0.5 }}>{item.key} </Text>
                        <Text style={{ color: darkness > 0.4 ? Constants.colorWhite : Constants.colorBlack }}>{item.value}</Text>
                    </View>
                )}
            </View>
        );
    }
});

module.exports = Full;
