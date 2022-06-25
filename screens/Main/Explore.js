import React from "react";
import { Image, View } from "react-native";
import { styles as style, def } from "../../Style";
import { H1 } from "../../components/AtomBundle";
import { Navbar } from "../../components/molecules/Navbar";
import { SharedElement } from "react-navigation-shared-element";
import { Search } from "../../components/AtomBundle";
import { icons } from "../../func/GetIcon";
const styles = style.explore; /*- Home styles lies here -*/

export default class Explore extends React.PureComponent {

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
					<Image source={icons.light.filled.explore} style={styles.headerIcon} />
					<H1>Explore</H1>
				</View>
				<View style={styles.body}>
					<Search />
				</View>
				<SharedElement id="navbar">
					<Navbar active="explore" navigation={navigation} />
				</SharedElement>
			</View>
		);
	}
}
