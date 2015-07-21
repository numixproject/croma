let Constants = require("../constants.json"),
    React = require("react-native");

let { StyleSheet, View, ScrollView } = React;

let styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: Constants.colorLightGray,
        padding: Constants.spacing / 2
    }
});

var Page = React.createClass({
    propTypes: {
        children: React.PropTypes.element
    },

    render() {
        return (
            <ScrollView style={[ styles.page, this.props.style ]}>
                <View>
                    {this.props.children}
                </View>
            </ScrollView>
        );
    }
});

module.exports = Page;
