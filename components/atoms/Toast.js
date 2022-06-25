import React from "react";
import { Animated, Easing, Image, Text, TouchableOpacity } from "react-native";
import { styles as style, toastWidth } from "../../Style";
import { icons } from "../../func/GetIcon";
const styles = style.input;
const toastStart = -75;

class Toast extends React.PureComponent {
    constructor(props) {
        super(props);

        /*- Changeable -*/
        this.state = {
            y: new Animated.Value(toastStart),
            progress: new Animated.Value(toastWidth),
        };

        /*- Statics -*/
        this.animDuration = props.animDuration || 400;
        this.text         = props.text || "";
        this.title        = props.title || "";
        this.duration     = props.duration || 4000;
        this.shouldHide   = true;

        /*- Function bindings -*/
        this.onPress = this.onPress.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    };

    /*- On press -*/
    onPress() {
        this.hide();
    };

    /*- Show the toast -*/
    show() {
        this.shouldHide = false;

        /*- Show / slide down -*/
        Animated.timing(this.state.y, {
            toValue        : 60,
            duration       : this.animDuration,
            useNativeDriver: true,
        }).start();

        /*- Progress bar -*/
        Animated.timing(this.state.progress, {
            toValue        : 0,
            duration       : this.duration,
            useNativeDriver: false,
            easing         : Easing.linear
        }).start();

        /*- Hide / slide up -*/
        setTimeout(this.hide, this.duration - 50);
    };

    /*- Hide the toast -*/
    hide() {
        if (this.shouldHide == true) { return; };
            this.shouldHide =  true;

        /*- Hide / slide up -*/
        Animated.timing(this.state.y, {
            toValue        : toastStart,
            duration       : this.animDuration,
            useNativeDriver: true,
        }).start();

        /*- onClose -*/
        setTimeout(this.props.onClose && this.props.onClose, this.animDuration);
    };

    /*- Init -*/
    componentDidMount() {
        this.show();
    };

    /*- Render the toast -*/
    render() {
        return (
            <Animated.View style={[styles.toastContainer, {
                transform: [{ translateY: this.state.y }]
            }]}>
                <TouchableOpacity onPress={this.onPress} style={styles.toast}>
                    <Text style={styles.toastTitle}>{this.title}</Text>
                    <Text style={styles.toastText}>{this.text}</Text>
                    <Image source={icons.light.filled.danger} style={styles.toastClose} />
                    <Animated.View style={[styles.toastProgress, {
                        width: this.state.progress,
                    }]}></Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    };
};

export { Toast };