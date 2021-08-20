import React, {  useState } from 'react';
import {  Text, View, TouchableOpacity,ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '../../firebase';
import * as firebase from 'firebase';
import Swiper from 'react-native-deck-swiper'
import { SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUserStats } from '../../redux/features/userSlice';
import { styles } from './styles';


const ViewProfile = ({route}) => {
	const navigation = useNavigation();
	const [user, setUser] = useState(route?.params?.user)
	const requests = route?.params?.requests
	const firebaseUser = firebase.auth().currentUser;
	const stats = useSelector(selectUserStats);

  
	const handleAccept = (add, photoURL, displayName, uid, email) =>{
		db.collection("users").doc(firebaseUser?.uid).collection("requests").onSnapshot((snapshot) => {
			snapshot.docs.map(async (doc) =>{
				if(doc.data().uid === uid){
					var pid = doc.id;
					const user = doc.data();
					console.log('user hree-->',user);
					navigation.goBack();
					 await db.collection("users").doc(firebaseUser?.uid).collection("requests").doc(pid).delete().then(() =>{
						console.log('deleted');
					})
					if(add && (typeof user?.id ==="undefined")) {
						 db.collection("users").doc(firebaseUser?.uid).collection("friends").doc(firebaseUser?.uid).add({
							displayName: displayName,
							uid: uid,
							email: email,
							photoURL: photoURL
					})
					console.log('added');
				}else if((typeof user?.id !=="undefined")){
					db.collection("users").doc(firebaseUser?.uid).collection("page").doc(user?.id).collection("friends").add({
						displayName: displayName,
						uid: uid,
						email: email,
						photoURL: photoURL
				})
				}
				}
			})
		})
	}
 
 
   
	
	const Card = ({photoURL, displayName, uid, email}) =>{
		return(
				<View style={{backgroundColor: "white", height:"100%"}}> 
				<View style={[styles.header,{marginHorizontal: 10}]}>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Ionicons name="arrow-back" size={24} color="black" />
				</TouchableOpacity>
				<Text style={{fontWeight: "bold", fontSize: 18}}>Follow Requests</Text>
				<TouchableOpacity style={{marginRight: 15}}>
					<SimpleLineIcons  name="options" size={24} color="black" />
				</TouchableOpacity>
				</View>
				<View style={styles.bottom}>
				<View style={styles.image}>
					<ImageBackground source={{ uri:photoURL }} imageStyle={{borderRadius: 20,overflow: 'hidden'}} style={styles.image}>
					<View style={styles.userDetails}>
						<View style={styles.left}>
							<Text style={styles.user}>{displayName}</Text>
						</View>
						<View style={styles.right}>
							<View style={[styles.stats, {borderRightWidth: 1, borderRightColor: "lightgray", paddingRight: 10}]}>
								<Text style={styles.userText}>{stats.followers.length}</Text>
								<Text style={styles.text}>Followers</Text>
							</View>
							<View style={[styles.stats, {borderRightWidth: 1, borderRightColor: "lightgray", paddingRight: 10}]}>
								<Text style={styles.userText}>{stats.following.length}</Text>
								<Text style={styles.text}>Following</Text>
							</View>
							<View style={[styles.stats, {paddingRight:10}]}>
								<Text style={styles.userText}>{stats.likes}</Text>
								<Text style={styles.text}>Likes</Text>
							</View>
						</View>
					</View>
					</ImageBackground>
				</View>
				<View style={styles.footer}>
					<TouchableOpacity style={[styles.icon, {backgroundColor: "#56ab2f"}]} onPress={() => handleAccept(true, photoURL, displayName, uid, email)}>
						<FontAwesome5 name="check" size={27} color="white" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.icon, {backgroundColor: "#4286f4"}]}>
						<MaterialCommunityIcons  name="message" size={27} color="white" />
					</TouchableOpacity>
					<TouchableOpacity style={[styles.icon, {backgroundColor: "#EB504E"}]} onPress={() => handleAccept(false, photoURL, displayName, uid, email)} >
						<Entypo name="cross" size={27} color="white" />
					</TouchableOpacity>
				</View>
			</View>
			</View>
		)
	}
 
	return (
		<SafeAreaView style={styles.container}>
			<Swiper
				cards={requests}
				renderCard={(cardData) => <Card 
											photoURL={cardData.photoURL} 
											displayName={cardData.displayName} 
											uid={cardData.uid} 
											email={cardData.email} 
											  />}
				infinite // keep looping cards infinitely
				backgroundColor="white"
				cardHorizontalMargin={0}
				cardIndex={requests.findIndex(x => x.uid === user?.uid)}
				stackSize={requests.length}
				keyExtractor={({uid}) => uid} // number of cards shown in background
			/>
      </SafeAreaView>
	);
};

export default ViewProfile;

 