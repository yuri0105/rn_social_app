import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, PermissionsAndroid, TouchableOpacity, Alert, Modal, TextInput, Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { ActivityIndicator } from 'react-native';
import { storage } from '../../firebase';
import { db } from '../../firebase';

function AddPersonalStory({ navigation, route }) {

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const { currentUser } = route.params;

    const [header, setHeader] = useState('')
    const [desc, setDesc] = useState('')
    const [post, setPost] = useState([])
    const [isPicker, setIsPicker] = useState(true)
    const [uri, setUri] = useState('')
    const [isPicked, setIsPicked] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [formModal, setFormModal] = useState(false)
    const [uploadedData, setUploadedData] = useState([])
    const [isUploadInProcess, setIsUploadInProcess] = useState(false)

    useEffect(() => {
        if (isPicker) {
            permit();
        }
    }, []);

    // console.log(currentUser)

    useEffect(() => {
        if (isUploadInProcess) {
            if (post.length == uploadedData.length) {
                setIsUploadInProcess(false)
                db.collection('personalStory').doc(currentUser?.uid).collection('data')
                    .add({
                        posts: uploadedData,
                        uid: currentUser?.uid
                    }).then(() => {
                        setUploading(false)
                        navigation.goBack(null)
                    }).catch((err) => console.log(err))
            }
        }
    }, [isUploadInProcess, uploadedData])

    // console.log(uploadedData, 'datt')

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
            setUri(path)
            setIsPicked(true)
            setIsPicker(false)


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

    const uploadToDb = () => {
        setUploading(true)
        post.forEach((item) => {
            uploadFileToFirebaseStorage(item)
        })
    }

    async function uploadFileToFirebaseStorage(item) {
        const response = await fetch(item.image);
        const blob = await response.blob();
        var ref = firebase.storage().ref(`PersonalStory/${currentUser?.uid}/${item.image}`);

        await ref.put(blob)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .then(downloadURL => {
                console.log(downloadURL)
                setIsUploadInProcess(true)
                setUploadedData(state => [...state, { image: downloadURL, title: item.title, desc: item.desc }])
            });
    }


    const update = () => {
        setPost(state => [...state, { image: uri, title: header, desc: desc }])
        setIsPicked(false)
        setHeader('')
        setDesc('')
        setUri('')
    }

    console.log(post)


    return (
        <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
            <Modal
                animationType="slide"
                visible={isPicked}
                style={{ flexDirection: "column" }}
                onRequestClose={() => {
                    setIsPicked(!isPicked)
                }}
            >
                <View style={{ height: "100%", width: "100%", backgroundColor: "white", }}>
                    <Image source={{ uri: uri }} style={{ width: '100%', height: '47%', resizeMode: 'contain', marginTop: 10 }} />
                    <View style={{ height: "50%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white', position: "absolute", bottom: 0 }}>
                        <TextInput maxLength={15} placeholder='Set Title' textAlignVertical="center" multiline={false} style={{ height: 50, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={header} onChangeText={(text) => setHeader(text)} />
                        <TextInput maxLength={30} placeholder='Set Description' textAlignVertical="center" multiline={false} style={{ height: 50, marginTop: 10, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={desc} onChangeText={(text) => setDesc(text)} />
                        <TouchableOpacity onPress={update} style={{ width: '90%', marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <FlatList
                data={post}
                horizontal
                keyExtractor={(item, index) => `${item.image}${index}`}
                renderItem={({ item }) => (
                    <View style={{ height: height, width: width }}>
                        <Image style={{ height: '100%', width: "100%" }} source={{ uri: item.image }} />
                        <Text style={{ position: "absolute", bottom: 130, left: 20, fontSize: 25, fontWeight: "bold", zIndex: 1, color: "white" }}>{item.title}</Text>
                        <View style={{ position: "absolute", bottom: 15, left: 20, width: "60%", height: 100, }}>
                            <Text numberOfLines={3} style={{ fontSize: 18, fontWeight: "500", color: "white", }}>{item.desc}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={{ height: 70, width: width, backgroundColor: "white", position: 'absolute', bottom: 0, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity disabled={uploading} onPress={uploadToDb} style={{ width: '90%', marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", }}>
                    {uploading ? <ActivityIndicator color='white' size={'small'} /> : <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Done</Text>}
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={permit} style={{ position: 'absolute', bottom: 90, right: 20, backgroundColor: "#0080FF", height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name='add' size={35} color='white' />
            </TouchableOpacity>
        </View>
    )
}

export default AddPersonalStory;