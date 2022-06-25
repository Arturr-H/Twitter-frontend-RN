import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import { ServerHandler } from "../../func/ServerHandler";
import { SkeletalText, UpvoteButton } from "../AtomBundle";
import { styles as style, stylevar } from "../../Style";
import { LinearGradient } from "expo-linear-gradient";
import { SharedElement } from "react-navigation-shared-element";

const styles = style.feed;
const defaultUser = {
    username: "",
    displayname: "",
    suid: "",
    age: 0,
};

export class Tweet extends React.PureComponent {
    constructor(props) {
        super(props);

        this.is_comments = this.props.is_comments;

        /*- Changeable -*/
        this.state = {
            userdata: defaultUser,
            loading: true,
            is_liked: !this.is_comments && this.props.item.likes.includes(this.props.suid),
        };

        /*- Static -*/
        this.item = this.props.item;
        this.suid = this.props.suid; // The current user browsing the feed
        this.owner = this.item.owner;
        this.fetchUser = this.props.fetchUser;
        this.url = new ServerHandler().get_accountdn();
        this.margin = this.props.index == 0 ? 30 : 0;
        this.mounted = false;
        this.navigation = this.props.navigation;
        this.showToast = this.props.showToast || (() => { });
        this.extraStyle = this.props.style || {};
    };

    /*- Init -*/
    componentDidMount() {
        this.mounted = true;

        /*- Fetch the user data -*/
        if (this.mounted) this.fetchUser(this.owner, (userdata) => {

            /*- Update the state -*/
            if (this.mounted)   this.setState({
                userdata,
                loading: false,
                is_liked: !this.is_comments && this.item.likes.includes(this.suid),
            });
        });
    };

    fmt_all = (id, string) => {
        return string.split(/((?:^|\s)(?:https\:\/\/[^\s]+|#[a-z\d-]+))/gi).filter(Boolean).map((v, i) => {
            if (v.includes('https://')) {
                return (
                    <TouchableOpacity
                        style={styles.feedItemTextLinkContainer}
                        activeOpacity={0.8}
                        key={id + "link" + i}
                        onPress={() => {
                            Linking.openURL(v.trim()).catch(_ => this.showToast("Error", "Error opening URL"));
                        }}
                    >
                        <Text style={styles.feedItemTextLink}>{v}</Text>
                    </TouchableOpacity>

                );
            } else if (v.includes('#')) {
                return (
                    <TouchableOpacity
                        style={styles.feedItemTextTagContainer}
                        activeOpacity={0.8}
                        key={id + "tag" + i}
                        onPress={() => this.navigation.navigate("Hashtag", {
                            hashtag: v.substring(1),
                        })}>
                        <Text style={styles.feedItemTextTag}>{v}</Text>
                    </TouchableOpacity>
                );
            } else {
                return <Text key={id + "link" + i}>{v}</Text>;
            }
        });
    };

    /*- Unmount -*/
    componentWillUnmount() {
        this.mounted = false;
    };

    /*- On liking the post -*/
    onLike() {
        if (this.mounted)
            this.props.onLike
                && this.props.onLike(this.item.id);
    };

    joinDate(t, a, s) {
        function format(m) {
            let f = new Intl.DateTimeFormat('en', m);
            return f.format(t);
        }

        let b = a.map(format);
        return b[0] + " " + b[1] + " \u2019" + b[2];
    }
    prettifyDate(d) {
        let a = [{day: 'numeric'}, {month: 'short'}, {year: '2-digit'}];
        let s = this.joinDate(new Date(d), a, ' ');
        return s;
    };
    /*- Render the item -*/
    render() {
        return (
            <TouchableOpacity
                style={[
                    styles.feedItem,
                    { marginTop: this.margin },
                    this.extraStyle,
                ]}
                activeOpacity={0.8}
                onPress={() => this.navigation.navigate("Tweet", {
                    tweet: this.item,
                    userData: this.props.users,
                    suid: this.suid,
                })}
            >
                <View style={styles.feedItemHeader}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => this.navigation.navigate("Profile", {
                            profile: this.item.owner,
                            userdata: this.state.userdata
                        })}
                    >
                        <SharedElement id={`profile-${this.item.owner}`} style={{width: "100%"}}>
                            <Image source={{ uri: this.url + "/profile_image/" + this.item.suid }} style={styles.feedItemHeaderProfile} />
                        </SharedElement>
                    </TouchableOpacity>


                    {!this.is_comments && <UpvoteButton
                        likes={this.item.likes}
                        onPress={() => this.onLike()}
                        active={this.state.is_liked} />}
                </View>
                <View style={styles.feedItemBody}>
                    <Text numberOfLines={50} style={styles.feedItemText}>
                        <Text style={styles.feedItemTextOwner}>
                            <SkeletalText
                                loading={this.state.loading}
                                content={"@" + this.state.userdata.username + ":"} />{" "}
                        </Text>
                        <SkeletalText
                            loading={this.state.loading}
                            content={this.fmt_all(this.item.id, this.item.content)}
                            max={true}
                        />
                    </Text>

                    <LinearGradient
                        style={styles.dateTextContainer}
                        colors={[stylevar.colors.bg_second_invisible, stylevar.colors.bg_second]}
                        start={[0, 1]}
                        end={[1, 0]}
                        locations={[0.2, 0.3]}
                    >
                        <Text style={styles.dateText}>{this.prettifyDate(this.item.unix)}</Text>
                    </LinearGradient>
                </View>
            </TouchableOpacity>
        );
    }
};
