import Constants from 'expo-constants';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { db } from '../../firebase'
import { selectUser } from '../../redux/features/userSlice'
import * as firebase from 'firebase';
import { GestureHandler } from 'expo';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated from 'react-native-reanimated';
import { selectUsers } from '../../redux/features/usersSlice';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from "@react-navigation/native"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { setPage } from '../../redux/features/pageSlice';
const width = Dimensions.get('window').width - 20;



const Notifications = ({ navigation, route }) => {
    const user = useSelector(selectUser);
    const [requests, setRequests] = useState([]);
    const firebaseUser = firebase.auth().currentUser;
    const [reshares, setReshares] = useState([]);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [profileViewers, setProfileViewers] = useState([]);
    const [circleNames, setCircleNames] = useState([]);
    const [circleNumbers, setCircleNumbers] = useState(0);
    const [todos, setTodos] = useState([]);
    const [compliments, setCompliments] = useState([]);
    const [mentions, setMentions] = useState([]);
    const { dark, colors } = useTheme();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Your Activities",
            headerTitleAlign: "center"
        })
    }, [navigation])


    useEffect(() => {
        db.collection("users").doc(firebaseUser?.uid).collection("circles").onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
                console.log('doc--data-->', doc.data()?.circledBy);
                var d = doc.data()?.circledBy;
                var uid = doc.id;
                // setCircleNames(doc.data());
                console.log('uid0-->', uid);
                db.collection("users").doc(firebaseUser?.uid).collection("circles").doc(uid).collection("circlNames").onSnapshot((snapshot) => {
                    setCircleNames(prev => [...prev, {
                        names: snapshot.docs.map((doc) => doc.data()?.circleName),
                        circledBy: d
                    }])
                }
                )
            })
        })
    }, [])

    useEffect(() => {
        if (circleNames.length > 0) {
            circleNames.map((circle) =>
                setCircleNumbers(circleNumbers + circle?.names?.length)
            )
        }
    }, [circleNames]);


    useEffect(() => {
        db.collection("users").doc(user?.uid).collection("todos").onSnapshot((snapshot) =>
            snapshot.docs.map((doc) => {
                if (!doc.data()?.completed) {
                    setTodos(prev => [...prev, {
                        id: doc.id,
                        completed: doc.data()?.completed,
                        description: doc.data().description,
                        timestamp: new Date(doc.data()?.timestamp.seconds * 1000).toUTCString(),
                        title: doc.data().title
                    }])
                }
            }
            )
        )
    }, [])

    // console.log('todos-->',mentions);

    useEffect(() => {
        db.collection("users").doc(user.uid).collection("requests").onSnapshot((snapshot) => {
            setRequests(snapshot.docs.map((doc) =>
                doc.data()
            ))
        })

    }, []);

    useEffect(() => {
        db.collection("users").doc(user?.uid).collection("profileViewers").onSnapshot((snapshot) =>
            setProfileViewers(snapshot.docs.map((doc) => doc.data()))
        )
    }, [])

    useEffect(() => {
        db.collection("posts").doc(user?.uid).collection("userPosts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
                var postId = doc.id
                const resharedBy = doc.data()?.resharedBy
                const likedBy = doc.data()?.likedBy
                // console.log('c--->',resharedBy);
                if (typeof (resharedBy !== "undefined")) {
                    resharedBy?.map((user) =>
                        setReshares(prev => [...prev, {
                            displayName: user?.displayName,
                            photoURL: user?.photoURL,
                            uid: user?.uid,
                            postId: postId
                        }])
                    )
                }
                if (typeof (likedBy !== "undefined")) {
                    likedBy?.map((user) =>
                        setLikes(prev => [...prev, {
                            displayName: user?.displayName,
                            photoURL: user?.photoURL,
                            uid: user?.uid,
                            postId: postId
                        }])
                    )
                }
                db.collection("posts").doc(user?.uid).collection("userPosts").doc(postId).collection("comments").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {

                    snapshot.docs.map((doc) => {
                        if (doc.data()?.uid !== user?.uid) {
                            //    console.log('doc-->',doc.data()?.uid);
                            setComments(prev => [...prev, {
                                uid: doc.data()?.uid,
                                displayName: doc.data()?.displayName,
                                photoURL: doc.data()?.photoURL,
                                postId: postId
                            }])
                        }
                    })
                })
            })
        })
    }, []);

    useEffect(() => {
        db.collection("users").doc(user?.uid).collection("compliments").onSnapshot((snapshot) => {
            setCompliments(snapshot.docs.map((doc) => doc.data()))
        })
    }, [])

    useEffect(() => {
        db.collection("users").doc(user?.uid).collection("mentions").onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => setMentions(prev => [...prev, ({
                id: doc.id,
                mentionedBy: doc.data().mentionedBy,
                postId: doc.data().postId,
                userId: doc.data().userId
            })]))
        });
    }, [])

    //   console.log('prifile Viewers---.>', mentioj);


    // console.log('route-->', route?.params);

    // useEffect(() =>{
    //     if(route){
    //         if(route?.params){

    //         }
    //     }
    // },[]);

    const leftActions = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })
        return (
            <View style={styles.leftActions}>
                <Animated.Text style={[styles.leftText]}>Accept</Animated.Text>
            </View>
        )
    }

    const RightActions = ({ dragX, progress, onPress }) => {
        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })
        return (
            <TouchableOpacity onPress={onPress} style={styles.rightActions}>
                <Animated.Text style={[styles.leftText]}>Reject</Animated.Text>
            </TouchableOpacity>
        )
    }

    const handleAcceptReject = (user, add) => {
        db.collection("users").doc(firebaseUser?.uid).collection("requests").onSnapshot((snapshot) => {
            snapshot.docs.map(async (doc) => {
                if (doc.data().uid === user.uid) {
                    var pid = doc.id;
                    const user = doc.data();
                    console.log('user here-->', user);
                    await db.collection("users").doc(firebaseUser?.uid).collection("requests").doc(pid).delete().then(() => {
                        console.log('deletsed');
                    })
                    console.log('add-->', add);
                    console.log('---->', (typeof user?.id === "undefined"));
                    if (add && ((typeof user?.id === "undefined") || user?.id === null) && firebaseUser?.uid) {
                        db.collection("users").doc(user?.uid).collection("friends").doc(firebaseUser?.uid).set({
                            displayName: firebaseUser?.displayName || '',
                            uid: firebaseUser?.uid,
                            email: firebaseUser?.email || '',
                            photoURL: firebaseUser?.photoURL || null,
                            // id: null
                        }).then(() => console.log('added'));
                        db.collection("users").doc(firebaseUser?.uid).collection("followers").doc(user?.uid).set({
                            uid: user?.uid,
                            displayName: user?.displayName || user?.name,
                            email: user?.email || '',
                            photoURL: user?.photoURL || '',
                            id: null
                        })
                    } else if ((typeof user?.id !== "undefined") || user?.id) {
                        db.collection("users").doc(user?.uid).collection("page").doc(user?.id).collection("friends").doc(firebaseUser?.uid).set({
                            displayName: firebaseUser?.displayName || firebaseUser?.name || '',
                            uid: firebaseUser?.uid || null,
                            email: firebaseUser?.email || '',
                            photoURL: firebaseUser?.photoURL || ''
                        }).then(() => console.log('page added'))
                        db.collection("users").doc(firebaseUser?.uid).collection("followers").doc(user?.id).set({
                            uid: user?.uid,
                            name: user?.displayName || user?.name,
                            // email: user?.email || '',
                            photoURL: user?.photoURL || '',
                            id: user?.id
                        })
                    }
                }
            })
        })
    }



    const onSwipeFromLeft = (user) => {
        handleAcceptReject(user, true);
    }

    const handleActivity = (text) => {
        if (text === "Reshares") {
            navigation.navigate("Activities", { text: text, data: reshares });
        } else if (text === "Likes") {
            navigation.navigate("Activities", { text: text, data: likes });
        } else if (text === "Comments") {
            navigation.navigate("Activities", { text: text, data: comments });
        }
    }

    // console.log('compliments-->',compliments);



    const handlePress = (text) => {
        if (text === "Circle") {
            navigation.navigate("ProfileViewers", { circleNames: circleNames, text: text })
        } else if (text === "TodoList") {
            navigation.navigate("ProfileViewers", { todos: todos, text: text })
        } else if (text === "Compliments") {
            navigation.navigate("ProfileViewers", { compliments: compliments, text: text })
        } else if (text === "Mentions") {
            navigation.navigate("ProfileViewers", { mentions: mentions, text: text })
        }
    }

    return (
        <View style={[styles.container, { paddingBottom: requests.length > 0 ? 50 : 0, backgroundColor: colors.background }]} >
            <View>
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.uid}

                    renderItem={({ item }) => (
                        (
                            <Swipeable
                                renderLeftActions={leftActions}
                                onSwipeableLeftOpen={() => onSwipeFromLeft(item)}
                                renderRightActions={(progress, dragX) => <RightActions progress={progress} dragX={dragX} onPress={() => handleAcceptReject(item, false)} />}
                            >
                                {item.uid !== user.uid ?
                                    <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('ViewProfile', { user: item, requests: requests })} style={styles.containerList}>
                                        <Image
                                            source={{ uri: item.photoURL }}
                                            style={{ height: 70, width: 70, borderRadius: 70 }}
                                        />
                                        <Text style={styles.text}>{item.displayName}</Text>
                                    </TouchableOpacity> : null}
                            </Swipeable>
                        )
                    )
                    }
                    ListHeaderComponent={
                        <View style={{ flexDirection: "column", justifyContent: "space-between" }}>
                            <TouchableOpacity onPress={() => handleActivity("Likes")} activeOpacity={0.7} style={[styles.stats, { backgroundColor: "#FFA2BF" }]}>
                                <Text style={[styles.statsText, { marginTop: 10 }]}>{likes?.length}</Text>
                                <Text style={[styles.statsText, { marginBottom: 10 }]}>New Likes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleActivity("Comments")} activeOpacity={0.7} style={[styles.stats, { backgroundColor: "#81D5DF" }]}>
                                <Text style={[styles.statsText, { marginTop: 10 }]}>{comments?.length}</Text>
                                <Text style={[styles.statsText, { marginBottom: 10 }]}>New Comments</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleActivity("Reshares")} activeOpacity={0.7} style={[styles.stats, { backgroundColor: "#5F75EC" }]}>
                                <Text style={[styles.statsText, { marginTop: 10 }]}>{reshares?.length}</Text>
                                <Text style={[styles.statsText, { marginBottom: 10 }]}>New Reshares</Text>
                            </TouchableOpacity>
                            <Text style={{ fontSize: 22, fontWeight: "bold", margin: 15, color: colors.text }}>Profile Statistics</Text>
                            <View style={styles.profileStats}>
                                {/* <View style={{flexDirection: "column"}}> */}
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => navigation.navigate("ProfileViewers", { profileViewers: profileViewers, text: "Your Visitors" })} style={[styles.col, { minWidth: width, marginHorizontal: 10 }]}>
                                        <FontAwesome style={{ marginRight: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 }} name="eye" size={24} color="#f5af19" />
                                        <View>
                                            <Text style={{ fontSize: 17, fontWeight: "bold", }}>Profile Visitors</Text>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{profileViewers.length}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => handlePress("TodoList")} style={[styles.col, { minWidth: width / 2 }]}>
                                        <Entypo style={{ marginRight: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 }} name="add-to-list" size={24} color="#99f2c8" />
                                        <View>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>To-Do List</Text>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{todos.length}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePress("Mentions")} style={[styles.col, { minWidth: width / 2 }]}>
                                        <FontAwesome style={{ marginRight: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 }} name="hashtag" size={24} color="#3b8d99" />
                                        <View>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Mentions</Text>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{mentions.length}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => handlePress("Circle")} style={[styles.col, { minWidth: width / 2 }]}>
                                        <Entypo style={{ marginRight: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 }} name="circle" size={24} color="#aa4b6b" />
                                        <View>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Circle</Text>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{circleNumbers}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handlePress("Compliments")} style={[styles.col, { minWidth: width / 2 }]}>
                                        <MaterialCommunityIcons style={{ marginRight: 10, backgroundColor: "#f2f2f2", padding: 10, borderRadius: 8 }} name="human-greeting" size={24} color="#2C5364" />
                                        <View>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>Compliments</Text>
                                            <Text style={{ fontSize: 17, fontWeight: "bold" }}>{compliments.length}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.stats, { backgroundColor: '#49cbe9', paddingVertical: 20, marginTop: 20 }]}>
                                <Text style={styles.statsText}>Follow Requests</Text>
                            </View>
                        </View>
                    }
                />
            </View>
        </View>
    )
}

export default Notifications

const styles = StyleSheet.create({
    header: {
        width: '100%',
        flexDirection: 'row',
        alignSelf: "center",
        justifyContent: "center",
        borderBottomWidth: 0.2,
        padding: 10,
        marginTop: 10
    },
    row: {
        flexDirection: "row",
        // justifyContent:"space-between",
        marginTop: 10,

    },
    col: {
        borderWidth: 0.7,
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "white",
        // justifyContent:"space-around"
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: "white"
    },
    containerList: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: "white",
        padding: 10,
        borderTopWidth: 0.4,
        borderLeftWidth: 0.4,
        borderRightWidth: 0.4,
        // marginHorizontal: 10
    },
    text: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: 'bold'
    },
    leftActions: {
        backgroundColor: "#56ab2f",
        justifyContent: "center",
        flex: 1
    },
    leftText: {
        color: "white",
        padding: 20
    },
    rightActions: {
        backgroundColor: "#EB504E",
        justifyContent: "center",
        alignItems: "flex-end"
        // flex:1
    },
    stats: {
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20
    },
    statsText: {
        paddingVertical: 5,
        color: "white",
        fontWeight: "bold",
        fontSize: 18
    },
    followRequests: {
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 5
    }
})




    // const req =  [
    //      {
    //       "bio": "",
    //       "displayName": "user3",
    //       "email": "user@user.com",
    //       "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //       "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //       "website": "",
    //     },
    //      {
    //       "displayName": "testuser",
    //       "email": "123@123.com",
    //       "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //       "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //     },
    //      {
    //       "displayName": "yash2828",
    //       "email": "abc@abc.com",
    //       "photoURL": "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    //       "uid": "rTWdekGdIETsWRmTCxmgk9dIDm22",
    //     },
    //     {
    //         "bio": "",
    //         "displayName": "user3",
    //         "email": "user@user.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //         "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //         "website": "",
    //       },
    //        {
    //         "displayName": "testuser",
    //         "email": "123@123.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //         "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //       },
    //       {
    //         "bio": "",
    //         "displayName": "user3",
    //         "email": "user@user.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //         "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //         "website": "",
    //       },
    //        {
    //         "displayName": "testuser",
    //         "email": "123@123.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //         "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //       },
    //       {
    //         "bio": "",
    //         "displayName": "user3",
    //         "email": "user@user.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //         "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //         "website": "",
    //       },
    //        {
    //         "displayName": "testuser",
    //         "email": "123@123.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //         "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //       },
    //       {
    //         "bio": "",
    //         "displayName": "user3",
    //         "email": "user@user.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //         "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //         "website": "",
    //       },
    //        {
    //         "displayName": "testuser",
    //         "email": "123@123.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //         "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //       },
    //       {
    //         "bio": "",
    //         "displayName": "user2",
    //         "email": "user@user.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F866b87f9-0815-433f-a2e3-2c29f5953b79.jpg?alt=media&token=713c41cf-bc5e-4a3e-90e1-ae312a38c2b1",
    //         "uid": "9BctlX6Jl8cjV2JwQs0PEHJvSty2",
    //         "website": "",
    //       },
    //        {
    //         "displayName": "testuser",
    //         "email": "123@123.com",
    //         "photoURL": "https://firebasestorage.googleapis.com/v0/b/socially-dd898.appspot.com/o/userImage%2Ffile%3A%2Fdata%2Fuser%2F0%2Fhost.exp.exponent%2Fcache%2FExperienceData%2F%252540yash2828%25252Fsocially%2FImagePicker%2F744a1a8d-df43-45a4-8a44-974792264f7f.jpg?alt=media&token=d6f29d9b-5f15-4352-9a9e-38b388b04fff",
    //         "uid": "arCs8GmiahSD5rJuYUurA0vRp8b2",
    //       },
    //   ]
