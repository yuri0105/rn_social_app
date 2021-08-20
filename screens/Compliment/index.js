import {  Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect, useState } from 'react'
import { Keyboard } from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView,TextInput,FlatList,Image } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { View } from 'react-native';
import { TouchableWithoutFeedback,TouchableOpacity } from 'react-native';
import { gifEmoji } from '../../gifs';
import { showMessage } from "react-native-flash-message";
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import { styles } from '../Compliment/styles';

const width = Dimensions.get('window').width - 4;


const Compliment = ({navigation, route}) => {

    const [input, setInput] = useState('');
    const [selectedEmoji ,setSelectedEmoji] = useState(null);
    const sendUser = route?.params?.sendUser;
    const user = useSelector(selectUser);


    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: "Send Compliment",
            headerTitleAlign: "center",
        })
    },[navigation])

    const selectEmoji = (emoji) =>{
        if(emoji === selectedEmoji){
            setSelectedEmoji(null);
        }else{
            setSelectedEmoji(emoji)
        }
    }

    const sendCompliment = () =>{
        if(selectedEmoji){
            db.collection("users").doc(sendUser?.uid).collection("compliments").add({
                emoji: selectedEmoji,
                message: input,
                sentBy: {
                    uid: user?.uid,
                    photoURL: user?.photoURL,
                    displayName: user?.displayName
                }
            })
            db.collection("users").doc(sendUser?.uid).collection("newNotifications").doc(user?.uid).set({
                notification: true
            })

            navigation.goBack();
            
        }else{
            showMessage({
                message: "Please Select An Emoji",
                type: "danger",
              });
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
                    <FlatList
                        data={gifEmoji}
                        style={{ marginBottom: 10 }}
                        numColumns={2}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
						<View>
                            <TouchableOpacity onPress={() => selectEmoji(item)} activeOpacity={0.7} style={styles.container}>
                                <Image
                                    source={{ uri: item.url }}
                                    style={{ height: width / 2, width: width / 2, borderRadius: 10 }}
                                />
                                {selectedEmoji?.url === item?.url ? 
                                <View style={styles.overlay}>
                                </View> : null}
                            </TouchableOpacity>
						</View>
					)}
				/>
   
                <View style={styles.footer}>
                    <TextInput
                        value={input}
                        onSubmitEditing={sendCompliment}
                        onChangeText={setInput}
                        placeholder="Type message here..."
                        style={styles.textInput}
                        maxLength={150}
                    />
                      
                    <TouchableOpacity onPress={sendCompliment} activeOpacity={0.5}>
                        <Ionicons name="send" size={24} color="#2B68E6" />
                    </TouchableOpacity>
                </View>
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
    )
}

export default Compliment

