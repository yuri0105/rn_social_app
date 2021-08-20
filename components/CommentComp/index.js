import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View,Dimensions,Image } from 'react-native'
import { Avatar } from 'react-native-elements';
import {  db } from '../../firebase';
import moment from 'moment';
import { EU } from "react-native-mentions-editor";
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
// import { EU as EditorUtils } from 'react-native-mentions-editor';

const windowWidth = Dimensions.get('window').width;


const CommentComp = ({id,uid, data,postId,userId}) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
	const [name, setName] = useState('');
    const [keys, setKeys] = useState([]);
    const [currentKey, setCurrentKey]  = useState(null);
    // let keys = [];
    // console.log('id-->',id);
    const user = useSelector(selectUser);
 

    useEffect(() =>{
        if(uid!==null){
            db.collection('posts').onSnapshot((snapshot) => {
                snapshot.docs.map((doc) =>{
                    if(doc.id === uid){
                        // var userId = uid;
                        db.collection("posts").doc(uid).get().then((doc) =>{
                            setName(doc.data().displayName);
                            setAvatarUrl(doc.data().userImg);
                        })
                    }
                })
            })


        }
    });
    // const findMentions =  (val) => {
    //     /**
    //      * Both Mentions and Selections are 0-th index based in the strings
    //      * meaning their indexes in the string start from 0
    //      * findMentions finds starting and ending positions of mentions in the given text
    //      * @param val string to parse to find mentions
    //      * @returns list of found mentions 
    //      */
    //     let reg = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/igm;
    //     let indexes = [];
    //     while (match = reg.exec(val)) {
    //         indexes.push({
    //             start: match.index, 
    //             end: (reg.lastIndex-1),
    //             username: match[1],
    //             userId: match[2],
    //             type: EU.specialTagsEnum.mention
    //         });
    //     }
    //     return indexes;
    // }

    // useEffect(() =>{

    //     if(EditorUtils.findMentions(data?.message).length > 0 && !keys[EditorUtils.findMentions(data?.message)?.[0]?.id]){
    //         setKeys(prev => [...prev, EditorUtils.findMentions(data?.message)?.[0]?.id])
    //         db.collection("users").doc(EditorUtils.findMentions(data?.message)?.[0]?.id).collection("mentions").add({
    //             mentionedBy: {
    //                 uid: user?.uid,
    //                 photoURL: user?.photoURL,
    //                 displayName: user?.displayName
    //             },
    //             postId: postId,
    //             userId: userId
    //         })
    //     }
        
    // },[data?.message])

    //  console.log('keys-->',uid);
    const formatMentionNode = (txt, key) => {
        // if(key){
        //     // insertKey(key.slice(2,key.length-2));
        //    setCurrentKey(key.slice(2,key.length-2));
        //     // keys.push(key.slice(2,key.length-2));
        // }
    return(
        <Text key={key} style={styles.mention}>
          {txt}
        </Text>
    )
};
    
    //   console.log('keys-->',keys);
    //   console.log('menrions-->',<Text></Text>);

    return (
        <View style={styles.commentContainer}>
            <View key={id} style={styles.reciever}>
                <Avatar
                    size={40}
                    containerStyle={{
                        

                    }}
                    rounded
                    source={{
                        uri: avatarUrl
                    }}
                />
                <View style={styles.content}>
                        <Text style={styles.receiverName}>{name}:</Text>
                    <View style={styles.col}>
                        {data?.image ? <Image source={{uri: data?.image}} style={styles.image} /> : null }
                        <Text style={styles.recieverText}>{data?.message ? EU.displayTextWithMentions(data?.message, formatMentionNode) : null}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.timestamp}>{moment(new Date(data?.timestamp?.seconds * 1000).toUTCString()).fromNow()}</Text>
    </View>
    )
}

export default CommentComp

const styles = StyleSheet.create({ 
 timestamp: {
    fontSize: 10,
    color: "gray",
    // marginTop: 10
    marginLeft: 30
},
commentContainer:{
    flexDirection: "column",
   
    justifyContent:"center",

}, 
 reciever:{
    padding: 13,
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 5,
    maxWidth: "90%",
    position: 'relative',
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
},
receiverName:{
    left: 10, 
    paddingRight: 10,
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
    marginLeft: 10
    // color: "white"
},
recieverText:{
    color: "black",
    fontWeight: "500",
    fontSize: 17,
    marginLeft: 10,
    // alignSelf:"center",
    flexDirection: "column",
    alignItems:"center",
    justifyContent:"center",
    marginTop: 19.5,
    flexWrap:"wrap"

    // fontSize: 40
},
 
content:{
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center"
},
image:{
    width:windowWidth/2,
    height: 150,
    borderWidth: 3,
    marginBottom: 20,
    marginLeft: 10,
    marginBottom: 6
},
col:{
    flexDirection: "column",
},
mention: {
    // fontSize: 17,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: "#244dc9",
    margin: 0,
    padding: 0,

   
    // alignSelf: "center",
    // justifyContent: "center"
  }

})
