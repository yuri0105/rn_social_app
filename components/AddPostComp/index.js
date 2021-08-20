import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    FlatList,
    Dimensions,
    Slider
} from 'react-native';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import { db } from '../../firebase';
import { useNavigation, useTheme } from '@react-navigation/native';
import BottomSheet from "reanimated-bottom-sheet";
import RenderGif from "../RenderGif";
import * as ImagePicker from "expo-image-picker";


const AddPostComp = ({ goBack, onPostTweet, __startCamera, images, video, user, uid, thumbnails, postId, reshare }) => {
    const [tweet, setTweet] = useState('');
    const navigation = useNavigation();
    // console.log('post id-->',postId);
    // console.log('reshare-->',reshare);
    // console.log('iod--->',user.uid);

    const [image, setImage] = useState(null);
    const sheetRef = React.useRef(null);
    const { dark, colors } = useTheme();

    const windowWidth = Dimensions.get('window').width;
    var IMAGES_PER_ROW = 3;

    const calculatedSize = () => {
        var size = windowWidth / IMAGES_PER_ROW
        return { width: size, height: size }
    }

    //   console.log('images-->',images);

    const done = () => {

        if (reshare && postId) {
            db.collection("posts").doc(uid).collection("userPosts").doc(postId).get().then((doc) => {
                if (doc.exists) {
                    db.collection("posts").doc(uid).collection("userPosts").doc(postId).set({
                        text: doc.data()?.text || '',
                        timestamp: doc.data()?.timestamp || null,
                        image: doc.data()?.image || null,
                        videos: doc.data()?.videos || '',
                        reshareCount: doc.data()?.reshareCount ? doc.data()?.reshareCount + 1 : 1,
                        resharedBy: (doc.data()?.resharedBy?.length > 0) ? [...resharedBy, user] : [user],
                        likedBy: (doc.data()?.likedBy?.length > 0) ? doc.data().likedBy : [],
                        likes: 0,
                        user: user.uid
                        // postId: postId
                    })
                }
            })
        }
        db.collection('posts').doc(user.uid)
            .set({
                displayName: user.displayName,
                userImg: user.photoURL
            })
        db.collection('posts').doc(user.uid).collection("userPosts").add({
            text: tweet,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            image: images,
            videos: video ? video : '',
            reshareCount: 0,
            // postId: postId,
            resharedBy: [],
            likedBy: [],
            likes: 0,
            user: user.uid
        });

        console.log('done');

        // navigation.navigate("Home")
        onPostTweet();
    }

    const renderHeader = () => {
        <View
            style={{
                width: '100%',
                height: 40,
                borderWidth: 2
            }}
        >

        </View>;
    };

    const handleSelect = (image) => {
        setImage(image);
    };

    const renderContent = () => {
        return (
            <>
                <View style={{ backgroundColor: 'gray', padding: 16 }}>
                    <View style={{
                        width: 30,
                        alignSelf: "center",
                        backgroundColor: "white",
                        margin: 10,
                        height: 7,
                        borderRadius: 10
                    }} />
                    <RenderGif handleSelect={handleSelect} />
                </View>
            </>
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            navigation.navigate('CameraPreview', { photo: result.uri });
        }
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <AntDesign name="close" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={done}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.newTweetContainer}>
                    <Avatar
                        rounded
                        size="medium"
                        source={{
                            uri:
                                user?.photoURL ||
                                'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'
                        }}
                        containerStyle={{ marginTop: 30, marginRight: 10 }}
                    />
                    <View style={styles.inputsContainer}>
                        <TextInput
                            value={tweet}
                            onChangeText={(value) => setTweet(value)}
                            multiline={true}
                            numberOfLines={3}
                            style={styles.tweetInput}
                            placeholder={"What's happening?"}
                        />

                        {/*<TouchableOpacity onPress={__startCamera}>*/}
                        {/*    <Text style={styles.pickImage}>Pick a image</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <View style={styles.images}>
                            {images?.map(
                                (image, index) => (
                                    <TouchableOpacity key={index} onPress={() => filterImage(image)}>
                                        <Image
                                            key={index}
                                            source={{ uri: image }}
                                            style={[styles.image, calculatedSize()]}
                                        />
                                    </TouchableOpacity>
                                )
                                // <Text sty  le={{color: "white", fontSize:20, flexDirection: "row", alignItems: "center", justifyContent:"center"}}>{image}</Text>
                            )}
                        </View>
                        <View style={styles.images}>
                            {thumbnails?.map(
                                (uri, index) => (
                                    <TouchableOpacity key={index}>
                                        <Image
                                            key={index}
                                            source={{ uri: uri }}
                                            style={[styles.image, calculatedSize()]}
                                        />
                                    </TouchableOpacity>
                                )
                            )}
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{
                        borderRadius: 5,
                        height: 30,
                        width: 30,
                        marginLeft: 85,
                        marginRight: 25
                    }}
                        onPress={() => pickImage()}>
                        <Feather name="image" size={30} color={colors.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        borderRadius: 5,
                        height: 30,
                        width: 30,
                        marginRight: 20,
                    }}
                        onPress={__startCamera}>
                        <Feather name="camera" size={30} color={colors.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => sheetRef.current.snapTo(0)}
                    >
                        <MaterialCommunityIcons name="gif" size={40} color={colors.icon} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomSheet
                ref={sheetRef}
                snapPoints={[450, 300, 0]}
                renderHeader={renderHeader}
                borderRadius={10}
                initialSnap={2}
                renderContent={renderContent}
            />
        </>
    );
};

export default AddPostComp;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        marginBottom: 10
    },
    headerContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    newTweetContainer: {
        flexDirection: 'row',
        // alignItems:"center",
        paddingHorizontal: 15
    },
    inputsContainer: {
        marginLeft: 10
    },
    button: {
        backgroundColor: '#49cbe9',
        borderRadius: 30
    },
    buttonText: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    tweetInput: {
        height: 100,
        maxHeight: 300,
        fontSize: 20
    },
    pickImage: {
        fontSize: 18,
        color: '#49cbe9',
        marginVertical: 10,
        fontWeight: 'bold'
    },
    image: {
        marginHorizontal: 5,
        borderRadius: 10,
        marginVertical: 5,
    },
    images: {
        flexDirection: "row",
        flexWrap: "wrap",
        // flex: 1,

        // backgroundColor: "black",
        // flex:1

    },
});
