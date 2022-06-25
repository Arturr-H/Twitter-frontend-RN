import React from "react";
import { StatusBar } from "expo-status-bar";
import { View, TextInput, KeyboardAvoidingView, Image, ActivityIndicator } from "react-native";
import { statusbar, styles as style, stylevar } from "../../Style";
import { Button } from "../../components/atoms/Button";
import { ServerHandler } from "../../func/ServerHandler";
const styles = { ...style.register, ...style.input } /*- Register styles lies here -*/

/*- Backend / Account api URL -*/
const URL = new ServerHandler().get_accountdn();

export default class SignUp extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		/*- States, just like useState() -*/
		this.state = {
			username: "",
			displayname: "",
			email: "",
			password: "",
			confirmPassword: "",

			loading: false,
		};

		/*- Refs for the inputs - useful for auto-selecting the next one in queue -*/
		this.inputNameRef = React.createRef();
		this.inputDisplaynameRef = React.createRef();
		this.inputEmailRef = React.createRef();
		this.inputPasswordRef = React.createRef();
		this.inputConfirmPasswordRef = React.createRef();


		/*- Bind the functions -*/
		this.signup = this.signup.bind(this);
	}

	/*- When the component is mounted -*/
	componentDidMount() {
		/*- Focus the first input -*/
		// this.inputNameRef.current.focus();
	}

	/*- When the component is unmounted -*/
	componentWillUnmount() {
		/*- Clear the inputs -*/
		this.setState({
			username: "",
			displayname: "",
			email: "",
			password: "",
			confirmPassword: "",
		});
	}

	/*- signup -*/
	signup = async () => {

		/*- Check if the inputs contain something -*/
		if (this.state.username.length == 0) 		{ return alert("Please enter your username."); }
		if (this.state.displayname.length == 0) 	{ return alert("Please enter your displayname."); }
		if (this.state.email.length == 0) 			{ return alert("Please enter your email."); }
		if (this.state.password.length == 0) 		{ return alert("Please enter your password."); }
		if (this.state.confirmPassword != this.state.password) { return alert("Your passwords do not match."); }

		/*- Show that the request is being processed -*/
		this.setState({ loading: true });

		/*- Send the request to the backend -*/
		let response = await fetch(URL + "create-account", {
			method: "GET",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				username    : this.state.username,
				displayname: this.state.displayname,
				email       : this.state.email,
				password    : this.state.password,
			},
		});

		/*- Notify the user -*/
		alert(await response.text());

		/*- Check if the request was successful -*/
		if (response.status == 200) {
			/*- Navigate to the home screen -*/
			this.props.navigation.navigate("Login");
		}
	}

	render() {
		return (
			<View style={styles.wrapper}>
				{/* <Image source={require("../../assets/images/background.jpg")} style={styles.background} /> */}
				<KeyboardAvoidingView behavior="position" style={styles.accountContainer}>
					<View style={styles.logoContainer}>
						<Image source={require("../../assets/images/icon.png")} style={styles.logo} />
					</View>


					{/*- Dodge the built-in keyboard -*/}
					<View style={styles.bottomViewLarge}>
						{/*- Username input -*/}
						<TextInput
							style                = {styles.input}
							placeholder          = {"Name..."}
							placeholderTextColor = {stylevar.text.placeholder}
							autoCapitalize       = {"none"}
							autoComplete         = {"username"}
							autoCorrect          = {false}
							spellCheck           = {false}
							keyboardType         = {"default"}
							returnKeyType        = {"next"}
							onSubmitEditing      = {() => this.inputDisplaynameRef.current.focus()}
							onChangeText         = {(text) => this.setState({ username: text })}
							value                = {this.state.username}
							ref                  = {this.inputNameRef}
							blurOnSubmit		 = {false}
						/>

						{/*- Displayname input -*/}
						<TextInput
							style                = {styles.input}
							placeholder          = {"Displayname..."}
							placeholderTextColor = {stylevar.text.placeholder}
							autoCapitalize       = {"none"}
							autoComplete         = {"name"}
							autoCorrect          = {false}
							spellCheck           = {false}
							keyboardType         = {"default"}
							returnKeyType        = {"next"}
							onSubmitEditing      = {() => this.inputEmailRef.current.focus()}
							onChangeText         = {(text) => this.setState({ displayname: text })}
							value                = {this.state.displayname}
							ref                  = {this.inputDisplaynameRef}
							blurOnSubmit		 = {false}
						/>
						
						{/*- Email input -*/}
						<TextInput
							style                = {styles.input}
							placeholder          = {"Email..."}
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
							placeholder          = {"Password..."}
							placeholderTextColor = {stylevar.text.placeholder}
							autoCapitalize       = {"none"}
							autoComplete         = {"password"}
							autoCorrect          = {false}
							spellCheck           = {false}
							keyboardType         = {"default"}
							returnKeyType        = {"next"}
							secureTextEntry      = {true}
							onChangeText         = {(text) => this.setState({ password: text })}
							value                = {this.state.password}
							ref                  = {this.inputPasswordRef}
							blurOnSubmit		 = {false}
						/>

						{/*- Confirm password input -*/}
						<TextInput
							style                = {styles.input}
							placeholder          = {"Confirm password..."}
							placeholderTextColor = {stylevar.text.placeholder}
							autoCapitalize       = {"none"}
							autoComplete         = {"password"}
							autoCorrect          = {false}
							spellCheck           = {false}
							keyboardType         = {"default"}
							returnKeyType        = {"done"}
							secureTextEntry      = {true}
							onChangeText         = {(text) => this.setState({ confirmPassword: text })}
							value                = {this.state.confirmPassword}
							ref                  = {this.inputConfirmPasswordRef}
							blurOnSubmit		 = {false}
						/>

						{}

						<Button onPress={this.signup}>
							{
								this.state.loading
									? <ActivityIndicator />
									: "Sign Up"
							}
						</Button>
					</View>
					
					<StatusBar style={statusbar} />
				</KeyboardAvoidingView>
			</View>
		);
	}
};
