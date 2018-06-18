import React from "react-native";
import ColorCard from "./color-card";
import Details from "./full";

const {
    ListView
} = React;

export default class Colors extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(this.props.palette.colors)
        };
    }

    onPress(color) {
        this.props.navigator.push({
            title: color.color,
            component: Details,
            passProps: { color }
        });
    }

    renderRow(color) {
        return (
            <ColorCard
                color={color}
                key={color.name}
                onPress={() => this.onPress(color)}
            />
        );
    }

    render() {
        return (
            <ListView
                {...this.props}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow.bind(this)}
            />
        );
    }
}

Colors.propTypes = {
    palette: React.PropTypes.object
};
