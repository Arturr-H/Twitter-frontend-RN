import React from "react";
import { View, Image, SafeAreaView, Text } from "react-native";
import { styles as style } from "../../Style";
import { ServerHandler } from "../../func/ServerHandler";
import { SharedElement } from "react-navigation-shared-element";
import { ComposeButton, H3 } from "../../components/AtomBundle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Feed from "../../components/molecules/Feed";

/*- Home styles lies here -*/
const styles = style.profile;

export default class Profile extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);
		
		/*- Function bindings -*/
		this.fetchTweets = this.fetchTweets.bind(this);

		/*- Statics -*/
		this.mounted = false;
		this.profile = this.props.route.params.profile;
		this.url     = new ServerHandler().get_accountdn();
		this.userdata= this.props.route.params.userdata;

		/*- Changeable -*/
		this.state = {
			tweets: [],
		};
	};

	/*- Init -*/
	componentDidMount() { this.mounted = true; };
	componentWillUnmount() { this.mounted = false; };
	
	/*- Fetch the tweets -*/
	async fetchTweets() {
		const server_response = await fetch(this.url + "user_tweets", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"user": this.userdata.suid,
			},
		});

		/*- Get the json data -*/
		const server_response_json = await server_response.json();

		/*- Return the feed -*/
		return server_response_json;
	};

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View style={styles.accountContainer}>
				<SafeAreaView style={styles.mainInfoContainer}>
					<SharedElement id={`profile-${this.profile}`}>
						<Image source={{ uri: this.url + "/profile_image/" + this.suid }} style={styles.profileImage}/>
					</SharedElement>
					<View style={styles.namesContainer}>
						<Text style={styles.displayname}>{this.userdata.displayname}</Text>
						<Text style={styles.username}>@{this.userdata.username}</Text>
					</View>
				</SafeAreaView>

				<View style={styles.feedWrapper}>
					<H3>@{this.userdata.username}'s tweets:</H3>
					<Feed
						navigation={navigation}
						override={true}
						override_fetch_content={this.fetchTweets}
					/>
				</View>

				<SharedElement id="SharedComposeButton" style={{position: "absolute", bottom: 0}}>
					<ComposeButton absolute={true} icon="home" onPress={() => navigation.navigate("Home")} />
				</SharedElement>
			</View>
		);
	}
};
