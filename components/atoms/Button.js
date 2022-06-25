import { styles as style, stylevar } from "../../Style";
import { ActivityIndicator, Image, TouchableOpacity, Animated, Easing, View } from "react-native";
import React from "react";
import { Haptic } from "../../func/Haptic";
import { InputText } from "./Text";
import { icons } from "../../func/GetIcon";
import AnimatedNumbers from "react-native-animated-numbers";

const styles = style.input; /*- Input styles lies here -*/

class Button extends React.PureComponent {
    constructor(props) {
        super(props);
    }
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {styles.submitInput}
                onPress              = {() => {
                    this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = {0.8}
            >
                <InputText color={this.is_hollow ? stylevar.colors.main : "#fff"}>{this.props.children}</InputText>
            </TouchableOpacity>
        );
    }
}

class ComposeButton extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Changeable -*/
        this.state = {
            iconOpacity: new Animated.Value(0)
        };

        /*- Delete icon or not -*/
		this.delete = this.props.delete || false;
        this.icons = {
            "delete": icons.light.filled.delete,
            "edit": icons.light.filled.edit,
            "home": icons.light.hollow.home
        };
		this.icon = this.icons[this.props.icon] || this.icons.edit;

        /*- Loading or not -*/
        this.loading = this.props.loading || false;
        this.absolute = this.props.absolute;

        /*- Function bindings -*/
        // this.onLeave = this.onLeave.bind(this);
    };

    /*- Init -*/
    componentDidMount() {
        Animated.timing(this.state.iconOpacity, {
            duration: 1400,
            toValue: 1,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };
       
    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style                = {[styles.composeButton, this.absolute && styles.composeButtonAbsolute]}
                onPress              = {() => {
                    // this.onLeave();
                    this.props.onPress();
                    Haptic("medium");
                }}
                activeOpacity	     = {0.8}
            >
                {
                    this.loading
                        ? <ActivityIndicator color="white" />
                        : <Animated.Image
                            style={[styles.icon, {
                                opacity: this.state.iconOpacity,
                            }]}
                            source={this.icon}
                        />
                }
            </TouchableOpacity>
        );
    }
};

class UpvoteButton extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Changeable -*/
        this.state = {
            active: this.props.active || false,
            style: styles.likeContainer,
            likes: this.props.likes.length
        };

        /*- Function bindings -*/
        this.handlePress = this.handlePress.bind(this);

        /*- Static -*/
        this.mounted = false;
    };

    /*- Handle the press -*/
    handlePress() {
        this.props.onPress && this.props.onPress();
        Haptic("medium");

        const new_state = !this.state.active;
        this.setState({
            active: new_state,
            style: new_state
                ? styles.likeContainerActive
                : styles.likeContainer,

            likes: this.state.likes + (new_state ? 1 : -1)
        });
    };

    /*- Init -*/
    componentDidMount() {
        this.mounted = true;

        /*- Update the state -*/
        if (this.mounted) this.setState({
            style: this.props.active
                ? styles.likeContainerActive
                : styles.likeContainer
        });
    };

    /*- Unmount -*/
    componentWillUnmount() {
        this.mounted = false;
    };

    /*- Render the button -*/
    render() {
        return (
            <TouchableOpacity
                style={this.state.style}
                activeOpacity={0.8}
                onPress={this.handlePress}
            >
                <Image source={icons.dark.filled.up} style={styles.likeIcon} />
                <AnimatedNumbers
                    includeComma
                    animateToNumber={this.state.likes}
                    animationDuration={200}
                    fontStyle={this.state.active ? styles.likeTextActive : styles.likeText}
                />
            </TouchableOpacity>
        )
    };
};

export {
    Button,
    ComposeButton,
    UpvoteButton
}