import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUsers } from '../../redux/features/usersSlice';
import { SearchBar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import { selectUser } from '../../redux/features/userSlice';
import { selectPost } from '../../redux/features/postSlice';
import { Dimensions } from 'react-native';
import { list } from '../../gifs';
import { db } from '../../firebase';
import { useTheme } from '@react-navigation/native';
const width = Dimensions.get('window').width - 4;

const Search = ({ navigation }) => {
	const [pages, setPages] = useState([]);
	const post = useSelector(selectPost);
	const [userPosts, setUserPosts] = useState([]);
	const [newPosts, setNewPosts] = useState([]);
	const { dark, colors } = useTheme();

	useEffect(() => {
		const unsubscribe = db.collection('posts').onSnapshot((snapshot) => {
			snapshot.docs.map((doc) => {
				var uid = doc.id;
				var index = 0;
				db.collection('posts').doc(uid).collection('userPosts').orderBy('timestamp', 'desc').onSnapshot((snapshot) =>
					snapshot.docs.map((doc) => {
						setNewPosts(prev => [...prev,
						{
							id: doc.id,
							data: doc.data(),
							uid: uid,
							index: index
						}

						]
						)
						index = index + 1;
					}

					)

				)

			})

		})
		return unsubscribe;
	}, []);

	const handlePress = (uid, index) => {
		const posts = newPosts.filter(p => p.uid === uid)
		navigation.navigate("PostList", { posts: posts, index: index, userId: uid })

	}


	// console.log('posts-->',newPosts);

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SearchList', { pages: pages })}>
				<SearchBar
					disabled
					autoCorrect={false}
					containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }}
					round
					lightTheme={!dark}
					placeholder="Search"
				/>
			</TouchableOpacity>
			<View style={{ flexDirection: 'column' }}>
				<FlatList
					data={newPosts}
					style={{ marginBottom: 10 }}
					numColumns={3}

					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
						<>
							{(item?.data?.image && item?.data?.image?.length > 0) ? (
								<TouchableOpacity onPress={() => handlePress(item?.uid, item.index)} activeOpacity={0.7} style={styles.container}>
									<Image
										source={{ uri: item.data?.image?.[0] }}
										style={{ height: width / 3, width: width / 3, borderRadius: 10 }}
									/>
								</TouchableOpacity>
							) : null}
						</>
					)}
				/>
			</View>
			<View style={styles.bottom}>
				<FlatList
					data={list}
					showsHorizontalScrollIndicator={false}
					horizontal
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) =>
					(
						<TouchableOpacity activeOpacity={0.8} style={styles.list}>
							<Text style={{ color: 'white', fontSize: 17 }}>{item.title}</Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 1,
	},
	text: {
		marginLeft: 10,
		fontSize: 17,
		fontWeight: 'bold'
	},
	textInput: {
		height: 40,
		borderColor: 'gray',
		margin: 10,
		backgroundColor: 'lightgray',
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	list: {
		borderRadius: 50,
		backgroundColor: 'gray',
		margin: 5,
		paddingHorizontal: 10,
		paddingVertical: 5
	},
	bottom: {
		position: 'absolute',
		bottom: 0
	}
});
