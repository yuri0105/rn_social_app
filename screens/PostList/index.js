import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FlatList } from 'react-native';
import Posts from '../../components/Posts';
import moment from 'moment';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import { db } from '../../firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';




const PostList = ({ navigation, route }) => {
    const [open, setOpen] = useState(false);
    const sheetRef = React.useRef(null);
    const user = useSelector(selectUser)
    const [userID, setUserID] = useState(null);
    const [postID, setPostID] = useState(null);
    const [bookmarked, setBookmarked] = useState(false);
    const posts = route?.params?.posts;
    const index = route?.params?.index;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Post List",
            headerTitleAlign: "center",
            headerLeft: () => (
                <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.navigate("Search")}>
                    {Platform.OS === 'ios' ?
                        <Ionicons name="ios-arrow-round-back" size={24} color="black" />
                        :
                        <Ionicons name="md-arrow-back" size={24} color="black" />
                    }
                </TouchableOpacity>
            )
        })
    }, [navigation]);

    useEffect(() => {
        if (open) {
            sheetRef.current.snapTo(0)
        }
    }, [open]);





    useEffect(() => {
        if (postID) {
            db.collection("users").doc(user?.uid).collection("bookmarks").doc(postID).get().then((doc) => {
                if (doc.exists) {
                    console.log('exists');
                    setBookmarked(true);
                } else {
                    console.log('not exists');
                }
            })
        }
    }, [postID])

    let f = null;

    console.log('bookmarks-->', bookmarked)



    const handleAddToBookmarks = () => {
        console.log('handling bookmarks--->', postID, userID);
        if (postID && userID) {
            if (!bookmarked) {
                db.collection("users").doc(user?.uid).collection("bookmarks").doc(postID).set({
                    postId: postID,
                    userId: userID
                });
                setBookmarked(true);
                console.log('done');
            } else {
                db.collection("users").doc(user?.uid).collection("bookmarks").doc(postID).delete().then(() => {
                    setBookmarked(false);
                })
                console.log('removing');
            }
        } else {
            console.log('no');
        }
        sheetRef.current.snapTo(2)

    }


    const renderContent = () => {
        return (
            <View style={{ backgroundColor: '#ECECEC', padding: 16, height: "100%" }}>
                <View style={{
                    width: 30,
                    alignSelf: "center",
                    backgroundColor: "#49cbe9",
                    margin: 10,
                    height: 7,
                    borderRadius: 10
                }} />
                <TouchableOpacity onPress={handleAddToBookmarks} style={{ flexDirection: "row", margin: 10 }}>
                    {bookmarked ?
                        <FontAwesome color='#49cbe9' style={{ marginHorizontal: 10, fontWeight: "bold" }} name="bookmark" size={24} />
                        :
                        <FontAwesome color='#49cbe9' style={{ marginHorizontal: 10, fontWeight: "bold" }} name="bookmark-o" size={24} />
                    }
                    <Text style={{ color: '#49cbe9', fontSize: 18, flex: 1, fontWeight: "bold" }}>{!bookmarked ? "Add to" : "Remove from"} bookmarks</Text>
                </TouchableOpacity>
                {userID === user?.uid ?
                    <TouchableOpacity onPress={() => handleDelete()} style={{ flexDirection: "row", margin: 10 }}>
                        <AntDesign style={{ marginHorizontal: 10, fontWeight: "bold" }} name="delete" size={24} color='#49cbe9' />
                        <Text style={{ color: '#49cbe9', fontSize: 18, flex: 1, fontWeight: "bold" }}>Delete</Text>
                    </TouchableOpacity> : null
                }
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                getItemLayout={(data, index) => { return { length: 530, index, offset: 530 * (index + (index * 0.3)) } }}
                keyExtractor={(item) => item.id}
                // scrollToIndex={(item) => goIndex(item.id)}
                initialScrollIndex={index}
                ref={(ref) => { f = ref }}
                renderItem={({ item }) =>
                    <>
                        <Posts
                            postId={item?.id}
                            uid={route?.params?.userId}
                            image={item?.data?.image}
                            text={item?.data?.text}
                            open={open}
                            setUserID={setUserID}
                            setPostID={setPostID}
                            setOpen={setOpen}
                            timestamp={moment(new Date(item?.data?.timestamp?.seconds * 1000).toUTCString()).fromNow()}
                            resharedBy={item?.data?.resharedBy}
                            likedBy={item?.data?.likedBy}
                        />
                    </>
                }
            />
            <BottomSheet
                ref={sheetRef}
                snapPoints={[450, 300, 0]}
                borderRadius={10}
                initialSnap={2}
                renderContent={renderContent}

            />

        </View>
    )
}

export default PostList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    }
})
