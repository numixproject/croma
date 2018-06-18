import React from "react-native";
import Clipboard from "../modules/clipboard";
import Color from "pigment/full";
import Constants from "../constants.json";

const {
    StyleSheet,
    Text,
    View,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        fontSize: 36,
        textAlign: "center",
        margin: Constants.spacing,
        opacity: 0.7
    },
    info: {
        flexDirection: "row",
        textAlign: "center",
        borderRadius: 2,
        margin: Constants.spacing
    },
    key: { opacity: 0.5 },
    hint: { margin: Constants.spacing * 2 }
});

export default class Full extends React.Component {
    constructor(props) {
        super(props);

        this.state = { copied: null };
    }

    getItems(c) {
        return [
            { key: "RGB", value: c.torgb() },
            { key: "HSL", value: c.tohsl() },
            { key: "HSV", value: c.tohsv() },
            { key: "HWB", value: c.tohwb() },
            { key: "CMYK", value: c.tocmyk() },
            { key: "LAB", value: `lab(${c.lab[0].toFixed(2)}, ${c.lab[1].toFixed(2)}, ${c.lab[2].toFixed(2)})` },
            { key: "Luminance", value: (c.luminance() * 100).toFixed(2) + "%" },
            { key: "Darkness", value: (c.darkness() * 100).toFixed(2) + "%" }
        ];
    }

    copyToClipboard(text) {
        Clipboard.set(text);

        this.setState({ copied: true });

        if (this.copyTimeout) {
            clearTimeout(this.copyTimeout);
        }

        this.copyTimeout = setTimeout(() => this.setState({ copied: null }), 1500);
    }

    render() {
        let c = new Color(this.props.color.color),
            hex = c.tohex(),
            color = c.darkness() > 0.4 ? Constants.colorWhite : Constants.colorBlack;

        return (
            <View style={[ styles.container, { backgroundColor: hex } ]}>
                <Text style={[ styles.header, { color } ]}>{hex.toUpperCase()}</Text>

                {this.getItems(c).map(item =>
                    <TouchableHighlight underlayColor={"rgba(0, 0, 0, .1)"} onPress={() => this.copyToClipboard(item.value)}>
                        <View style={styles.info}>
                            <Text style={[ styles.key, { color } ]}>{item.key} </Text>
                            <Text style={{ color }}>{item.value}</Text>
                        </View>
                    </TouchableHighlight>
                )}

                <Text style={[ styles.hint, { color } ]}>{this.state.copied ? "Copied to clipboard!" : "Tap an item to copy"}</Text>
            </View>
        );
    }
}

Full.propTypes = {
    color: React.PropTypes.object
};
