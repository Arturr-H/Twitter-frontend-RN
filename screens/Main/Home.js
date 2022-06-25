import React from "react";
import { Image, View } from "react-native";
import { styles as style, def } from "../../Style";
import { H1 } from "../../components/AtomBundle";
import { Navbar } from "../../components/molecules/Navbar";
import Feed from "../../components/molecules/Feed";
import { SharedElement } from "react-navigation-shared-element";
import { icons } from "../../func/GetIcon";
const styles = style.feed; /*- Home styles lies here -*/

export default class Home extends React.PureComponent {

	/*- Construct the component -*/
	constructor(props) {
		super(props);
	}

	render() {
		/*- Get the navigation handler -*/
		const { navigation } = this.props;

		return (
			<View style={def.feedContainer}>
				<View style={def.header}>
					<Image source={icons.light.filled.home} style={styles.headerIcon} />
					<H1>Home</H1>
				</View>
				<Feed navigation={navigation} />
				<SharedElement id="navbar">
					<Navbar active="home" navigation={navigation} />
				</SharedElement>
			</View>
		);
	}
}
