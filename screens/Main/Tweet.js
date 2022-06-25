import React from "react";
import { KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { styles as style, stylevar } from "../../Style";
import { ServerHandler } from "../../func/ServerHandler";
import { SharedElement } from "react-navigation-shared-element";
import { Tweet as TweetItem } from "../../components/molecules/TweetItem";
import { ComposeButton } from "../../components/AtomBundle";
import { Haptic } from "../../func/Haptic";
import Feed from "../../components/molecules/Feed";
import AsyncStorage from "@react-native-async-storage/async-storage";

/*- Home styles lies here -*/
const styles = style.tweet;

export default class Tweet extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		/*- Function bindings -*/
		this.onEnd         = this.onEnd.bind(this);
		this.onLike        = this.onLike.bind(this);
		this.onMove        = this.onMove.bind(this);
		this.onStart       = this.onStart.bind(this);
		this.fetchUser     = this.fetchUser.bind(this);
		this.sendMessage   = this.sendMessage.bind(this);
		this.fetchComments = this.fetchComments.bind(this);
		
		/*- Statics -*/
		this.scaleIncrease = 0;
		this.max_move      = 150;
		this.mounted       = false;
		this.suid          = this.props.route.params.suid;
		this.tweet         = this.props.route.params.tweet;
		this.userData      = this.props.route.params.userData;
		this.url           = new ServerHandler().get_accountdn();
		this.cachedUsers   = Object.keys(this.userData);

		/*- Changeable -*/
		this.state = {
			start_move  : 0,
			current_move: 0,
			comment     : "",
			sending     : false,
			comments    : [],
		};
	};

	/*- On liking the post -*/
	async onLike(id) {
		if (this.mounted) await fetch(this.url + "like", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Bearer " + this.token,
				tweet_id: id,
			},
		});
	};

	arrivedToken = (suid) => new Promise((resolve, reject) => {
        /*- how often you wanna check? -*/
        let interval = 20;

        /*- how long do you want to wait? -*/
        let timeOut = 4000;
        let timer = setInterval(() => {
            if (!this.mounted) return clearInterval(timer);
            timeOut -= interval;
            if (timeOut < 1) {
                clearInterval(timer);
                reject(new Error("catching token timed out"));
            }
            let token = this.userData[suid];
            if (token) resolve(token);
        }, interval);
    });

	/*- Fetch user data -*/
	async fetchUser(suid, callback) {
		/*- If the user already is fetched, we don't
			want to make an unneccesary request -*/
		if (this.cachedUsers.includes(suid)) {
			this.arrivedToken(suid).then((token) => {
				callback(token);
			}).catch((err) => {
				callback(defaultUser);
			});
			return;
		} else {
			this.cachedUsers.push(suid);
		}

		/*- Server response -*/
		const user_response = await fetch(this.server_url + "profile_data/" + suid, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"authorization": "Bearer " + this.token,
			},
		});

		/*- Get the JSON response -*/
		const user_data = await user_response.json();

		/*- Call the callback -*/
		callback(user_data);

		/*- Update the state -*/
		this.setState({
			userData: {
				...this.state.userData,
				[suid]: user_data,
			}
		}, () => {
			return;
		});

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

	/*- Convert char to ascii -*/
	charToAscii(char) {
		return char.charCodeAt(0);
	};

	/*- Send the comment. -*/
	async sendMessage() {
		const tweet = this.tweet.id;

		if (this.state.comment.trim().length == 0 && this.mounted)
			return this.showToast("Oh no.", "You need to specify a message!");
		
		if (this.mounted) {
			this.setState({ sending: true });
			
			/*- Send the message -*/
			const server_response = await fetch(this.url + "comment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"authorization": "Bearer " + await AsyncStorage.getItem("token"),
					content: this.state.comment.split("").map(this.charToAscii).join(","),
					tweet
				},
			});

			/*- Check the response -*/
			if (server_response.status === 200) {
				this.props.navigation.navigate("Home");
				
				/*- Reset the text -*/
				if (this.mounted) this.setState({
					comment: "",
					sending: false,
				});
			}else {
				this.showToast("Oh no.", "Something went wrong!");
			}
		}
	};

	/*- Fetch all comments -*/
	async fetchComments() {
		const tweet = this.tweet.id;

		return await fetch(this.url + "get_comments", {
			method: "GET",
			headers: { tweet },
		}).then(async response => 
			await response.json()
		).then(comments => {
			return comments;
		})
	};

	/*- Init -*/
	componentDidMount() {
		this.fetchComments();
		this.mounted = true;
	};
	componentWillUnmount() { this.mounted = false; };

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View
				style={styles.accountContainer}
				onTouchMove={this.onMove}
				onTouchStart={this.onStart}
				onTouchEnd={this.onEnd}		
			>
				<SharedElement id={`tweet-${this.tweet.id}`} style={styles.tweetContainerHeader}>
					<TweetItem
						key={"index"}
						item={this.tweet}
						fetchUser={this.fetchUser}
						onLike={(id) => this.onLike(id)}
						suid={this.suid}
						index={1}
						style={styles.tweetContainer}
						navigation={navigation}
						showToast={(title, text) => this.setState({ toast: { active: true, title, text } })}
					/>
				</SharedElement>

				<Feed
					navigation={navigation}
					override={true}
					comments={true}
					override_fetch_content={this.fetchComments}
				/>

				<KeyboardAvoidingView behavior="position">
					<View style={styles.commentInputContainer}>
						<View style={styles.inputWrapper}>
						<Text style={[styles.noticeText, {
							transform: [
								{ translateY: -this.state.current_move },
								{ scale: (this.state.current_move / this.max_move) / 2 + 1 + this.scaleIncrease },
							],
							opacity: (this.state.current_move / this.max_move) + 0.3,
						}]}>Swipe up to send!</Text>
							<TextInput
								style={styles.commentInput}
								placeholder="Comment..."
								placeholderTextColor={stylevar.text.placeholder}
								onChangeText={(comment) => this.setState({ comment })}
								value={this.state.comment}
							/>
						</View>
						<View style={styles.homeButtonWrapper}>
							<SharedElement id="SharedComposeButton">
								<ComposeButton icon="home" onPress={() => navigation.navigate("Home")} />
							</SharedElement>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		);
	}
};
