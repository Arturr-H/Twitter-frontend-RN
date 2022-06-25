/*- Imports -*/
import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { styles as style } from "../../Style";
import { ComposeButton } from "../../components/AtomBundle";
import { SharedElement } from "react-navigation-shared-element";
import { icons } from "../../func/GetIcon";

/*- Feed styles lies here -*/
const styles = style.navbar;

class Navbar extends React.PureComponent {

    /*- Construct the component -*/
    constructor(props) {
        super(props);

        /*- Changeable -*/
        this.state = {
        }

        /*- Static -*/
        this.navigation = this.props.navigation;
        this.active = this.props.active;

        /*- Function bindings -*/
    }

    render() {
        return (
            <View style={styles.navbar}>
                <Icon active={this.active == "home"} name="home" onPress={() => this.navigation.navigate("Home")} />
                <SharedElement id="SharedComposeButton"><ComposeButton onPress={() => this.navigation.navigate("Compose")} /></SharedElement>
                <Icon active={this.active == "explore"} name="discovery" onPress={() => this.navigation.navigate("Explore")}/>
            </View>
        );
    }
};

class Icon extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Static -*/
        this.icons = {
            home: icons.light.hollow.home,
            discovery: icons.light.hollow.explore,
        }
        this.active = this.props.active || false;
    };

    render() {
        return (
            <TouchableOpacity
                style={[styles.iconContainer, this.active && styles.iconContainerActive]}
                activeOpacity={0.8}
                onPress={this.props.onPress}
            >
                <Image style={styles.icon} source={this.icons[this.props.name]} />
            </TouchableOpacity>
        );
    };
};

export {
    Navbar
}