let Constants = require("../constants.json"),
    React = require("react-native"),
    PaletteCard = require("./palette-card.js"),
    Colors = require("./colors.js"),
    store = require("../store/store.js");

let {
    ListView
} = React;

class Home extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(store.getAll())
        };
    }

    onPress(palette) {
        this.props.navigator.push({
            title: palette.name,
            component: Colors,
            rightButtonTitle: "Add",
            passProps: { palette }
        });
    }

    render() {
        return (
            <ListView
                {...this.props}
                dataSource={this.state.dataSource}
                renderRow={palette => <PaletteCard palette={palette} key={palette.name} onPress={() => this.onPress(palette)} />}
            />
        );
    }
}

module.exports = Home;
