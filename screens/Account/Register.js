import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, KeyboardAvoidingView, Image } from "react-native";
import { statusbar, styles as style } from "../../Style";
import { Button } from "../../components/AtomBundle";

const styles = style.register /*- Register styles lies here -*/

export default class Register extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={styles.accountContainer}>
				<View style={styles.logoContainer}>
					<Image source={require("../../assets/images/icon.png")} style={styles.logo} />
				</View>

				<KeyboardAvoidingView behavior="position" style={styles.bottomView}>
					<Button onPress={() => this.props.navigation.navigate("SignUp")}>
						Sign Up
					</Button>
					<Button onPress={() => this.props.navigation.navigate("Login")}>
						Log in
					</Button>
				</KeyboardAvoidingView>
				
				<StatusBar style={statusbar} />
			</View>
		);
	}
}
