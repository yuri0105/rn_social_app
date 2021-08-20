import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView,TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, Input,Avatar } from 'react-native-elements';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectUser, selectUserInfo } from '../../redux/features/userSlice';
import * as ImagePicker from 'expo-image-picker';
import * as firebase from 'firebase';
import { ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { db } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { selectPage } from '../../redux/features/pageSlice';
import { selectPages } from '../../redux/features/pagesSlice';

const ProfileSettingsComp = ({u, onSave}) => {
    const user = useSelector(selectUser);
    const pages = useSelector(selectPages);
    var page = useSelector(selectPage);
    page = page?.length > 0 ? page : pages?.[0];
    const navigation = useNavigation();
    const userInfo = useSelector(selectUserInfo);
    const option = u ? userInfo : page;
    const details = u ? user : page;
    // console.log('user-->',details)
    const [ name, setName ] = useState(details?.displayName || details?.name || '');
    const [ website, setWebsite ] = useState(option?.website || '');
    const [ autoBiography, setAutoBiography ] = useState(option?.bio || option?.description || '');
    const [ profilePicture, setProfilePicture ] = useState('');
    const [privacy, setPrivacy]  = useState(details?.privacy || 'public');
    const firebaseUser = firebase.auth().currentUser;
    const [image, setImage] = useState(option?.photoURL || null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [mapRegion, setMapRegion] = useState(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [checkWebsite, setCheckWebsite] = useState('public');
    const [checkAutoBiograpy, setCheckAutoBiograpy] = useState('public');
    useEffect(() => {
        (async () => {
          if (Platform.OS === 'android' && !Constants.isDevice) {
            setErrorMsg(
              'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
            );
            return;
          }
          let { status } = await Location.requestPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }else{
            setHasLocationPermission(true);
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setMapRegion({
                latitude: location.coords.latitude, 
                longitude: location.coords.longitude, 
                latitudeDelta: 0.0922, 
                longitudeDelta: 0.0421
          })
        })();
      }, []);
   
 

	useEffect(() => {
		(async () => {
		  if (Platform.OS !== 'web') {
			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
			  alert('Sorry, we need camera roll permissions to make this work!');
			}
		  }
		})();
	  }, []);


	const uploadImage = async(uri) => {
		setLoading(true);
		const response = await fetch(uri);
		const blob = await response.blob();
		var ref = firebase.storage().ref().child(`userImage/${uri}`);
	
		await ref.put(blob)
			.then(snapshot => {
				return snapshot.ref.getDownloadURL(); 
			})
			.then(downloadURL => {
				setImage(downloadURL);
        setImage(downloadURL)
				firebaseUser.updateProfile({
					photoURL: downloadURL
				}).then(() =>{
					console.log('photourl updated');
				})
				
				dispatch(login({
					displayName: firebaseUser?.displayName,
					email: firebaseUser?.email,
					uid: firebaseUser?.uid,
					photoURL: downloadURL,
          bio: autoBiography,
          website: website
				}));
				setLoading(false);
				return downloadURL;
			});
		
	  }

 

	const changeProfilePicture = async() =>{
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [9, 16],
				quality: 1,
			  });
		  
			  console.log(result);
			  if (!result.cancelled) {
				  await uploadImage(result.uri)
			  }
	}

  const save = () =>{
    onSave(image, name, autoBiography, website, mapRegion, checkWebsite)
  }


	useLayoutEffect(
		() => {
			navigation.setOptions({
				headerTitleAlign: 'center',
                headerTitle: () =>(
                    <View style={{flexDirection: "row"}}>
                        <Feather name="settings" size={24} color="black" />
                        <Text style={{marginLeft: 10, fontSize: 18}}>{page===option ? "Group " : null}Profile Settings</Text>
                    </View>
                ) ,
			});
		},
		[ navigation ]
	);

    const handleMapRegionChange = (mapRegion) => {
        setMapRegion(mapRegion);
      };
    	 

    if(loading){
		return <ActivityIndicator style={{flex: 1, alignItems: "center", justifyContent:"center"}} size="large" color="#49cbe9" />
	  }

    const renderPermission = (state, setState) => {
      return(
        <View style={styles.wraperPer}>
          <Text style={styles.txtPer}>Who can see this field?</Text>
          <View style={styles.viewChild}>
            <Text>Everyone</Text>
            <TouchableOpacity style={styles.viewTouch}
              onPress={()=> setState('public')}>
              <View style={state == 'public' ? styles.viewCheck : styles.viewChecknormal}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.viewChild}>
            <Text style={{width: 100}}>Only Me</Text>
            <TouchableOpacity style={styles.viewTouch}
              onPress={()=> setState('private')}>
              <View style={state == 'private' ? styles.viewCheck : styles.viewChecknormal}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.viewChild}>
            <Text style={{width: 100}}>Followers</Text>
            <TouchableOpacity style={styles.viewTouch}
              onPress={()=> setState('followers')}>
              <View style={state == 'followers' ? styles.viewCheck : styles.viewChecknorma}></View>
            </TouchableOpacity>
          </View>
        </View>
    )   
  }


    return (
        <ScrollView style={{flex:1, backgroundColor: "white"}}>
       {
        (u || page)  ?  
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.dp} onPress={() => changeProfilePicture()} activeOpacity={0.8}>
                <Avatar
                    size="xlarge"
                    source={{
                        uri: !image ? 
                        (details?.photoURL || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png') 
                        : image
                    }}
                    icon={{name: 'user', type: 'font-awesome'}}
                    // onPress={changeProfilePicture}
                    activeOpacity={0.5}
                    containerStyle={{ marginTop: 10, marginLeft : 10,  borderRadius:12 }}
                    avatarStyle={{borderRadius: 10}}
                />
            </TouchableOpacity>
                {/* <View> */}
                    <Input
                        labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
                        label="Name"
                        style={[styles.input, {marginTop: 10}]}
                        value={name}
                        onChangeText={setName}
                        autoFocus
                        autoCapitalize="none"
                    />

                {/* </View> */}
                <Input
                    labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
                    style={styles.input}
                    label="Website"
                    onChangeText={setWebsite}
                    autoFocus
                    autoCapitalize="none"
                    value={website}
                />
                {renderPermission(checkWebsite, setCheckWebsite)}
                <Input
                    labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
                    style={[styles.input]}
                    label="AutoBiograpy"
                    value={autoBiography}
                    onChangeText={setAutoBiography}
                    autoFocus
                    InputComponent={TextInput}
                />
                {renderPermission(checkAutoBiograpy, setCheckAutoBiograpy)}
                <View style={styles.location}>
                    <Text style={{color:"#49cbe9", fontSize: 17, fontWeight: "bold", marginLeft: 11, marginBottom: 10 }}>Location</Text>
                    {
                        errorMsg.length > 0 ?
                        <Text>Finding your current location...</Text> : hasLocationPermission === false ?
                        <Text>Location permissions are not granted.</Text> :
                        mapRegion === null ?
                        <Text>Map region doesn't exist.</Text> :
                        <MapView
                            region={mapRegion}
                            onRegionChange={() =>handleMapRegionChange()}
                            style={styles.map} 
                        />
                    }
                </View>
            </View>
            <View>
                <Button onPress={() => save()} title="Save Changes" containerStyle={{width: 300, marginVertical: 20}} buttonStyle={{backgroundColor: "#A3E15C"}} />
            </View>
            <View style={{ height: 50 }} />
        </KeyboardAvoidingView>
       : <Text>Create A Page to View settings</Text> 
      }
    </ScrollView>
    )
}

export default ProfileSettingsComp

const styles = StyleSheet.create({
    container: {
		flex: 1,
		alignItems: 'center',
		// justifyContent: 'center',
		padding: 10,
		backgroundColor: 'white'
	},
	inputContainer: {
		width: 350,
        // marginTop: 10
	},
	input: {
		borderWidth: 1,
		borderColor: 'black',
		padding: 10
	},
    dp:{
        flexDirection: "row",
        alignItems:"center",
        justifyContent:"center",
        padding: 10
    },
    map:{
        height: 300,
        width:350
    },
    location:{
        // alignItems: "flex-start",
        flexDirection: "column",
        // alignSelf: "flex-start",

    },
    wraperPer: {
      width: '94.3%', 
      height: 160, 
      borderWidth: 1, 
      alignSelf: 'center',
      marginBottom: 10
    },
    txtPer: {
      fontSize: 13, 
      fontWeight: 'bold', 
      width: '43%', 
      textAlign: 'center', 
      backgroundColor: 'white', 
      position: 'absolute', 
      top: -10, 
      left: 10
    },
    viewChild: {
      flexDirection: 'row', 
      width: '92%', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      alignSelf: 'center', 
      marginTop: 23
    },
    viewCheck: {
      width: '100%', 
      height: '100%', 
      borderRadius: 10, 
      backgroundColor: '#49cbe9'
    },
    viewChecknormal: {
      width: '100%', 
      height: '100%', 
      borderRadius: 10, 
      backgroundColor: 'white'
    },
    viewTouch: {
      width: 20, 
      height: 20, 
      borderRadius: 10, 
      borderWidth: 1.5, 
      borderColor: '#BDBDBD', 
      padding: 1
    }
})
