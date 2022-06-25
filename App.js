import React from "react";
import { StatusBar } from "expo-status-bar";

import { NavigationContainer } from "@react-navigation/native";
import { Animated } from "react-native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";

/*- Account-related scenes -*/
import Login from "./screens/Account/Login";
import SignUp from "./screens/Account/SignUp";
import Register from "./screens/Account/Register";

/*- Mains -*/
import Home from "./screens/Main/Home";
import Compose from "./screens/Main/Compose";
import Explore from "./screens/Main/Explore";
import Hashtag from "./screens/Main/Hashtag";
import Tweet from "./screens/Main/Tweet";
import Profile from "./screens/Main/Profile";
import { statusbar } from "./Style";

/*- Create the stack navigator -*/
const Stack = createSharedElementStackNavigator();

/*- Card style interpolator -*/
const CSI_FADE = ({ current: { progress } }) => {
	return {
		cardStyle: {
			opacity: progress.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1],
				extrapolate: "clamp",
			}),
		},
	}
}

/*- Needs to be called App -*/
export default function App() {

	/*- Import fonts -*/
	const [loaded] = useFonts({
		"Regular-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
		"Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
		"Overpass-bold": require("./assets/fonts/Overpass-heavy.otf"),
	});
	if (!loaded) return null;

	return (
		<React.Fragment>
			<NavigationContainer>
				<Stack.Navigator>
					{/* <Stack.Screen name = "Home" component    = {Home} options    = {{ headerShown: false, gestureEnabled: false }}/> */}

					{/*- Account related -*/}
					<Stack.Screen name="Register" component={Register} options={{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "" }} />
					<Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "Back" }} />
					<Stack.Screen name="Login" component={Login} options={{ headerShown: true, headerTransparent: true, headerTitle: "", headerBackTitle: "Back" }} />

					{/*- Mains -*/}
					{/*- We set gestureEnabled to false, because the
						 users shouldn't be able to swipe back to login -*/}
					<Stack.Screen name = "Home" component    = {Home} options    = {{ headerShown: false, gestureEnabled: false }}/>
					<Stack.Screen name="Hashtag" component={Hashtag} options={{ headerShown: false, gestureEnabled: true }}/>
					
					{/*=-               -=*/}
					{/*=-    PROFILE    -=*/}
					{/*=-               -=*/}					
					<Stack.Screen
						name="Profile"
						component={Profile}
						options={{
							headerShown: false,
							gestureEnabled: true,
							cardStyleInterpolator: CSI_FADE,
						}}
						sharedElements={(route, _, __) => {
							const { profile } = route.params;
							return [`profile-${profile}`, "SharedComposeButton"];
						}}
					/>

					{/*=-               -=*/}
					{/*=-     TWEET     -=*/}
					{/*=-               -=*/}
					<Stack.Screen
						name="Tweet"
						component={Tweet}
						options={{
							headerShown: false,
							gestureEnabled: true,
							cardStyleInterpolator: CSI_FADE,
						}}
						sharedElements={(route, _, __) => {
							const { tweet } = route.params;
							return [`tweet-${tweet.id}`, "SharedComposeButton"];
						}}
					/>

					{/*=-               -=*/}
					{/*=-    EXPLORE    -=*/}
					{/*=-               -=*/}
					<Stack.Screen
						name="Explore"
						component={Explore}
						options={{
							headerShown: false,
							gestureEnabled: false,
							cardStyleInterpolator: CSI_FADE,
						}}
						sharedElements={() => ["Navbar"]}
					/>

					{/*=-               -=*/}
					{/*=-    COMPOSE    -=*/}
					{/*=-               -=*/}
					<Stack.Screen
						name="Compose"
						component={Compose}
						options={{
							headerShown: false,
							gestureEnabled: true,
							cardStyleInterpolator: CSI_FADE
						}}
						sharedElements={() => ["SharedComposeButton"]}
					/>
				</Stack.Navigator>
			</NavigationContainer>

			<StatusBar style={statusbar} />
		</React.Fragment>
	);
}
