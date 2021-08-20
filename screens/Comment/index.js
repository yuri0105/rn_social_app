import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import {  Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Platform } from 'react-native';
import { Keyboard } from 'react-native';
import * as firebase from 'firebase'
import { db } from '../../firebase';
import CommentComp from '../../components/CommentComp';
import EmojiSelector, { Categories } from 'react-native-emoji-selector'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Image ,Modal} from 'react-native';
import {fetchGifs, fetchSearch} from '../../gifs';
import Editor, { EU } from "react-native-mentions-editor";
import { EU as EditorUtils } from 'react-native-mentions-editor';
import { selectUsers } from '../../redux/features/usersSlice';
import { useSelector } from 'react-redux';
import { styles } from './styles';


const Comment = ({ navigation,route }) => {
	const [ input, setInput ] = useState('');
    const uid = route.params.uid;
    const postId = route.params.postId;
    const [comments, setComments] = useState([]);
    const user = firebase.auth().currentUser;
	const users = useSelector(selectUsers);
	const [emoji, setEmoji] = useState(false);
	const [gifs, setGifs] = useState([]);
	const [term, updateTerm] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [clearInput,setClearInput] =  useState(false);
	const [showEditor, setShowEditor] = useState(true);
	const [showMentions,setShowMentions] =  useState(false);
	const [updatedUsers, setUpdatedUsers] = useState([]);
    const [keys, setKeys] = useState([]);




	useEffect(() =>{
		if(users){
			setUpdatedUsers(users.map((user) =>({
				username: user?.displayName,
				email: user?.email,
				id: user?.uid,
			})))
		}
	},[users])
 

	useEffect(() =>{
		if(!term)
			fetchGifs(setGifs);
	},[])
 

    const onEdit = (newTerm) => {
		updateTerm(newTerm);
		fetchSearch(setGifs);
	  }
	
 
    
    useLayoutEffect(() =>{
        const unsubscibe =  db.collection('posts').doc(uid).collection("userPosts").doc(postId).collection("comments").orderBy('timestamp', 'asc').onSnapshot((snapshot) =>
            setComments(
                snapshot.docs.map((doc) =>({
                    id: doc.id,
                    data: doc.data()
                }))
            )
            )
            return unsubscibe;
    }, [navigation])

	const sendMessage = (image) => {
		let img;
		img = typeof image === "string" ? image: ''
        Keyboard.dismiss();
		setModalVisible(false);
		db.collection("users").doc(uid).collection("newNotifications").doc(user?.uid).set({
			notification: true
		})
        db.collection("posts").doc(uid).collection("userPosts").doc(postId).collection("comments").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            uid: user.uid,
			image: img,
			displayName: user?.displayName,
			photoURL: user?.photoURL
        })
          
        setInput('');
		
		setClearInput(true);
		if(EditorUtils.findMentions(input).length > 0 && !keys[EditorUtils.findMentions(input)?.[0]?.id]){
            setKeys(prev => [...prev, EditorUtils.findMentions(input)?.[0]?.id])
            db.collection("users").doc(EditorUtils.findMentions(input)?.[0]?.id).collection("mentions").add({
                mentionedBy: {
                    uid: user?.uid,
                    photoURL: user?.photoURL,
                    displayName: user?.displayName
                },
                postId: postId,
                userId: uid
            })
        }
        
    };


	const findMentions =  (val) => {
        /**
         * Both Mentions and Selections are 0-th index based in the strings
         * meaning their indexes in the string start from 0
         * findMentions finds starting and ending positions of mentions in the given text
         * @param val string to parse to find mentions
         * @returns list of found mentions 
         */
        let reg = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/igm;
        let indexes = [];
        while (match = reg.exec(val)) {
            indexes.push({
                start: match.index, 
                end: (reg.lastIndex-1),
                username: match[1],
                userId: match[2],
                type: EU.specialTagsEnum.mention
            });
        }
        return indexes;
    }

 
	const onChangeHandler = (text) =>{
		setInput(text?.text);
		setClearInput(false);
	}
	
	const toggleEditor = () => {
		/**
		 * This callback will be called
		 * once user left the input field.
		 * This will handle blur event.
		 */
 
	  };

	  const onHideMentions = () => {
		/**
		 * This callback will be called
		 * When MentionsList hide due to any user change
		 */
		setShowMentions(false);
	  };

 const editorStyles =  {
    mainContainer: {
		borderRadius: 30,
		borderColor: "rgba(0,0,0,0.4)",
		marginRight: 5,
	}, 
    editorContainer: { 
	}, 
    inputMaskTextWrapper: {
	},
    inputMaskText: {
		color:"black"
	},
    input: {	
	},
    mentionsListWrapper:{
	
	},
    mentionListItemWrapper: {
	},
    mentionListItemTextWrapper: {
	},
    mentionListItemTitle: {
	},
    mentionListItemUsername: {
	}
}
	 
 

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar style="dark" />
		
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.container}
				keyboardVerticalOffset={90}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
					<ScrollView contentContainerStyle={{
                        paddingTop: 15
                    }}>
                    {comments.map(({id, data}) => 
                        <CommentComp userId={uid} postId={postId} key={id} id={id} data={data} uid={data?.uid} />

                        )}
                    </ScrollView>
					<View style={styles.footer}>
					<TouchableOpacity onPress={() => {setModalVisible(!modalVisible)}}>
						<MaterialCommunityIcons name="gif" size={30} color="black" />
					</TouchableOpacity>
					<TouchableOpacity  onPress={() =>{emoji ? setEmoji(false) : setEmoji(true)}}>
						<Text style={styles.emoji}>😄</Text>
					</TouchableOpacity>
					 
							<Editor
								list={updatedUsers}
								editorStyles = {editorStyles}
								initialValue={input}
								clearInput={clearInput}
								onChange={onChangeHandler}
								showEditor={showEditor}
								toggleEditor={toggleEditor}
								showMentions={showMentions}
								onHideMentions={onHideMentions}
								placeholder="Type message here..."
								
								/>
						{/* </View> */}
						<TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
							<Ionicons name="send" size={24} color="#2B68E6" />
						</TouchableOpacity>
					</View>
                    </>
				</TouchableWithoutFeedback>
			

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					style={{flexDirection:"column"}}
					onRequestClose={() => {
					setModalVisible(!modalVisible);
					}}
					>
					<View style={styles.top} />	
					<View style={styles.gif}> 
						<View style={styles.modalHeader}>
							<TouchableOpacity style={{marginRight: 10}} onPress={() => {setModalVisible(false)}}>
								<Ionicons name="md-arrow-back" size={24} color="white" />
							</TouchableOpacity>
						<TextInput
							placeholder="Search Giphy"
							placeholderTextColor='#fff'
							style={styles.textInput}
							onChangeText={(text) => onEdit(text)}
						/>
						</View>
						<FlatList
							data={gifs}
							numColumns={2}
							style={{marginBottom: 40}}
							renderItem={({item}) => (
								<TouchableOpacity onPress={() => sendMessage(item.images.original.url)}>
									<Image
										resizeMode='contain'
										style={styles.image}
										source={{uri: item.images.original.url}}
									/>
								</TouchableOpacity>
						)}/>
					</View>
					</Modal> 
			</KeyboardAvoidingView>
			
			{emoji ? <EmojiSelector  
						showSearchBar={false}
						showTabs={true}
						showHistory={true}
						showSectionTitles={true}
          				category={Categories.all} onEmojiSelected={(emoji) => setInput(emoji)} 
					/>	: null
			}
			
		</SafeAreaView>
	);
};

export default Comment;



 
  