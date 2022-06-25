"use strict";

import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, TextInput, KeyboardAvoidingView, Keyboard, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { statusbar, styles as style, stylevar } from "../../Style";
import { Button } from "../../components/AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";

/*- Backend / Account api URL -*/
const URL = new ServerHandler().get_accountdn();
const styles = { ...style.register, ...style.input } /*- Register styles lies here -*/

export default class Login extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		/*- States, just like useState() -*/
		this.state = {
			email: "",
			password: "",
			loading: false,
		};
		/*- Refs for the inputs - useful for auto-selecting the next one in queue -*/
		this.inputEmailRef = React.createRef();
		this.inputPasswordRef = React.createRef();

		/*- Bind the functions -*/
		this.login = this.login.bind(this);
	}

	/*- When the component is unmounted -*/
	componentWillUnmount() {
		/*- Clear the inputs -*/
		this.setState({
			email: "",
			password: "",
		});
	}

	/*- Login -*/
	login = async () => {

		/*- Check if the email and password are valid -*/
		if (this.state.email.length == 0) {
			alert("Please enter your email.");
			return;
		}else if (this.state.password.length == 0) {
			alert("Please enter your password.");
			return;
		}

		/*- Show that the request is being processed -*/
		this.setState({ loading: true });

		/*- Send the request to the backend -*/
		let response = await fetch(URL + "login", {
			method: "GET",
			headers: {
				"Accept"      : "application/json",
				"Content-Type": "application/json",
				email         : this.state.email,
				password      : this.state.password,
			},
		});

		/*- Check if the request was successful -*/
		if (response.status == 200) {
			/*- Get the response -*/
			let responseJson = await response.json();

			/*- Save the JSW token -*/
			await AsyncStorage.setItem("token", responseJson.token);
			await AsyncStorage.setItem("suid", responseJson.suid);

			/*- Go to the home screen -*/
			this.props.navigation.navigate("Home");

			/*- Hide the loading indicator -*/
			this.setState({ loading: false });
		} else {
			/*- Show the error -*/
			alert("Email or password is incorrect.");

			/*- Hide the loading indicator -*/
			this.setState({ loading: false });
		}
	}

	render() {
		return (
			<KeyboardAvoidingView behavior="padding" style={styles.accountContainer}>
				<View style={styles.logoContainer}>
					<Image source={require("../../assets/images/icon.png")} style={styles.logo} />
				</View>

				{/*- Dodge the built-in keyboard -*/}
				<View style={styles.bottomView}>
					{/*- Email input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Email"}
						placeholderTextColor = {stylevar.text.placeholder}
						autoCapitalize       = {"none"}
						autoComplete         = {"email"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"email-address"}
						returnKeyType        = {"next"}
						onSubmitEditing      = {() => this.inputPasswordRef.current.focus()}
						onChangeText         = {(text) => this.setState({ email: text })}
						value                = {this.state.email}
						ref                  = {this.inputEmailRef}
						blurOnSubmit		 = {false}
					/>

					{/*- Password input -*/}
					<TextInput
						style                = {styles.input}
						placeholder          = {"Password"}
						placeholderTextColor = {stylevar.text.placeholder}
						autoCapitalize       = {"none"}
						autoComplete         = {"password"}
						autoCorrect          = {false}
						spellCheck           = {false}
						keyboardType         = {"default"}
						returnKeyType        = {"done"}
						secureTextEntry      = {true}
						onChangeText         = {(text) => this.setState({ password: text })}
						value                = {this.state.password}
						ref                  = {this.inputPasswordRef}
						blurOnSubmit		 = {false}
						onSubmitEditing      = {() => Keyboard.dismiss()}
					/>

					<Button onPress={this.login}>
						{
							this.state.loading
								? <ActivityIndicator />
								: "Login"
						}
					</Button>
				</View>
				<StatusBar style={statusbar} />
			</KeyboardAvoidingView>
		);
	}
}
