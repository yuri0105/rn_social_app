import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native';
import { Text,Avatar,ListItem } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';    
import { TouchableOpacity  } from 'react-native';
import AddPostComp from '../../components/AddPostComp';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import * as firebase from 'firebase';
import { db } from '../../firebase';

const Reshare = ({route, navigation}) => {
    const [images,setImages] = useState(route?.params?.images);
    const resharedBy =  route?.params?.resharedBy;
    const uid = route?.params?.uid;
    const postId = route?.params?.postId
    const user =  useSelector(selectUser);
    // console.log('route-->',route);
    const [proceed, setProceed] = useState(false);
    // console.log('image-->', route?.params?.images);
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerShown:proceed ? false : true,
            headerTitleAlign: 'center',
            headerLeft: () =>(
                <TouchableOpacity onPress={() => navigation.goBack()} style={{margin: 10}}>
                    	<AntDesign name="close" size={30} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () =>(
                <TouchableOpacity onPress={() => setProceed(true)} style={{margin: 10,}}>
                    <Text style={{fontSize:17}}>Proceed</Text>
                </TouchableOpacity>
            )
        })
    },[navigation,proceed])

    const goBack = () =>{
        setProceed(false);
        // navigation.goBack();
    }

    const onPostTweet = () =>{
        // db.collection('posts').doc(firebase.auth().currentUser.uid).collection("userPosts").add({
		// 	text: tweet,
		// 	timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		// 	image: images,
        //     videos: videos
		// });
		// console.log('successs');
		// setTweet('');
        setImages([]);
        db.collection("users").doc(uid).collection("newNotifications").doc(user?.uid).set({
            notification: true
        })
		navigation.goBack();
    }

    return (
        <View style={{flex: 1, backgroundColor: "#ffffff"}}>
            {!proceed ? 
            <View>
                <View style={{borderBottomWidth: 0.7}}>
                    <Text h5 style={{fontSize: 20, margin: 12}}>Reshare By : </Text>
                </View>
                    <FlatList
                        data={resharedBy}
                        keyExtractor={(item) =>  item?.uid}
                        renderItem={({ item }) => (
					// console.log('item-->', item),
					        item?.uid !== user?.uid ? 
                        (
						<ListItem onPress={() => navigation.navigate("UserProfile", {user : item})} key={item.uid} bottomDivider>
							<Avatar avatarStyle={{borderRadius: 10}} containerStyle={{height: 50, width:50}} source={{ uri: item.photoURL 
                                 || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png'
                            }} />
							<ListItem.Content>
								<ListItem.Title style={{fontSize: 19}}>{item?.displayName || item?.name}</ListItem.Title>
								{/* { item.email ? <ListItem.Subtitle>{item?.email || ''}</ListItem.Subtitle> : null} */}
							</ListItem.Content>
						</ListItem>
					): null
                
				)} />
            </View>
          : <AddPostComp
                goBack={goBack}
                images={route?.params?.images}
                user={user}
                onPostTweet={onPostTweet}
                uid={uid}
                postId={postId}
                reshare={true}
          />  
        }
        </View>
    )
}

export default Reshare

const styles = StyleSheet.create({})
