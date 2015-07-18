"use strict";

var React = require("react-native"),
    Color = require("pigment/full");

var { StyleSheet, Text, View } = React;

var Details = React.createClass({
    geStyles: function(c) {
        return StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: c.tohex()
            },
            header: {
                fontSize: 36,
                textAlign: "center",
                margin: 10,
                color: c.darkness() > .5 ? "#fff" : "rgba(0,0,0,0.9)"
            },
            info: {
                textAlign: "center",
                marginBottom: 5,
                color: c.darkness() > .5 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)"
            }
        });
    },

    render: function() {
        var c = new Color(this.props.color),
            styles = this.geStyles(c);

        return (
            <View style={styles.container}>
                <Text style={styles.header}>{c.tohex().toUpperCase()}</Text>

                <Text style={styles.info}>RGB: {c.torgb()}</Text>
                <Text style={styles.info}>HSL: {c.tohsl()}</Text>
                <Text style={styles.info}>HSV: {c.tohsv()}</Text>
                <Text style={styles.info}>HWB: {c.tohwb()}</Text>
                <Text style={styles.info}>CMYK: {c.tocmyk()}</Text>
                <Text style={styles.info}>Luminance: {parseFloat(c.luminance()).toFixed(2)}</Text>
                <Text style={styles.info}>Darkness: {parseFloat(c.darkness()).toFixed(2)}</Text>
            </View>
        );
    }
});

module.exports = Details;
