import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, PermissionsAndroid, View, Text, TouchableOpacity, Button, TextInput, Modal, Image } from 'react-native';
import { db } from '../../firebase';
import * as firebase from 'firebase';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

function PrivateChat({ route, navigation }) {

    const [isExists, setIsExist] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isForm, setIsForm] = useState(false)
    const [data, setData] = useState({})
    const [note, setNote] = useState('')
    const [passForm, setPassForm] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [passModal, setPassModal] = useState(false)
    const [password, setPassword] = useState('')
    const [entPass, setEntPass] = useState('')
    const { id, rid } = route.params;

    useEffect(() => {
        db.collection('pvtNote')
            .doc(`${id}-${rid}`)
            .get()
            .then(documentSnapshot => {
                console.log('User exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    setPassForm(true)
                    setIsExist(true)
                    setData(documentSnapshot.data())
                    setLoading(false)
                    console.log('User data: ', documentSnapshot.data());
                } else {
                    setIsExist(false)
                    setLoading(false)
                }
            });
    }, [])

    const permit = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Upload();
            } else {
                Alert.alert(
                    "Permission Denied!",
                    "You need to give storage permission to download the file"
                );
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const Upload = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: 'image/*', copyToCacheDirectory: false })

            const path = await normalizePath(res.uri);
            setIsForm(false)
            navigation.navigate('PvtImage', { uri: path, res, id, rid })
            setImageUrl(path)
            //   const result = await RNFetchBlob.fs.readFile(path, 'base64')
            //   uploadFileToFirebaseStorage(result, res);


        } catch (err) {
            console.log(err)
        }
    }

    async function normalizePath(path) {

        const filePrefix = 'file://';
        if (path.startsWith(filePrefix)) {
            path = path.substring(filePrefix.length);
            try {
                path = decodeURI(path)
            } catch (e) { }
        }

        return path;
    }


    const update = () => {
        if(password.length < 6){
            alert('Minimum 6 digit required');
            return;
        }
        db.collection('pvtNote')
            .doc(`${id}-${rid}`)
            .set({
                type: 'text',
                msg: note,
                password: password,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                setIsForm(false)
                setPassModal(false)
                navigation.navigate('ChatScreen')
            });
    }

    const addNew = () => {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={isForm}
                style={{ flexDirection: "column" }}
                onRequestClose={() => {
                    setIsForm(!isForm)
                }}
            >
                <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
                    <View style={{ height: '8%', width: "100%", flexDirection: "row", alignItems: "center", backgroundColor: "#ffffff" }}>
                        <Feather onPress={() => setIsForm(false)} style={{ marginHorizontal: 10 }} name='arrow-left' size={25} />
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Add Note</Text>
                    </View>
                    <TextInput placeholder='Add note' textAlignVertical="top" multiline={true} style={{ height: '92%', padding: 10, fontSize: 17, width: '100%', marginHorizontal: '5%', backgroundColor: "#ececec", }} value={note} onChangeText={(text) => setNote(text)} />
                </View>
                <View style={{ position: "absolute", bottom: 0, right: 0, left: 0, height: 60, flexDirection: "row", alignItems: "center", zIndex: 1, backgroundColor: '#ffffff', justifyContent: "space-evenly" }}>
                    <TouchableOpacity>
                        <TouchableOpacity style={{ width: 50, height: 43, alignItems: 'center', justifyContent: "center" }} onPress={() => permit()}>
                            <Entypo name='attachment' size={20} color={'black'} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPassModal(true)} style={{ width: "80%", borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    const passModalView = () => {
        return(
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
                    <TouchableOpacity onPress={update} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    const checkPass = () =>{
        if(data.password === entPass){
            setPassForm(false)
        } else {
            alert('Wrong password')
        }
    }



    if (loading) {
        return (
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator color='blue' size='small' />
            </View>
        )
    }

    if (!isExists) {
        return (
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>No note added yet</Text>
                <Button onPress={() => setIsForm(true)} style={{ paddingHorizontal: 25, paddingVertical: 5, alignSelf: 'center', marginTop: 10, }} title="Add New" />
                {addNew()}
                {passModalView()}
            </View>
        )
    }

    if (passForm) {
        return (
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white' }}>
                <TextInput secureTextEntry={true} placeholder='Enter Password' textAlignVertical="center" multiline={false} style={{ height: 50, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={entPass} onChangeText={(text) => setEntPass(text)} />
                <TouchableOpacity onPress={checkPass} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                    <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={{ height: '100%', width: '100%' }}>
            {data.type == 'image' ?
                <View style={{ height: '90%', width: '96%', marginHorizontal: '2%', elevation: 1, marginTop: 10, alignItems: "center", borderRadius: 5 }}>
                    <Image style={{ height: '80%', resizeMode: 'contain', width: '98%', marginTop: 15 }} source={{ uri: data.uri }} />
                    <Text numberOfLines={3} style={{ alignSelf: "flex-start", margin: 10, fontSize: 18 }}>{data.msg}</Text>
                </View> : <View style={{ height: '90%', width: '96%', marginHorizontal: '2%', elevation: 1, marginTop: 10, alignItems: "center", borderRadius: 5 }}>
                    <Text numberOfLines={3} style={{ alignSelf: "flex-start", margin: 10, fontSize: 18 }}>{data.msg}</Text>
                </View>}
            <View style={{ height: '10%', width: '100%', justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity onPress={() => { setIsForm(true) }} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 40, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Add New</Text>
                </TouchableOpacity>
            </View>
            {addNew()}
            {passModalView()}
        </View>
    )
}

export default PrivateChat;