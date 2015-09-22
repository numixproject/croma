import React from "react-native";
import PaletteCard from "./palette-card";
import Colors from "./colors";
import store from "../store/store";
import Constants from "../constants.json";

const {
    ListView
} = React;

export default class Home extends React.Component {
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
