import { StyleSheet, Dimensions } from "react-native";

/*- Sometimes % doens't work -*/
const { width, height } = Dimensions.get("window");
const toastWidth = width*0.8;

/*- The current UI theme -*/
const theme = "dark";
const statusbar = "light";

/*- All themes -*/
const themes = {
	light: {
		border: {
			thick: "#ccc",
			light: "rgb(240, 240, 240)"
		},
		text: {
			default: "#000",
			light: "#999",
			white: "#000",
			placeholder: "#585858",
		},
		colors: {
			main: "#fc5e5a",
			main_inactive: "#a1a1a1",
			blue: "#91C6E8",
			green: "#2fd687",
			bg: "#fcfcfc",
			bg_second: "#eaeaea",
			bg_invisible: "#fcfcfc00",

			fg: "#fff",
			fg_second: "rgb(245, 245, 245)",
			fg_transparent: "rgba(230, 230, 230, 0.5)",
			fg_invisible: "#ffffff00",
		},
		toast: {
			height: 60,
		}
	},
	dark: {
		border: {
			thick: "#2d2c36",
			light: "rgb(240, 240, 240)"
		},
		text: {
			default: "#000",
			light: "#999",
			dark: "#444",
			white: "#fff",
			placeholder: "#585858",
		},
		colors: {
			main: "#fc5e5a",
			main_inactive: "#a1a1a1",
			blue: "#71A5FE",
			green: "#2fd687",
			bg: "#24202d",
			bg_second: "#1d1925",
			bg_invisible: "#24202d00",
			bg_second_invisible: "#1d192500",

			fg: "#fff",
			fg_second: "rgb(245, 245, 245)",
			fg_transparent: "rgba(230, 230, 230, 0.5)",
			fg_invisible: "#ffffff00",
		},
		toast: {
			height: 60,
		}
	}
};

/*- Some style-variables -*/
const stylevar = themes[theme];

/*- Default styles -*/
const Default = {
	border: {
		borderColor: stylevar.border.thick,
		borderWidth: 1,
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.2,
		shadowRadius: 15,
		elevation: 1,
	}
}
/*- CSS units -*/
const REM = (num) => num * 16;

/*- Default styles here -*/
const def = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: stylevar.colors.bg,
		alignItems: "center",
		justifyContent: "center",
	},
	accountContainer: {
		backgroundColor: stylevar.colors.bg,
		display: "flex",
		flexDirection: "column",

		justifyContent: "space-between",
		alignItems: "center",

		flex: 1,
		width,
		height,
	},
	feedContainer: {
		display: "flex",
		flexDirection: "column",

		backgroundColor: stylevar.colors.bg,
		height,
		width,
	},

	header: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 40,
		paddingHorizontal: 25,
		flex: 1,

		borderBottomColor: stylevar.border.thick,
		borderBottomWidth: 1,
	},
	headerIcon: {
		width: 36,
		height: 36,

		marginRight: 10,
	},
	body: {
		backgroundColor: stylevar.colors.bg,
		width: width,
		flex: 10,

		display: "flex",
		flexDirection: "column",
		alignItems: "center",

		padding: 10,
	},
});

/*- All other styles go here -*/
const styles = {
	register: StyleSheet.create({
		...def,

		bottomView: {
			backgroundColor: stylevar.colors.bg_second,

			width: width - 40,
			height: 275,

			borderTopRightRadius: 20,
			borderTopLeftRadius: 20,

			paddingHorizontal: 20,
			paddingTop: 20,

			...Default.shadow,
			...Default.border,
		},
		bottomViewLarge: {
			backgroundColor: stylevar.colors.bg_second,

			width: width - 40,
			height: 480,

			borderTopLeftRadius: 20,
			borderTopRightRadius: 20,

			paddingHorizontal: 20,
			paddingTop: 20,

			...Default.shadow,
			...Default.border,
		},
		logoContainer: {
			flex: 1,
			display: "flex",

			justifyContent: "center",
			alignItems: "center"
		},
		logo: {
			width: REM(10),
			height: REM(10),
		},
	}),

	input: StyleSheet.create({
		input: {
			backgroundColor: stylevar.colors.bg,

			height: 50,
			width: "100%",

			padding: 15,
			borderRadius: 7.5,
			marginBottom: 20,
			color: stylevar.text.white,

			...Default.border,
		},
		submitInput: {
			backgroundColor: stylevar.colors.main,

			height: 50,
			width: "100%",

			borderRadius: 7.5,
			marginBottom: 20,

			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},

		composeButton: {
			width: 75,
			height: 75,

			borderRadius: 45,
			backgroundColor: stylevar.colors.main,

			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		composeButtonAbsolute: {
			transform: [],
			position: "absolute",
			bottom: 20,
			right: -width/2 + 20,
		},

		icon: {
			width: 40,
			height: 40,
		},

		likeContainer: {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			position: "absolute",
			bottom: 5,
			paddingHorizontal: 2.5,

			backgroundColor: stylevar.colors.bg,
			borderRadius: 5,

			...Default.border
		},
		likeContainerActive: {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			position: "absolute",
			bottom: 5,
			paddingHorizontal: 2.5,

			backgroundColor: stylevar.colors.green,
			borderColor: stylevar.colors.green,
			borderWidth: 1,
			borderRadius: 5,
		},
		likeIcon: {
			width: 25,
			height: 25,
		},
		likeText: {
			fontSize: 15,
			color: stylevar.colors.fg,
			fontWeight: "800",
			marginRight: 5,
		},
		likeTextActive: {
			fontSize: 15,
			color: stylevar.colors.bg_second,
			fontWeight: "800",
			marginRight: 5,
		},

		toastContainer: {
			position: "absolute",
			bottom: height - 80,
			zIndex: 4,
			alignItems: "center",
			justifyContent: "center",

			...Default.shadow,
		},
		toast: {
			backgroundColor: stylevar.colors.bg_second,
			height: 75,
			width: toastWidth,
			
			display: "flex",
			justifyContent: "center",
			flexDirection: "column",
			padding: 10,
			paddingHorizontal: 20,
			
			borderRadius: 10,
			overflow: "hidden",
			...Default.border
		},
		toastTitle: {
			fontSize: 15,
			color: stylevar.colors.fg,
			fontWeight: "800",

			marginBottom: 2.5,
		},
		toastText: {
			fontSize: 12,
			color: stylevar.text.light,
			fontWeight: "300",
		},
		toastProgress: {
			height: 4,
			backgroundColor: stylevar.colors.main,

			position: "absolute",
			bottom: 0,
			left: 0,
		},
		toastClose: {
			position: "absolute",
			right: 15,

			width: 40,
			height: 40,
		},

		searchContainer: {
			backgroundColor: stylevar.colors.bg_second,
			
			height: 50,
			width: "100%",
	
			borderRadius: 7.5,
			marginBottom: 20,

			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 10,
			...Default.border,
		},
		search: {
		},
		searchIcon: {
			width: 30,
			height: 30,

			marginRight: 10,
			opacity: 0.25
		},
	}),

	text: StyleSheet.create({
		h1: {
			fontSize: REM(2.5),
			color: stylevar.text.white,
			fontWeight: "800",

			fontFamily: "Overpass-bold",
		},
		h2: {
			fontSize: REM(1.8),
			color: stylevar.text.default,

			fontFamily: "Inter-4"
		},
		h3: {
			fontSize: REM(1.4),
			color: stylevar.text.default,
			textAlign: "center",
			width: "100%",

			fontFamily: "Inter-2"
		},
		p: {
			fontSize: REM(1),
			fontWeight: "200",
			color: stylevar.text.light,

			fontFamily: "Inter-1"
		},
		hr: {
			width: "100%",
			height: 1,
			backgroundColor: stylevar.border.light,

			marginVertical: 10,
		},
		vr: {
			width: 1,
			height: "100%",
			backgroundColor: stylevar.border.light,

			marginHorizontal: 10,
		},
		inputText: {
			color: "#fff",
			fontWeight: "bold",
			fontSize: 18,
		},

		skeletalContainer: {
			height: 15,
			transform: [{ translateY: 3}],
			display: "flex",
		},
		skeletal: {
			backgroundColor: stylevar.colors.bg,
			width: 50,
			height: 15,
			alignSelf: "flex-start",

			borderRadius: 7.5,
			...Default.border,
			marginRight: 10,
			transform: [{ translateY: 1.5}]

		},
	}),

	feed: StyleSheet.create({
		...def,

		feedContainer: {
			backgroundColor: stylevar.colors.bg,
			width: width,
			flex: 10,

			display: "flex",
			flexDirection: "column",
			alignItems: "center",
		},
		feedItem: {
			width: width - 40,

			minHeight: 100,
			maxHeight: 160,

			borderRadius: 10,
			marginBottom: 10,

			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",

			...Default.border,
		},
		feedItemHeader: {
			backgroundColor: stylevar.colors.bg_second,
			flex: 2,
			height: "100%",
			position: "relative",

			shadowOffset: {
				width: 10,
				height: 0,
			},
			shadowColor: "#000",
			shadowOpacity: 0.3,
			shadowRadius: 15,

			zIndex: 3,
			borderTopLeftRadius: 10,
			borderBottomLeftRadius: 10,

			display: "flex",
			flexDirection: "column",
			alignItems: "center",

			paddingVertical: 10,
			paddingHorizontal: 5,

			borderRightColor: stylevar.border.thick,
			borderRightWidth: 1,
		},
		feedItemBody: {
			backgroundColor: stylevar.colors.bg_second,
			flex: 11,
			flexShrink: 1,
			width: 0,
			height: "100%",

			zIndex: 2,
			borderTopRightRadius: 10,
			borderBottomRightRadius: 10,

			padding: 10,
			flexWrap: "wrap",
		},
		feedItemHeaderProfile: {
			width: "85%",
			aspectRatio: 1,

			borderRadius: 50,
			backgroundColor: stylevar.colors.bg,

			...Default.border,

		},
		feedItemText: {
			fontSize: 15,
			color: stylevar.text.white,
			width: "100%",
			flex: 1,
			flexGrow: 1,
			flexWrap: "wrap",
		},
		feedItemTextTagContainer: {
			height: 16,
			transform: [{ translateY: 2 }]
		},
		feedItemTextTag: {
			color: stylevar.colors.green,
			fontWeight: "500"
		},
		feedItemTextLinkContainer: {
			height: 16,
			transform: [{ translateY: 2 }]
		},
		feedItemTextLink: {
			color: stylevar.colors.blue,
			fontWeight: "500"
		},
		feedItemTextOwner: {
			fontSize: 15,
			color: stylevar.text.light,
			width: "100%",
			fontWeight: "300",
			fontStyle: "italic",
		},
		dateText: {
			color: stylevar.text.dark,
		},
		dateTextContainer: {
			position: "absolute",
			paddingBottom: 5,
			paddingRight: 7.5,
			paddingLeft: 15,
			width: 120,
			bottom: 0,
			right: 0,

			display: "flex",
			justifyContent: "flex-end",
			alignItems: "flex-end",

			borderRadius: 10,
		},
	}),

	compose: StyleSheet.create({
		...def,
		
		textInputContainer: {
			width: "100%",
			height: "100%",
		},
		textInput: {
			width: "100%",
			height: "100%",
			padding: 20,
			fontWeight: "300",
			color: stylevar.text.white,
			fontSize: 20,
		},
		noticeTextContainer: {
			paddingBottom: 45,
		},
		noticeText: {
			fontSize: 15,
			color: stylevar.text.white,
			opacity: 0.3,
			fontWeight: "300",
		}
	}),

	navbar: StyleSheet.create({
		
		navbar: {
			width: "100%",
			height: 120,

			borderTopRightRadius: 10,
			borderTopLeftRadius: 10,

			position: "absolute",
			bottom: 0,
			paddingBottom: 40,
			paddingTop: 10,

			backgroundColor: stylevar.colors.bg,
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
				alignItems: "center",

			padding: 5,
			paddingHorizontal: 20,

			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: -2,
			},
			shadowOpacity: 0.3,
			shadowRadius: 10,
			elevation: 5,
		},
		iconContainer: {
			height: "100%",
			aspectRatio: 1,
			display: "flex",
			justifyContent: "center",
				alignItems: "center",
		},
		iconContainerActive: {
			backgroundColor: stylevar.colors.bg_second,
			borderRadius: 20,
			...Default.border,
			...Default.shadow
		},
		icon: {
			width: 40,
			height: 40,
		},
	}),

	explore: StyleSheet.create({
		...def,
	}),

	hashtag: StyleSheet.create({
		...def,
	}),

	tweet: StyleSheet.create({
		...def,

		tweetContainer: {
			// width: width,
			marginTop: 50,
			shadowRadius: 0,
		},
		commentInputContainer: {
			display: "flex",
			flexDirection: "row",
			alignItems: "flex-end",

			paddingHorizontal: 20,
			paddingVertical: 20,
			width,
			height: 150
		},
		inputWrapper: {
			flex: 5,
			height: "100%",
			display: "flex",
			justifyContent: "center",
				alignItems: "center",

			paddingRight: 20,
		},
		commentInput: {
			backgroundColor: stylevar.colors.bg_second,

			height: 50,
			width: "100%",

			padding: 15,
			borderRadius: 7.5,
			color: stylevar.text.white,

			...Default.border,
		},
		homeButtonWrapper: {
			flexShrink: 1,
			height: "100%",

			display: "flex",
			justifyContent: "center",
				alignItems: "center",
		},
		noticeText: {
			fontSize: 15,
			color: stylevar.text.white,
			opacity: 0.3,
			fontWeight: "300",
			position: "absolute",
			top: 0,
			paddingRight: 20,
		},
		tweetContainerHeader: {
			borderBottomColor: stylevar.border.thick,
			borderBottomWidth: 1,
		},
	}),

	profile: StyleSheet.create({
		...def,

		profileImage: {
			width: 120,
			height: 120,

			borderRadius: 60,
		},
		mainInfoContainer: {
			display: "flex",
			flexDirection: "row",
			width: width*0.8,
			marginVertical: "auto"
		},
		namesContainer: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",

			marginLeft: 20,
		},
		displayname: {
			fontSize: 34,
			color: stylevar.text.white,
			fontWeight: "800"
		},
		username: {
			fontSize: 34,
			color: stylevar.text.light,
			fontWeight: "800"
		}
	}),
};

export {
	styles,
	def,
	stylevar,
	Default,
	height, width,
	theme,
	toastWidth,
	statusbar
};