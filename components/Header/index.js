import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { db } from '../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import { Entypo } from '@expo/vector-icons';
import * as firebase from 'firebase';
import moment from 'moment';
import { addStory } from '../../redux/features/storySlice';

const Header = () => {
	const navigation = useNavigation();
	const [content, setContent] = useState([]);
	const user = useSelector(selectUser);
	const disptach = useDispatch();
	const { dark, colors } = useTheme();

	useEffect(() => {
		if (user) {
			db.collection("users").doc(user?.uid).collection("stories").onSnapshot((snapshot) =>

				setContent(
					snapshot.docs.map((doc) => ({
						content: doc.data().image,
						type: doc.data().type,
						finish: doc.data()?.finish || 0,
						sound: doc?.data()?.sound || ''
					}))))

		}
	}, []);

	useEffect(() => {
		if (content) {
			disptach(addStory(content));
		}
	}, [content])

	useEffect(() => {
		if (user) {
			db.collection("users").doc(user?.uid).collection("stories").onSnapshot((snapshot) =>
				snapshot.docs.map((doc) => {
					var time = moment(new Date(doc?.data()?.timestamp?.seconds * 1000).toUTCString()).fromNow();
					// console.log('time,',time);
					if (time === "a day ago") {
						db.collection("users").doc(user?.uid).collection("stories").doc(doc?.id).delete().then(() => {
							console.log('deleted');
						})
					}
				})
			)
		}
	}, []);
	//   console.log('content in header-->', content);
	return (
		<View style={styles.container, { backgroundColor: colors.background }}>
			<TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Story', { content: content })}>
				<Image
					source={{
						uri: user?.photoURL || 'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'
					}}
					style={{ borderRadius: 10, width: 75, height: 75, margin: 10, borderWidth: 3, borderColor: (content.length > 0) ? '#49cbe9' : 'white' }}
				/>
				<Entypo style={{ position: "absolute", top: 65, left: 65, color: "lightgray" }} name="circle-with-plus" size={24} color="black" />
				<Text style={{ marginLeft: 10, marginBottom: 5, color: colors.text }}>Add Memory</Text>

			</TouchableOpacity>

		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 1,
		borderBottomColor: 'lightgray',
		flexDirection: "column",
		justifyContent: "center",

	}
});
