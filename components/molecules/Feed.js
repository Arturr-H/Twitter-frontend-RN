/*- Imports -*/
import React from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { styles as style, stylevar } from "../../Style";
import { ServerHandler } from "../../func/ServerHandler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "../AtomBundle";
import { LinearGradient } from "expo-linear-gradient";
import { Tweet } from "./TweetItem";
import { SharedElement } from "react-navigation-shared-element";

/*- Feed styles lies here -*/
const styles = style.feed;
const defaultUser = {
    username: "",
    displayname: "",
    suid: "",
    age: 0,
};

export default class Feed extends React.PureComponent {

    /*- Construct the component -*/
    constructor(props) {
        super(props);

        /*- Changeable -*/
        this.state = {
            feed: [],
            refreshing: false,
            toast: {
                active: false,
                title: "",
                text: "",
            },

            /*- We'll put all users here like a 'cache' -*/
            userData: {},
            suid: "",
        }

        /*- Static -*/
        this.is_comments = this.props.comments;
        this.refresh = <RefreshControl tintColor={"#fff"} refreshing={this.state.refreshing} onRefresh={this.fetchFeed} />;
        this.server_url = new ServerHandler().get_accountdn();
        this.token = "";
        this.cachedUsers = [];
        this.mounted = false;
        this.navigation = this.props.navigation;
        this.override = this.props.override || false;
        this.override_fetch_content = this.props.override_fetch_content || {};

        /*- Function bindings -*/
        this.fetchFeed    = this.fetchFeed.bind(this);
        this.fetchUser    = this.fetchUser.bind(this);
        this.onLike       = !this.is_comments && this.onLike.bind(this);
        this.arrivedToken = this.arrivedToken.bind(this);
        this.showToast    = this.showToast.bind(this);
    }

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
            let token = this.state.userData[suid];
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

    /*- Show a toast message -*/
	showToast(title, text) {
		this.setState({toast: { active: true, title, text }})
	};

    /*- Fetch the feed -*/
    fetchFeed = async () => {
        if (!this.override) {
            const server_response = await fetch(this.server_url + "feed", {
                method: "GET",
                cache: "force-cache",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + this.token,
                },
            });
            
            /*- Get the json data -*/
            const response = await server_response.json();
            
            /*- Set the feed -*/
            this.setState({
                feed: response,
                refreshing: false,
            });
        }else {
            this.setState({
                feed: await this.override_fetch_content(),
                refreshing: false,
            });
        }
    }

    /*- Init -*/
    componentDidMount() {
        this.mounted = true;

        /*- Get the token -*/
        if (this.mounted) AsyncStorage.getItem("token").then((token) => {
            this.token = token;
        });
        if (this.mounted) AsyncStorage.getItem("suid").then((suid) => {
            this.setState({ suid });
        });

        if (this.mounted) this.fetchFeed();
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    /*- On liking the post -*/
    async onLike(id) {
        if (this.mounted) await fetch(this.server_url + "like", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + this.token,
                tweet: id,
            },
        }).catch(_ => this.showToast("Oh no.", "Something went wrong"));
    };

    render() {
        return (
            <View style={styles.feedContainer}>
                <ScrollView
                    refreshControl={this.refresh}
                    showsVerticalScrollIndicator={false}
                >
                    {this.state.feed && this.state.feed.map((item, index) =>
                        <SharedElement id={`tweet-${item.id}`} key={index}>
                            <Tweet
                                item={item}
                                users={this.state.userData}
                                fetchUser={this.fetchUser}
                                onLike={(id) => this.onLike(id)}
                                suid={this.state.suid}
                                index={index}
                                navigation={this.navigation}
                                showToast={this.showToast}
                                is_comments={this.is_comments}
                            />
                        </SharedElement>
                    )}
                    <View style={{marginBottom: 150}} />
                </ScrollView>
                <LinearGradient
                    style={{ position: "absolute", bottom: 0, width: "100%", height: "100%" }}
                    colors={[stylevar.colors.bg, stylevar.colors.bg_invisible, stylevar.colors.bg_invisible, stylevar.colors.bg]}
                    locations={[0, 0.05, 0.95, 1]}
                    pointerEvents={"none"}
                />

                {this.state.toast.active ? <Toast
					title={this.state.toast.title}
					text={this.state.toast.text}
					onClose={() => this.setState({ toast: { active: false } })}
				/> : null}
            </View>
        );
    }
};

