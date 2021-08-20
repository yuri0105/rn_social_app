import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Posts from '../../components/Posts';
import { db } from '../../firebase';
import moment from 'moment';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ViewPost = ({ navigation, route }) => {
    const postId = route?.params?.postId;
    const userId = route?.params?.userId;
    const [post, setPost] = useState(null);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "View Post",
            headerTitleAlign: "center",
            headerLeft: () => (
                <TouchableOpacity style={{ margin: 10 }} onPress={() => navigation.navigate("Notification")}>
                    {Platform.OS === 'ios' ?
                        <Ionicons name="ios-arrow-round-back" size={24} color="black" />
                        :
                        <Ionicons name="md-arrow-back" size={24} color="black" />
                    }
                </TouchableOpacity>
            )
        })
    }, [navigation])
    console.log('route-->', route?.params)

    useEffect(() => {
        if (userId && postId) {
            db.collection("posts").doc(userId).collection("userPosts").doc(postId).get().then((doc) => {
                if (doc.exists) {
                    setPost({
                        postId: postId,
                        uid: userId,
                        image: doc.data()?.image || '',
                        text: doc.data()?.text || '',
                        timestamp: moment(new Date(doc.data()?.timestamp?.seconds * 1000).toUTCString()).fromNow() || null,
                        resharedBy: doc.data()?.resharedBy || [],
                        likedBy: doc.data()?.likedBy || [],

                    })
                }
            }
            )
        }
    }, [userId, postId]);




    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {post?.postId && post?.uid ? <Posts
                postId={post?.postId}
                uid={post?.uid}
                image={post?.image}
                text={post?.text}
                timestamp={post?.timestamp}
                resharedBy={post?.resharedBy}
                likedBy={post?.likedBy}
            /> : null}
        </View>
    )
}

export default ViewPost

const styles = StyleSheet.create({})
