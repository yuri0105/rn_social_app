import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import { styles } from '../ChatScreen/styles';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { ActivityIndicator } from 'react-native';
import { storage } from '../../firebase';
import { db } from '../../firebase';


function SendPvtImage({ navigation, route }) {

    const { uri, res, id, rid } = route.params;
    const [input, setInput] = useState('')
    const [passModal, setPassModal] = useState(false)
    const [password, setPassword] = useState('')
    const [isImageUploading, setIsImageUploading] = useState(false)

    const sendMessage = () => {
        setPassModal(true)
    }


    const Upload = async () => {
        if(password.length < 6){
            alert('Minimum 6 digit required');
            return;
        }
        uploadFileToFirebaseStorage();
    }


    async function uploadFileToFirebaseStorage() {
        setIsImageUploading(true)
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref(`PvtChat/${`${id}-${rid}`}/${Math.floor(100000 + Math.random() * 900000).toString()}`);

        await ref.put(blob)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .then(downloadURL => {
                update(downloadURL)
            });
    }

    const update = (downloadURL) => {
        db.collection('pvtNote')
            .doc(`${id}-${rid}`)
            .set({
                type: 'image',
                uri: downloadURL,
                msg: input,
                password: password,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                setIsImageUploading(false)
                setPassModal(false)
                navigation.navigate('ChatScreen')
            });
    }


    return (
        <View style={{ height: '100%', width: '100%', backgroundColor: "#ECECEC" }}>
            <Image source={{ uri: uri }} style={{ height: '90%', width: '100%', resizeMode: 'contain' }} />
            <View style={{ height: '10%', width: '100%', backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', }}>
                    <TextInput
                        value={input}
                        onSubmitEditing={sendMessage}
                        onChangeText={(text) => setInput(text)}
                        placeholder="Type message here..."
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                        <Ionicons name="send" size={24} color="#2B68E6" />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={passModal}
                style={{ flexDirection: "column" }}
                onRequestClose={() => {
                    setPassModal(!passModal)
                }}
            >
                <View style={{ height: "30%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", bottom: 0 }}>
                    <TextInput placeholder='Create Password' textAlignVertical="center" multiline={false} style={{ height: 50, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={password} onChangeText={(text) => setPassword(text)} />
                    <TouchableOpacity onPress={Upload} disabled={isImageUploading} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                        {isImageUploading ? <ActivityIndicator color='white' size='small' /> : <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>}
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default SendPvtImage;