"use strict";

var React = require("react-native"),
    Details = require("./components/details.js");

var AppRegistry = React.AppRegistry;

var croma = React.createClass({
    render: function() {
        return (
            <Details color="#f1544d" />
        );
    }
});

AppRegistry.registerComponent("croma", () => croma);
