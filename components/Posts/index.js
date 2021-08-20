import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import ImageCarousel from '../ImageCousel';
import { db } from '../../firebase';
import * as firebase from 'firebase';
import * as FileSystem from 'expo-file-system';
import { useNavigation, Link, useTheme } from '@react-navigation/native';
import RenderVideo from '../../components/RenderVideo';
import { SliderBox } from 'react-native-image-slider-box';
import FacePile from 'react-native-face-pile'


const Posts = ({ uid, image, timestamp, text, postId, video, resharedBy, likedBy, open, setOpen, setImageToShare, setUserID, setPostID, setOpenChoiceShare }) => {
	const likedByLength = likedBy.length
	const [avatarUrl, setAvatarUrl] = useState(null);
	const [name, setName] = useState('');
	const [like, setLike] = useState(false);
	const [likeCount, setLikeCount] = useState(0);
	const navigation = useNavigation();
	const [users, setUsers] = useState([]);
	const [comment, setComment] = useState(0);
	const user = firebase.auth().currentUser;
	const [currentImage, setCurrentImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [localUri, setLocalUri] = useState(null);
	const [noImage, setNoImage] = useState(false);
	const [likedList, setLikedList] = useState([]);
	const [likedName, setLikedName] = useState('');
	const { colors } = useTheme();
	// console.log(like)

	async function ensureDirExists() {
		const dirInfo = await FileSystem.getInfoAsync(posts);
		if (!dirInfo.exists) {
			console.log("Posts directory doesn't exist, creating...");
			await FileSystem.makeDirectoryAsync(posts, { intermediates: true });
		}
	}

	if (loading) {
		return <Text className="s">Loading</Text>
	}

	useEffect(() => {
		db.collection("posts").doc(uid).collection("userPosts").doc(postId).get().then(item => {
			setLikeCount(item.data()?.likes)
			const data = item.data().likedBy

			const likedList = []
			for (const likedBy in data) {
				likedList.push({
					displayName: data[likedBy].displayName,
					email: data[likedBy].email,
					phoneNumber: data[likedBy].phoneNumber,
					imageUrl: data[likedBy].photoURL,
					providerId: data[likedBy].providerId,
					uid: data[likedBy].uid,
				})
			}
			setLikedList(likedList)
		})
	}, [likeCount, setLikeCount, like])

	useEffect(() => {
		if (uid) {
			db.collection('posts').doc(uid).get().then((doc) => {
				setName(doc.data().displayName);
				setAvatarUrl(doc.data().userImg)
			})
		}
	}, [setName, setAvatarUrl]);
	useEffect(() => {
		const unsubscribe = db.collection("posts").doc(user?.uid).collection("likedPosts").onSnapshot((snapshot) =>
			snapshot.docs.map((doc) => {
				if (doc.data().postId === postId) {
					// console.log('true');
					setLike(true);
				} else {
					setLike(false);
				}
			})
		)
		return unsubscribe;
	}, [setLike]);



	useEffect(() => {
		db.collection("posts").doc(uid).collection("userPosts").doc(postId).get().then(item => {
			const data = item.data().likedBy

			for (const likedBy in data) {
				if (uid === data[likedBy].uid) {
					setLike(true)
				} else {
					setLike(false)
				}
			}
		})
	}, [user, setLike, like, handleLike])
	useEffect(() => {
		const unsubscribe = db.collection("posts").doc(uid).collection("userPosts").doc(postId).collection("comments").onSnapshot((snapshot) =>
			setComment(snapshot.size)
		)
		return unsubscribe
	}, [setComment])

	useEffect(() => {
		const unsubscribe = db.collection("posts").doc(uid).collection("userPosts").doc(postId).collection("likes").onSnapshot((snapshot) => {
			setLikeCount(snapshot.size);
		})
		return unsubscribe;
	}, [setLikeCount, setUsers]);

	useEffect(() => {
		if (image) {
			if (image?.length === 1) {
				setCurrentImage(image[0]);
			}
		}
	}, [image])

	const handleLike = () => {
		if (user !== null) {
			if (!like) {
				db.collection("posts").doc(uid).collection("userPosts").doc(postId).get().then((item) => {
					if (item.data().likedBy.length > 0) {
						const data = item.data().likedBy
						for (const likedBy in data) {
							if (uid === data[likedBy].uid) {
								console.log('match!!!')
							} else {
								setLike(true);
								setLikeCount(likeCount + 1);
								db.collection("posts").doc(uid).collection("userPosts").doc(postId).update({
									likedBy: [...likedBy, {
										uid: user?.uid,
										photoURL: user?.photoURL || 'https://wallpaperaccess.com/full/345330.jpg',
										displayName: user?.displayName
									}],
									likes: item.data().likes + 1,
								})
							}
						}
					} else {
						setLike(true);
						setLikeCount(likeCount + 1);
						db.collection("posts").doc(uid).collection("userPosts").doc(postId).update({
							likedBy: [...likedBy, {
								uid: user?.uid,
								photoURL: user?.photoURL || 'https://wallpaperaccess.com/full/345330.jpg',
								displayName: user?.displayName
							}],
							likes: item.data().likes + 1,
						})
					}
				})
			} else {
				db.collection("posts").doc(uid).collection("userPosts").doc(postId).get().then((item) => {
					setLike(false)
					setLikeCount(likeCount - 1);
					db.collection("posts").doc(uid).collection("userPosts").doc(postId).update({
						"likedBy": firebase.firestore.FieldValue.arrayRemove(item.data().likedBy[0]),
						likes: item.data().likes - 1,
					})
				})
				return
			}


			// 	if(uid === likedName) {
			// 		console.log('match!!!')
			// 	} else{
			// 		setLike(true);
			// 		setLikeCount(likeCount + 1);
			// 		db.collection("posts").doc(uid).collection("userPosts").doc(postId).update({
			// 			likedBy: [...likedBy,{
			// 				uid: user?.uid,
			// 				photoURL: user?.photoURL || 'https://wallpaperaccess.com/full/345330.jpg',
			// 				displayName: user?.displayName
			// 			}],
			// 			likes: item.data().likes + 1,
			// 		})
			// 	}
			// }
			db.collection("posts").doc(user?.uid).collection("likedPosts").add({
				postId: postId
			})
		}
	}


	const handleAvatarPress = () => {
		// console.log('postId-->', postId);
		// console.log('like-->', like);
		// console.log('uid-->', uid);
		// console.log('likeCount-->', likeCount);
	}


	const getSharingUrl = () => {
		FileSystem.downloadAsync(
			currentImage,
			FileSystem.documentDirectory + 'post.jpeg'
		)
			.then(async ({ uri }) => {
				console.log('Finished downloading to ', uri);
				setLoading(false);
				setLocalUri(uri)
			})
	}

	const openShareDialogAsync = async () => {

		if (currentImage) {
			if (setOpenChoiceShare) {
				return setOpenChoiceShare(currentImage);
			}
			// console.log('current Image-->',currentImage);
			// setLoading(true);
			await getSharingUrl();
			if (!(await Sharing.isAvailableAsync())) {
				alert(`Uh oh, sharing isn't available on your platform`);
			}
			if (localUri) {
				await Sharing.shareAsync(localUri);
			}
		} else {
			// setNoImage(true);
			console.log('no current image');
		}

	};


	const handleReshare = () => {
		if (currentImage) {
			// console.log('current image-->',currentImage);
			navigation.navigate("Post", { screen: "Reshare", params: { images: [currentImage], postId: postId, uid: uid, resharedBy: resharedBy } })
		} else {
			console.log('no current image');
		}
	}



	const handleOpen = () => {
		setOpen(!open);
		//   console.log('postId-->',postId);
		setPostID(postId)
		//   console.log('userId-->',uid);
		setUserID(uid);
	}







	return (
		<ScrollView style={styles.posts}>
			<View style={styles.header}>
				<View style={styles.postHeader}>
					<Avatar
						rounded
						size="medium"
						source={{
							uri: avatarUrl || 'https://wallpaperaccess.com/full/345330.jpg'
						}}
						containerStyle={{ margin: 10 }}
						onPress={() => handleAvatarPress()}
					/>
					<View style={styles.postText}>
						<Text style={styles.postName}>{name}</Text>
						<Text style={styles.timestamp}>{timestamp}</Text>
					</View>
				</View>

				<TouchableOpacity style={{ margin: 10 }} onPress={() => handleOpen()}>
					<SimpleLineIcons name="options-vertical" size={24} color="black" />
				</TouchableOpacity>

			</View>

			{loading ? <View style={styles.middle}><Text style={{ fontSize: 18, color: "#49cbe9", alignSelf: "center" }}> Preparing for sharing</Text></View> :
				<View style={styles.middle}>

					{image ?
						<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
							{image.length > 1 ?
								<Image source={{ uri: image[0] }} height="530" width="100%" />
								:
								<SliderBox currentImageEmitter={index => setCurrentImage(image[index])} circleLoop autoplay={true} images={image} sliderBoxHeight={530} />

							}
						</View>
						: null
					}
					{video ?
						<RenderVideo videos={video} /> : null
					}
					{text ? <Text style={styles.postCaption}>{text}</Text> : null}
				</View>
			}

			<View style={styles.bottom}>
				<TouchableOpacity style={styles.iconContainer} onPress={handleLike}>
					{like ? (
						<>
							<AntDesign name="heart" size={24} color={colors.icon} />
							<Text style={styles.iconContainerText, { color: colors.text }}>{likeCount}</Text>
						</>
					) : (
						<>
							<AntDesign name="hearto" size={24} color={colors.icon} />
							<Text style={styles.iconContainerText, { color: colors.text }}>{likeCount}</Text>
						</>
					)}
				</TouchableOpacity>
				<TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Comment', { uid: uid, postId: postId, name: name, avatarUrl: avatarUrl })}>
					<FontAwesome name="comment-o" size={24} color={colors.icon} />
					<Text style={styles.iconContainerText, { color: colors.text }}>{comment}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={handleReshare} style={styles.iconContainer}>
					<SimpleLineIcons name="share-alt" size={24} color={colors.icon} />
					<Text style={styles.iconContainerText}>{resharedBy?.length}</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={openShareDialogAsync} style={styles.iconContainer}>
					<Feather name="share" size={24} color={colors.icon} />
				</TouchableOpacity>
			</View>

			<View style={styles.facesWrapper}>
				<TouchableOpacity onPress={() => {
					navigation.navigate("Likes", likedList)
				}} style={styles.iconContainer}>
					<FacePile numFaces={3} faces={likedList} />
				</TouchableOpacity>
			</View>

		</ScrollView>
	);
};

export default Posts;

const styles = StyleSheet.create({
	posts: {
		flexDirection: 'column'
	},
	postHeader: {
		flexDirection: 'row'
	},
	postName: {
		fontSize: 17,
		fontWeight: '700',
		color: '#4d4d4d'
	},
	timestamp: {
		color: 'gray'
	},
	postText: {
		flexDirection: 'column',
		justifyContent: 'center'
	},
	options: {
		marginRight: 7
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	bottom: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',

		marginBottom: 15
	},
	iconContainer: {
		flexDirection: "row",
		alignItems: "center"
	},
	iconContainerText: {
		marginLeft: 5
	},
	postCaption: {
		fontSize: 16,
		marginTop: 10,
		marginLeft: 15,
		marginBottom: 10,

	},
	facesWrapper: {
		display: 'flex',
		textAlign: "left",
		justifyContent: 'flex-start',
		padding: 10
	}
});


