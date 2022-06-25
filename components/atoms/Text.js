import { styles as style, stylevar } from "../../Style";
import { Text, View } from "react-native";
import React from "react";
const styles = style.text; /*- Text styles lies here -*/

const H1 = ({ children, ...props }) => (
    <Text style={styles.h1} {...props}>
        {children}
    </Text>
);

const H2 = ({ children, ...props }) => (
    <Text numberOfLines={1} style={[styles.h2, {
        textAlign: props.center ? "center" : "left",
        width: props.center ? "100%" : "auto"
    }]} {...props}>
        {children}
    </Text>
);

const H3 = ({ children, ...props }) => (
    <Text numberOfLines={3} style={styles.h3} {...props}>
        {children}
    </Text>
);

const P = ({ children, ...props }) => (
    <Text style={styles.p} {...props}>
        {children}
    </Text>
);

/*- Horizontal row -*/
const HR = ({ children, ...props }) => (
    <View style={[styles.hr, props.margin ?
        { marginBottom: "auto" } : { marginVertical: 10 }]} {...props} />
);
/*- Vertical row -*/
const VR = ({ children, ...props }) => (
    <View style={[styles.vr, props.thick ? { backgroundColor: stylevar.border.thick } : {}]} {...props} />
);

const InputText = ({ children, ...props }) => (
    <Text style={[styles.inputText, props.color ? { color: props.color } : {}]} {...props}>
        {children}
    </Text>
);

/*- Skeletal text -*/
class SkeletalText extends React.PureComponent {
    constructor(props) {
        super(props);

        this.max = this.props.max || false;

        /*- Random 4 - 8 -*/
        this.bars = 8;

        /*- Function bindings -*/
        this.getBars = this.getBars.bind(this);
    };

    /*- Get bars -*/
    getBars() {
        let bars = [];
        for (let i = 0; i < this.bars; i++) {
            const width = Math.floor(Math.random() * (100 - 40 + 1)) + 40;
            bars.push(
                <View style={[styles.skeletalContainer, { width }]} key={i}>
                    <View
                        style={[styles.skeletal, { width: "95%", height: 10 }]}
                    />
                </View>
            );
        }

        return bars;
    };


    render() {
        return (
            <>
                {this.props.loading
                    ? !this.max
                        ? <View style={styles.skeletal} />
                        : this.getBars()
                    : <Text>{this.props.content}</Text>
                }
            </>
        )
    }
};

export { H1, H2, H3, P, HR, VR, SkeletalText, InputText };