import React from "react";
import { SafeAreaView, TextInput, View, Text, KeyboardAvoidingView } from "react-native";
import { styles as style, def, stylevar, theme } from "../../Style";
import { ComposeButton, Toast, H1 } from "../../components/AtomBundle";
import { ServerHandler } from "../../func/ServerHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Haptic } from "../../func/Haptic";
import { SharedElement } from "react-navigation-shared-element";

/*- Home styles lies here -*/
const styles = style.compose;
const URL = new ServerHandler().get_accountdn();

export default class Compose extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		/*- Changeable variables -*/
		this.state = {
			text: "",
			sending: false,
			start_move: 0,
			current_move: 0,
			has_vibrated: false,
			toast: {
				active: false,
				text: "",
				title: "",
			}
		}

		/*- Function bindings -*/
		this.sendMessage = this.sendMessage.bind(this);
		this.showToast   = this.showToast.bind(this);
		this.onStart     = this.onStart.bind(this);
		this.onMove      = this.onMove.bind(this);
		this.onEnd       = this.onEnd.bind(this);

		/*- Statics -*/
		this.max_move = 150;
		this.scaleIncrease = 0;
		this.mounted = false;
	}

	/*- Convert char to ascii -*/
	charToAscii(char) {
		return char.charCodeAt(0);
	};

	/*- On touch move -*/
	onMove(e) {
		const y = this.state.start_move - e.nativeEvent.locationY;
		this.setState({ current_move: Math.min(y, this.max_move) });

		if (y > this.max_move*0.8 && !this.state.has_vibrated) {
			this.setState({ has_vibrated: true });
			Haptic("heavy");
			this.scaleIncrease = 0.2;
		}else if (y < this.max_move*0.8 && this.state.has_vibrated) {
			this.setState({ has_vibrated: false });
			Haptic("medium");
			this.scaleIncrease = 0;
		}
	};

	/*- On touch start -*/
	onStart(e) {
		if (this.mounted) this.setState({
			has_vibrated: false,
			start_move: e.nativeEvent.locationY
		});
	};

	/*- On touch end -*/
	onEnd(_) {

		/*- Check if the user has swiped up -*/
		if (this.state.current_move > this.max_move*0.8 && this.mounted) {
			this.sendMessage();
		};

		/*- Reset the move -*/
		if (this.mounted) this.setState({ has_vibrated: false, current_move: 0, start_move: 0 });
	};

	/*- Show a toast message -*/
	showToast(title, text) {
		this.setState({toast: { active: true, title, text }})
	};

	/*- Send the message -*/
	async sendMessage() {

		if (this.state.text.trim().length == 0 && this.mounted)
			return this.showToast("Oh no.", "You need to specify a message!");
		
		if (this.mounted) {
			this.setState({ sending: true });
			
			/*- Send the message -*/
			const server_response = await fetch(URL + "tweet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"authorization": "Bearer " + await AsyncStorage.getItem("token"),
					content: this.state.text.split("").map(this.charToAscii).join(","),
				},
			});

			/*- Check the response -*/
			if (server_response.status === 200) {
				this.props.navigation.navigate("Home");
				
				/*- Reset the text -*/
				if (this.mounted) this.setState({
					text: "",
					sending: false,
				});
			}else {
				this.showToast("Oh no.", "Something went wrong!");
			}
		}
	};

	/*- Init -*/
	componentDidMount() {
		this.mounted = true;
	};

	/*- Unmount -*/
	componentWillUnmount() {
		this.mounted = false;
	};

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View
				style={def.accountContainer}
				onTouchMove={this.onMove}
				onTouchStart={this.onStart}
				onTouchEnd={this.onEnd}	
			>
				<SafeAreaView style={styles.textInputContainer}>
					<TextInput
						placeholder="Write something..."
						style={styles.textInput}
						multiline
						placeholderTextColor={stylevar.text.placeholder}
						onChangeText={(text) => this.setState({ text })}
						value={this.state.text}
						keyboardAppearance={theme}
					>
					</TextInput>
				</SafeAreaView>

				<KeyboardAvoidingView behavior="position">
					<SharedElement id="SharedComposeButton">
						<ComposeButton absolute={true} loading={this.state.sending} icon={"delete"} onPress={() => navigation.navigate("Home")} />
					</SharedElement>
				</KeyboardAvoidingView>

				<KeyboardAvoidingView behavior="position" style={styles.noticeTextContainer}>
					<Text style={[styles.noticeText, {
						transform: [
							{ translateY: -this.state.current_move },
							{ scale: (this.state.current_move / this.max_move) / 2 + 1 + this.scaleIncrease },
						],
						opacity: (this.state.current_move / this.max_move) + 0.3,
					}]}>Swipe up to send!</Text>
				</KeyboardAvoidingView>

				{this.state.toast.active ? <Toast
					title={this.state.toast.title}
					text={this.state.toast.text}
					onClose={() => this.setState({ toast: { active: false } })}
				/> : null}
			</View>
		);
	};
};
