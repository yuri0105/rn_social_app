import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../redux/features/usersSlice';
import { selectPages } from '../../redux/features/pagesSlice';
import { selectPage } from '../../redux/features/pageSlice';
import { selectUser, selectUserInfo } from '../../redux/features/userSlice';
import { ActivityIndicator } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { showMessage, hideMessage } from "react-native-flash-message";
import Animated from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { db } from '../../firebase';
import { selectFriend } from '../../redux/features/friendSlice';

const SearchList = ({ navigation }) => {
	const users = useSelector(selectUsers);
	const [arr, setArr] = useState(users);
	const pages = useSelector(selectPages);
	var page = useSelector(selectPage);
	page = page?.length > 0 ? page : pages?.[0];
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(users);
	const [error, setError] = useState(null);
	const user = useSelector(selectUser);
	const userInfo = useSelector(selectUserInfo);
	console.log('page-->', userInfo);
	const friend = useSelector(selectFriend);
	const [value, setValue] = useState('');

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "Search",
			headerTitleAlign: "center"
		})
	}, [navigation])


	useEffect(() => {
		if (pages?.length > 0) {
			setData(data.concat(pages));
			setArr(data?.concat(pages));
		}
	}, [pages])
	// console.log('pages-->',pages);





	const searchFilterFunction = (text) => {
		setValue(text);
		const newData = arr.filter((item) => {
			const itemData = `${item?.displayName?.toUpperCase()} ${item?.email?.toUpperCase()} ${item?.name?.toUpperCase()} `;
			//    ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;

			const textData = text.toUpperCase();

			return itemData.indexOf(textData) > -1;
		});

		setData(newData);
	};
	const onSwipeFromLeft = (user) => {
		// handleAcceptReject(user, true);
	}
	console.log('firend -->', friend);

	const goToChat = (uid) => {
		let fr = friend?.filter(f => f.uid === uid);
		if (fr?.[0]) {
			console.log('fr-->', fr[0]);

			navigation.navigate("Chat", { screen: "ChatScreen", params: { friend: fr[0] } })
		} else {
			showMessage({
				message: "Please follow to start chatting",
				type: "danger",
			});
		}
	}


	const RightActions = ({ dragX, progress, uid }) => {
		const scale = dragX.interpolate({
			inputRange: [-100, 0],
			outputRange: [1, 0],
			extrapolate: 'clamp'
		})
		return (
			<TouchableOpacity onPress={() => goToChat(uid)} style={styles.rightActions}>
				<Animated.Text style={[styles.leftText]}>Message</Animated.Text>
			</TouchableOpacity>
		)
	}

	// const leftActions = (progress, dragX) =>{
	//     const scale = dragX.interpolate({
	//         inputRange: [0, 100],
	//         outputRange: [0, 1],
	//         extrapolate: 'clamp'
	//     })
	//     return(
	//         <View style={styles.leftActions}>
	//             <Animated.Text style={[styles.leftText]}>Accept</Animated.Text>
	//         </View>
	//     )
	// }


	// console.log('data-->', data);

	// if(!data){
	// 	return <ActivityIndicator size="large" color='#49cbe9' />
	// }

	// onPress={() => handleAcceptReject(item, false)}
	return (
		<View style={styles.container}>
			<FlatList
				data={data}
				keyExtractor={(item) => item?.id || (typeof item?.uid !== 'undefined' && item?.uid)}
				renderItem={({ item }) => (
					// console.log('item-->', item),
					item?.uid !== user?.uid ?
						(
							<Swipeable
								// renderLeftActions={leftActions}
								// onSwipeableLeftOpen={() => onSwipeFromLeft(item)}
								renderRightActions={(progress, dragX) => <RightActions uid={item?.uid} progress={progress} dragX={dragX} />}
							>
								<ListItem onPress={() => navigation.navigate("UserProfile", { user: item })} key={item.uid} bottomDivider>
									<Avatar avatarStyle={{ borderRadius: 10 }} containerStyle={{ height: 50, width: 50 }} source={{
										uri: item.photoURL
											|| 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png'
									}} />
									<ListItem.Content>
										<ListItem.Title style={{ fontSize: 19 }}>{item?.displayName || item?.name}</ListItem.Title>
										{item.email ? <ListItem.Subtitle>{item?.email || ''}</ListItem.Subtitle> : null}
									</ListItem.Content>
								</ListItem>
							</Swipeable>
						) : null

				)}
				ListHeaderComponent={
					<SearchBar
						autoCorrect={false}
						containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }}
						round
						editable
						lightTheme
						placeholder="Type Here..."
						onChangeText={searchFilterFunction}
						value={value}
					/>
				}
			/>
		</View>
	);
};

export default SearchList;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	leftActions: {
		backgroundColor: "#000",
		justifyContent: "center",
		flex: 1
	},
	leftText: {
		color: "white",
		padding: 20
	},
	rightActions: {
		backgroundColor: "#4286f4",
		justifyContent: "center",
		alignItems: "flex-end",
		height: "100%"
		// flex:1
	},
});
