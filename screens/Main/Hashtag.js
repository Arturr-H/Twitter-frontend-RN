import React from "react";
import { View } from "react-native";
import { styles as style, def } from "../../Style";
import { H1 } from "../../components/AtomBundle";
import { Navbar } from "../../components/molecules/Navbar";
import { SharedElement } from "react-navigation-shared-element";
import { ServerHandler } from "../../func/ServerHandler";
import Feed from "../../components/molecules/Feed";
import AsyncStorage from "@react-native-async-storage/async-storage";
const styles = style.hashtag; /*- Home styles lies here -*/

class HashtagInner extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);

		/*- Static -*/
		this.hashtag = this.props.route.params.hashtag.replace("#", "");
		this.url = new ServerHandler().get_accountdn();

		/*- Changeable -*/
		this.state = {
			tweets: [],
		};

		/*- Bind the methods -*/
		this.fetchTweets = this.fetchTweets.bind(this);
	};

	/*- Fetch the tweets -*/
	async fetchTweets() {
		const server_response = await fetch(this.url + "hashtag", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"hashtag": this.hashtag,
				"authorization": "Bearer " + await AsyncStorage.getItem("token"),
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
			<View style={def.feedContainer}>
				<View style={def.header}>
					<H1>#{this.hashtag}</H1>
				</View>
				<Feed
					override={true}
					override_fetch_content={this.fetchTweets}
				/>
				<SharedElement id="navbar">
					<Navbar active="home" navigation={navigation} />
				</SharedElement>
			</View>
		);
	}
}

const Hashtag = ({ navigation, route }) => {
	return (
		<HashtagInner navigation={navigation} route={route} />
	);
};

export default Hashtag;