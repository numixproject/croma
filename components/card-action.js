let React = require("react-native"),
    Icon = require("react-native-vector-icons/MaterialIcons");

let { StyleSheet, TouchableHighlight } = React;

let styles = StyleSheet.create({
    icon: {
        flex: 0,
        height: 48,
        padding: 14
    }
});

class PaletteCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight underlayColor={"rgba(0, 0, 0, .1)"}>
                <Icon size={20} color="#555" style={styles.icon} {...this.props} />
            </TouchableHighlight>
        );
    }
}

PaletteCard.propTypes = {
    palette: React.PropTypes.object
};

module.exports = PaletteCard;
