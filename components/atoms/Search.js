import { TextInput } from "react-native-gesture-handler";
import React from "react";
import { styles as style, stylevar } from "../../Style";
import { Image, View } from "react-native";
import { icons } from "../../func/GetIcon";
const styles = style.input;

class Search extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
    };

    render() {
        return (
            <View style={styles.searchContainer}>
                <Image style={styles.searchIcon} source={icons.light.hollow.search} />
                <TextInput
                    style={styles.search}
                    placeholder="Search..."
                    placeholderTextColor={stylevar.text.placeholder}
                />
            </View>
        );
    };
};

export { Search };