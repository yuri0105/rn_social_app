import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUserInfo } from '../../redux/features/userSlice';
import ProfileComp from '../../components/ProfileComp';
import { StatusBar } from 'expo-status-bar';
import { db } from '../../firebase';
import { addPages, selectPages } from '../../redux/features/pagesSlice';
import { selectUsers } from '../../redux/features/usersSlice';
import RenderTabs from '../../components/RenderTabs';

const Profile = ({ navigation, route }) => {
	const redux_user = useSelector(selectUser);
	const users = useSelector(selectUsers);
	const [info, setInfo] = useState(null)
	const dispatch = useDispatch();
	const pages = useSelector(selectPages);
	const [mentionedPosts, setMentionedPosts] = useState([]);
	const [posts, setPosts] = useState([]);
	const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
	const [newBookmarkedPosts, setNewBookmarkedPosts] = useState([]);
	const [compliments, setCompliments] = useState([])
	const [likes, setLikes] = useState([])
	const [stories, setStories] = useState([])
	const [loading, setLoading] = useState(false)







	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: redux_user?.displayName,
			headerTitleAlign: "center",
			headerLeft: ""
		})
	}, [navigation]);



	// console.log('page ajo-->',pages);



	const logout = () => {
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
			console.log('singout successfully');
			navigation.replace('Authentication');
		}).catch((error) => {
			// An error happened.
		});

	}

	useEffect(() => {
		db.collection("users").doc(redux_user?.uid).collection("info").doc(redux_user?.uid).get().then((doc) => {
			if (doc.exists) {
				setInfo(doc.data())
				dispatch(setUserInfo(doc.data()))

			}
		})
	}, []);



	useEffect(() => {
		db.collection("posts").doc(redux_user?.uid).collection("userPosts").onSnapshot((snapshot) => {
			const data = []
			snapshot.forEach((item)=>{
				data.push({
					id: item.id,
					data: item.data(),
					likeCount: item.data().likedBy?.length
				})
			})
			setPosts(data)
		})
	}, []);

	useEffect(()=>{
		setLikes(posts.sort(function(a, b){
			return b.likeCount - a.likeCount
		}))
	},[posts])


	useEffect(() => {
		db.collection("users").doc(redux_user?.uid).collection("mentions").onSnapshot((snapshot) =>
			snapshot.docs.map((doc) => {
				var uid = doc.data().userId
				db.collection("posts").doc(doc.data().userId).collection("userPosts").doc(doc.data().postId).get().then((doc) =>
					setMentionedPosts(prev => [...prev, {
						id: doc.id,
						userId: uid,
						data: doc.data()
					}])
				)
			})

		)
	}, [])

	function getUnique(arr, index) {

		const unique = arr
			.map(e => e[index])
			.map((e, i, final) => final.indexOf(e) === i && i)
			.filter(e => arr[e]).map(e => arr[e]);

		return unique;
	}

	useEffect(() => {
		setNewBookmarkedPosts(getUnique(bookmarkedPosts, 'id'))
	}, [bookmarkedPosts]);

	useEffect(() => {
		db.collection("users").doc(redux_user?.uid).collection("bookmarks").onSnapshot((snapshot) =>
			snapshot.docs.map((doc) => {
				var uid = doc.data().userId
				db.collection("posts").doc(doc.data().userId).collection("userPosts").doc(doc.data().postId).get().then((doc) =>
					setBookmarkedPosts(prev => [...prev, {
						id: doc.id,
						data: doc.data(),
						userId: uid
					}])

				)
			})
		)
	}, []);

	useEffect(()=>{
		db.collection("personalStory").doc(redux_user?.uid).collection("data").onSnapshot((snapshot) => {
			const data = []
			snapshot.forEach((item)=>{
				data.push({
					key: item.id,
					data: item.data(),
					type: 'content'
				})
			})
			setStories(data)
		})
	},[])

	// useEffect(() => {
	// 	db.collection("posts").doc(redux_user?.uid).collection("userPosts").onSnapshot((snapshot) => {
	// 		const posts = [];

	// 		snapshot.forEach(documentSnapshot => {
	// 			posts.push({
	// 				...documentSnapshot.data(),
	// 				key: documentSnapshot.id,
	// 			});
	// 		})
	// 	})
	// }, [])


	useEffect(() => {
		db.collection("users").doc(redux_user?.uid).collection("compliments").onSnapshot((snapshot) =>
			setCompliments(snapshot.docs.map((doc) => ({
				id: doc.id,
				data: doc.data()
			})))
		)
	}, [])



	return (
		<>
			<StatusBar style="dark" />
			<RenderTabs compliments={compliments} u={true} logout={logout} bookmarkedPosts={newBookmarkedPosts} mentionedPosts={mentionedPosts} posts={posts} likes={likes} stories={stories} ownProfile={true} currentUser={redux_user} />
		</>
	);
};

export default Profile;

const styles = StyleSheet.create({

});


// if(loading){
// 	return <ActivityIndicator style={{flex: 1, alignItems: "center", justifyContent:"center"}} size="large" color="#49cbe9" />
//   }

// const uploadImage = async(uri) => {
// 	setLoading(true);
// 	const response = await fetch(uri);
// 	const blob = await response.blob();
// 	var ref = firebase.storage().ref().child(`userImage/${uri}`);

// 	await ref.put(blob)
// 		.then(snapshot => {
// 			return snapshot.ref.getDownloadURL(); 
// 		})
// 		.then(downloadURL => {
// 			// console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
// 			setImage(downloadURL);
// 			firebaseUser.updateProfile({
// 				photoURL: downloadURL
// 			}).then(() =>{
// 				console.log('photourl updated');
// 			})

// 			dispatch(login({
// 				displayName: firebaseUser?.displayName,
// 				email: firebaseUser?.email,
// 				uid: firebaseUser?.uid,
// 				photoURL: downloadURL
// 			}));
// 			setLoading(false);
// 			return downloadURL;
// 		});

//   }



// const changeProfilePicture = async() =>{
// 	if(user.uid === firebaseUser?.uid){
// 		let result = await ImagePicker.launchImageLibraryAsync({
// 			mediaTypes: ImagePicker.MediaTypeOptions.All,
// 			allowsEditing: true,
// 			aspect: [4, 3],
// 			quality: 1,
// 		  });

// 		  console.log(result);

// 		  if (!result.cancelled) {
// 			  await uploadImage(result.uri).then(() =>{
// 				  showMessage({
// 					  message: "Profile Photo Updated Succesfully",
// 					  type: "info",
// 					});
// 			  })
// 			// setImage(result.uri);


// 		  }
// 	}
// }

// useEffect(() => {
// 	(async () => {
// 	  if (Platform.OS !== 'web') {
// 		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// 		if (status !== 'granted') {
// 		  alert('Sorry, we need camera roll permissions to make this work!');
// 		}
// 	  }
// 	})();
//   }, []);




{/* <Input
					label="Email"
					inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
					labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
					value={email}
					onChangeText={setEmail}
					inputContainerStyle={{ borderStyle: 'dotted' }}
					autoFocus
					type="email"
					autoCapitalize="none"
					style={styles.input}
				
				/> */}

{/* <Input
						label="Choose a Password"
						value={password}
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						onChangeText={setPassword}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						secureTextEntry
						type="password"
						style={styles.input}
						inputContainerStyle={{ borderStyle: 'dotted' }}
						onSubmitEditing={login}
					/>
					<Input
						value={password2}
						label="Confirm Password"
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						onChangeText={setPassword2}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						secureTextEntry
						type="password"
						style={styles.input}
						inputContainerStyle={{ borderStyle: 'dotted' }}
						onSubmitEditing={login}
					/> */}
{/* <View style={styles.terms}>
					<Text style={styles.termsText}>
						By creating an account you agree to our <Text style={styles.link}>Terms and Conditions</Text>{' '}
						and our <Text style={styles.link}>Privacy Policy</Text>.
					</Text>
				</View> */}



{/* <View style={styles.login}>
						<Button
							style={styles.otherButton}
							type="outline"
							title="LOG IN"
							titleStyle={{ color: 'white' }}
							buttonStyle={{ borderWidth: 0, width: 250, backgroundColor: '#94d93f' }}
							onPress={create}
						/>
					</View> */}


{/* <View style={styles.inputContainer}>
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
					<View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
					<View>
						<Text style={{ width: 150, textAlign: 'center', color: 'gray' }}>ACCOUNT DETAILS</Text>
					</View>
					<View style={{ flex: 1, height: 1, backgroundColor: 'gray' }} />
				</View>
				<Input
					label="Username"
					inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
					labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
					value={username}
					onChangeText={setUsername}
					inputContainerStyle={{ borderStyle: 'dotted' }}
					autoFocus
					type="Username"
					autoCapitalize="none"
					style={styles.input}
				/>
			
			</View>*/}


				// <KeyboardAvoidingView style={styles.container}>
		// 	<StatusBar style="auto" />
		// 	<View style={styles.loginHeader}>
		// 		<View style={styles.userDetails}>
		// 			<Text h2 h2Style={{fontSize: 30, fontWeight: "600"}}>{user?.displayName  || username}</Text>
		// 			<Text style={styles.email}>{user.email}</Text>
		// 		</View>
		// 		<Avatar
		// 			size="large"
		// 			 source={{
		// 				 uri:  user?.photoURL || 'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'
		// 			 }}
		// 			rounded
		// 			icon={{name: 'user', type: 'font-awesome'}}
		// 			onPress={changeProfilePicture}
		// 			activeOpacity={0.7}
		// 			containerStyle={{ marginTop: 10, marginLeft : 10  }}
		// 		/>


		// 	</View>
		// 	{user.uid !== firebaseUser.uid ? <View style={{alignItems: "center", alignSelf: "center", margin: 20}}>
		// 		<Button title={!send ? "Follow" :"Follow Request Sent"} style={styles.loginButton} buttonStyle={{width:250, backgroundColor: "black"}} onPress={() => handleFollow()}/>		
		// 	</View> : null}

		// 	<View style={styles.bottom}>
		// 		{user.uid === firebaseUser.uid ? <View style={styles.login}>
		// 			<Button
		// 				style={styles.loginButton}
		// 				title="LOGOUT"
		// 				buttonStyle={{ width: 250, backgroundColor: '#49cbe9' }}
		// 				onPress={logout}
		// 			/>
		// 		</View> : null}

		// 	</View> 
		// 	<View style={{ height: 50 }} />
		// </KeyboardAvoidingView>



	// const handleCheck = () => {
	// 	setChecked(!checked);
	// };

	// const login = () => {
	// 	console.log('login');
	// };

	// const create = () => {
	// 	console.log('create');
	// };

	// const forgotPassword = () => {
	// 	console.log('forgot');
	// };

	// const update = () => {

	// 	user
	// 		.updateProfile({
	// 			displayName: username,

	// 		})
	// 		.then(() => {

	// 		});

	// 		showMessage({
	// 			message: "Profile Updated Succesfully",
	// 			type: "info",
	// 		  });
	// };