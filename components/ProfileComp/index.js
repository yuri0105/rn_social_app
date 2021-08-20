import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal } from 'react-native';
import { StatusBar } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Text, Avatar, ListItem } from 'react-native-elements';
import * as firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, selectUserInfo, selectUserStats } from '../../redux/features/userSlice';
import { Entypo, AntDesign } from '@expo/vector-icons';
import { useTheme } from "@react-navigation/native"
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { selectStory } from '../../redux/features/storySlice';
import { db } from '../../firebase';
import * as WebBrowser from 'expo-web-browser';
import { selectPage, selectPageInfo } from '../../redux/features/pageSlice';
import { selectPages } from '../../redux/features/pagesSlice';




const ProfileComp = ({ logout, u, setH }) => {
	const navigation = useNavigation();
	const firebaseUser = firebase.currentUser;
	const redux_user = useSelector(selectUser);
	const pages = useSelector(selectPages);
	var page = useSelector(selectPage);
	page = page?.length > 0 ? page : !pages ? {} : pages[0];
	const user = u ? redux_user : page
	const stats = useSelector(selectUserStats);
	const userInfo = useSelector(selectUserInfo);
	const pageInfo = useSelector(selectPageInfo);
	const info = u ? userInfo : page
	const story = useSelector(selectStory);
	const { colors } = useTheme();

	// console.log(page, pages, 'll')

	const list = [
		{
			name: 'Name',
			iconName: (user?.displayName || user?.name) ? "check" : "cross"

		},
		{
			name: 'Website',
			iconName: info?.website ? "check" : "cross"
		},
		{
			name: 'Auto Biography',
			iconName: info?.bio || info?.description ? "check" : "cross"
		},
		{
			name: 'Profile Picture',
			iconName: (user?.photoURL) ? "check" : "cross"
		},
		{
			name: 'Location',
			iconName: info?.location ? "check" : "cross"
		},
	]



	const getProgress = () => {
		var p = 0;
		if (user?.displayName || user?.name) {
			p = p + 20
		}
		if (user?.photoURL) {
			p = p + 20
		}
		if (info?.website) {
			p = p + 20
		}
		if (info?.location) {
			p = p + 20
		}
		if (info?.bio || info?.description) {
			p = p + 20
		}
		return p;
	}
	const navigateUser = (list, text) => {

		list = list.slice().sort(function (a, b) {
			var nameA = a.displayName.toLowerCase(), nameB = b.displayName.toLowerCase();
			if (nameA < nameB)
				return -1;
			if (nameA > nameB)
				return 1;
			return 0;
		})
		// setVisible(true);
		navigation.navigate("UserFollowers", { list: list, text: text });
	}

	const goToURL = () => {
		WebBrowser.openBrowserAsync(info.website || 'https://expo.io');
	}

	// console.log('user-->',user);

	const find_dimesions = (layout) => {
		const { x, y, width, height } = layout;
		setH(height)
		// console.warn(x);
		// console.warn(y);
		// console.warn(width);
		console.log('heigh-->,', height);
		// console.warn(height);
	}



	return (
		<KeyboardAvoidingView style={styles.container}>
			<StatusBar style="auto" />
			<View onLayout={(event) => find_dimesions(event.nativeEvent.layout)} style={{ backgroundColor: colors.background }}>
				<View style={styles.loginHeader}>
					<View style={styles.userDetails}>
						<View style={styles.a}>
							<TouchableOpacity onPress={() => navigateUser(stats.followers, "Followers")} style={[styles.stats, { borderRightWidth: 1, borderRightColor: "lightgray", paddingRight: 10 }]}>
								<Text style={styles.userText, { color: colors.text }}>{stats.followers.length}</Text>
								<Text style={styles.text}>Followers</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => navigateUser(stats.following, "Following")} style={[styles.stats, { borderRightWidth: 1, borderRightColor: "lightgray", paddingRight: 10 }]}>
								<Text style={styles.userText, { color: colors.text }}>{stats.following.length}</Text>
								<Text style={styles.text}>Following</Text>
							</TouchableOpacity>
							<View style={[styles.stats, { paddingRight: 10 }]}>
								<Text style={styles.userText, { color: colors.text }}>{stats.likes}</Text>
								<AntDesign name="heart" size={24} color="red" />
							</View>
						</View>
						<View style={styles.info}>
							<Text style={{ fontSize: 17, fontWeight: "bold", paddingVertical: 10 }}>{info?.bio || info?.description}</Text>
							<TouchableOpacity activeOpacity={0.5} onPress={() => goToURL()}>
								<Text style={{ fontSize: 17, fontWeight: "bold", color: '#49cbe9' }}
								>{info?.website}</Text>
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity style={styles.dp} onPress={() => navigation.navigate("Story", { content: story })} activeOpacity={0.8}>
						<Avatar
							size="xlarge"
							source={{
								uri: user?.photoURL || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png'
							}}
							icon={{ name: 'user', type: 'font-awesome' }}
							activeOpacity={0.7}
							containerStyle={{ marginTop: 10, marginLeft: 10, borderColor: (story.length > 0) ? '#49cbe9' : 'white', borderWidth: 4, borderRadius: 12 }}
							avatarStyle={{ borderRadius: 10 }}
						/>
						<Text style={styles.percentage}>{getProgress()}%</Text>
					</TouchableOpacity>
				</View>
				<View style={{ margin: 6 }}>
					<LinearGradient colors={['#1E9600', '#FFF200', '#FF0000']} start={[0.0, 0.0]}
						end={[1.0, 1.0]} style={[styles.slider, { width: `${getProgress()}%` }]} />
					{
						list.map((l, i) => (
							<ListItem key={i} bottomDivider containerStyle={{ backgroundColor: styles.background }}>
								<ListItem.Content>
									<ListItem.Title style={{ color: colors.text }}>{l.name}</ListItem.Title>
									{/* <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle> */}
								</ListItem.Content>
								<Entypo name={l.iconName} size={24} color={l.iconName === "check" ? "#38ef7d" : "red"} />
							</ListItem>
						))
					}
				</View>
			</View>
			<View style={{ height: 50 }} />
		</KeyboardAvoidingView>
	)
}


export default ProfileComp;

const styles = StyleSheet.create({
	container: {
		height: '100%',
		flexDirection: 'column',
		flex: 1,
		color: 'black',
		backgroundColor: "white"
	},

	dp: {
		flexDirection: "column",
		alignItems: "center",
		padding: 5,
		flex: 1
	},
	percentage: {
		fontSize: 15,
		padding: 5,
		color: "green",
		fontWeight: "bold"
	},
	stats: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 5,
		marginTop: 10,
		// paddingVertical: 20

	},
	slider: {
		height: 7,
		marginTop: 40,
		marginBottom: 20
	},

	inputContainer: {
		width: 390,
		marginTop: 20,
		marginBottom: 20,
		alignSelf: "center"
	},
	input: {
		padding: 10
	},
	rememberMe: {
		color: 'black',
		flexDirection: 'row',
		alignItems: 'center',
		width: 300,
		alignSelf: 'center'
	},
	rememberMeText: {},

	otherButton: {
		backgroundColor: 'transparent',
		color: 'white'
	},
	login: {
		flexDirection: 'column',
		padding: 10,
		marginBottom: 10
	},
	bottom: {
		alignSelf: "center",
		justifyContent: "flex-end",
		flex: 0,
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		width: '100%',
		height: 220,
		margin: 0,
		alignItems: 'center'
	},
	textHeader: {
		width: '100%',
		textAlign: 'center',
		borderBottomWidth: 1,
		lineHeight: 10,
		marginVertical: 10,
		marginRight: 0,
		marginLeft: 20,
		// borderBottomWidth: 1,
		borderBottomColor: 'black'
	},
	terms: {
		// width: '90%',
		// marginBottom: 5,
	},
	termsText: {
		fontSize: 15,
		color: 'gray',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		width: '90%',
		lineHeight: 20
	},
	link: {
		color: '#49cbe9'
	},
	updatedText: {
		color: "green",
		fontSize: 16
	},
	userDetails: {
		flexDirection: "column",
		justifyContent: "center",
		// alignItems:"center"
	},
	a: {
		flexDirection: "row",
		flex: 0,
		paddingVertical: 10,
		borderBottomColor: "black",
		borderBottomWidth: 0.3,
		// alignItems:"",
		alignSelf: "center"
	},
	info: {
		marginVertical: 5,
		marginHorizontal: 10,

	},
	loginHeader: {
		flexDirection: "row",
		// flex: 1,
		// alignItems: "center",
		justifyContent: "space-between",
		marginHorizontal: 10,

	},
	email: {
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10
	},
	userText: {
		fontSize: 16,
		marginBottom: 5
	},
	text: {
		fontSize: 16,
		fontWeight: "bold"
	},

})


