import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUser, selectUserInfo, setUserInfo } from '../../redux/features/userSlice';
import * as firebase from 'firebase';
import { db } from '../../firebase';
import ProfileSettingsComp from '../../components/ProfileSettingsComp';


const ProfileSettings = ({ navigation, route }) => {
  const user = useSelector(selectUser);
  const firebaseUser = firebase.auth().currentUser;
  const dispatch = useDispatch();


  const onSave = (photoURL, displayName, bio, website, location, privacy) => {
    firebaseUser.updateProfile({
      photoURL: photoURL || null,
      displayName: displayName || '',
    }).then(() => {
      console.log('photourl updated');
    })
    db.collection("users").doc(user?.uid || firebaseUser?.uid).collection("info").doc(user?.uid || firebaseUser?.uid).set({
      bio: bio || '',
      website: website || '',
      location: location || null,
      privacy: privacy || 'public'
    })
    dispatch(login({
      displayName: displayName || '',
      email: user?.email || '',
      uid: user?.uid,
      photoURL: photoURL || null,
      bio: bio || '',
      website: website || '',
      location: location || null,
      privacy: privacy || 'public'
    }));
    dispatch(setUserInfo({
      bio: bio || '',
      website: website || '',
      location: location || null,
      privacy: privacy || 'public'
    }))

    navigation.navigate("Profile");
  }


  return (
    <>
      <ProfileSettingsComp u={true} onSave={onSave} />
    </>

  );
};

export default ProfileSettings;

const styles = StyleSheet.create({

});




  //   const [mapRegion, setMapRegion] = useState(null);
  //   const [hasLocationPermission, setHasLocationPermission] = useState(false);
  //   const [errorMsg, setErrorMsg] = useState('');

  //   console.log('ueerinfo--?', userInfo);

  //   useEffect(() => {
  //       (async () => {
  //         if (Platform.OS === 'android' && !Constants.isDevice) {
  //           setErrorMsg(
  //             'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
  //           );
  //           return;
  //         }
  //         let { status } = await Location.requestPermissionsAsync();
  //         if (status !== 'granted') {
  //           setErrorMsg('Permission to access location was denied');
  //           return;
  //         }else{
  //           setHasLocationPermission(true);
  //         }

  //         let location = await Location.getCurrentPositionAsync({});
  //         setMapRegion({
  //               latitude: location.coords.latitude, 
  //               longitude: location.coords.longitude, 
  //               latitudeDelta: 0.0922, 
  //               longitudeDelta: 0.0421
  //         })
  //       })();
  //     }, []);



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


	// const uploadImage = async(uri) => {
	// 	setLoading(true);
	// 	// const response = await fetch(uri);
	// 	// const blob = await response.blob();
	// 	// var ref = firebase.storage().ref().child(`userImage/${uri}`);

	// 	// await ref.put(blob)
	// 	// 	.then(snapshot => {
	// 	// 		return snapshot.ref.getDownloadURL(); 
	// 	// 	})
	// 	// 	.then(downloadURL => {
	// 			// setImage(downloadURL);
  //       setImage('https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500')
	// 			// firebaseUser.updateProfile({
	// 			// 	photoURL: downloadURL
	// 			// }).then(() =>{
	// 			// 	console.log('photourl updated');
	// 			// })

	// 			// dispatch(login({
	// 			// 	displayName: firebaseUser?.displayName,
	// 			// 	email: firebaseUser?.email,
	// 			// 	uid: firebaseUser?.uid,
	// 			// 	photoURL: downloadURL,
  //       //   bio: autoBiography,
  //       //   website: website
	// 			// }));
	// 			setLoading(false);
	// 			// return downloadURL;
	// 		// });

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
	// 			  await uploadImage(result.uri)
  //         // .then(() =>{
	// 				  // showMessage({
	// 					//   message: "Profile Photo Updated Succesfully",
	// 					//   type: "info",
	// 					// });
	// 			  // })
	// 		  }
	// 	}
	// }



  	// container: {
	// 	flex: 1,
	// 	alignItems: 'center',
	// 	// justifyContent: 'center',
	// 	padding: 10,
	// 	backgroundColor: 'white'
	// },
	// inputContainer: {
	// 	width: 350,
  //       // marginTop: 10
	// },
	// input: {
	// 	borderWidth: 1,
	// 	borderColor: 'black',
	// 	padding: 10
	// },
  //   dp:{
  //       flexDirection: "row",
  //       alignItems:"center",
  //       justifyContent:"center",
  //       padding: 10
  //   },
  //   map:{
  //       height: 300,
  //       width:350
  //   },
  //   location:{
  //       // alignItems: "flex-start",
  //       flexDirection: "column",
  //       // alignSelf: "flex-start",

  //   }



          // <ScrollView style={{flex:1, backgroundColor: "white"}}>
        //     <KeyboardAvoidingView style={styles.container}>
        //         <StatusBar style="dark" />
        //         <View style={styles.inputContainer}>
        //         <TouchableOpacity style={styles.dp} onPress={() => changeProfilePicture()} activeOpacity={0.8}>
        //             <Avatar
        //                 size="xlarge"
        //                 source={{
        //                     uri: !image ? 
        //                     (user?.photoURL || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png') 
        //                     : image
        //                 }}
        //                 icon={{name: 'user', type: 'font-awesome'}}
        //                 // onPress={changeProfilePicture}
        //                 activeOpacity={0.5}
        //                 containerStyle={{ marginTop: 10, marginLeft : 10,  borderRadius:12 }}
        //                 avatarStyle={{borderRadius: 10}}
        //             />
        //         </TouchableOpacity>
        //             {/* <View> */}
        //                 <Input
        //                     labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
        //                     label="Name"
        //                     style={[styles.input, {marginTop: 10}]}
        //                     value={name}
        //                     onChangeText={setName}
        //                     autoFocus
        //                     autoCapitalize="none"
        //                 />

        //             {/* </View> */}
        //             <Input
        //                 labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
        //                 style={styles.input}
        //                 label="Website"
        //                 onChangeText={setWebsite}
        //                 autoFocus
        //                 autoCapitalize="none"
        //                 value={website}
        //             />
        //             <Input
        //                 labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
        //                 style={[styles.input]}
        //                 label="AutoBiograpy"
        //                 value={autoBiography}
        //                 onChangeText={setAutoBiography}
        //                 autoFocus
        //                 InputComponent={TextInput}
        //             />
        //             <View style={styles.location}>
        //                 <Text style={{color:"#49cbe9", fontSize: 17, fontWeight: "bold", marginLeft: 11, marginBottom: 10 }}>Location</Text>
        //                 {
        //                     errorMsg.length > 0 ?
        //                     <Text>Finding your current location...</Text> : hasLocationPermission === false ?
        //                     <Text>Location permissions are not granted.</Text> :
        //                     mapRegion === null ?
        //                     <Text>Map region doesn't exist.</Text> :
        //                     <MapView
        //                         region={mapRegion}
        //                         onRegionChange={() =>handleMapRegionChange()}
        //                         style={styles.map} 
        //                     />
        //                 }
        //             </View>
        //         </View>
        //         <View>
        //             <Button onPress={() => onSave()} title="Save Changes" containerStyle={{width: 300, marginVertical: 20}} buttonStyle={{backgroundColor: "#A3E15C"}} />
        //         </View>
        //         <View style={{ height: 50 }} />
        //     </KeyboardAvoidingView>
        // </ScrollView>





	// useLayoutEffect(
	// 	() => {
	// 		navigation.setOptions({
	// 			headerTitleAlign: 'center',
  //               headerTitle: () =>(
  //                   <View style={{flexDirection: "row"}}>
  //                       <Feather name="settings" size={24} color="black" />
  //                       <Text style={{marginLeft: 10, fontSize: 18}}>Profile Settings</Text>
  //                   </View>
  //               ) ,
	// 		});
	// 	},
	// 	[ navigation ]
	// );

  //   const handleMapRegionChange = (mapRegion) => {
  //       setMapRegion(mapRegion);
  //     };


  //   if(loading){
	// 	return <ActivityIndicator style={{flex: 1, alignItems: "center", justifyContent:"center"}} size="large" color="#49cbe9" />
	//   }
