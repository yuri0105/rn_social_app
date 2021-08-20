import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { Text, View, TextInput, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUser, } from '../../redux/features/userSlice';

function ShoppingList() {

    const user = useSelector(selectUser);

    const [input, setInput] = useState('')
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [editModal, setEditModal] = useState(false)
    const [editText, setEditText] = useState('')
    const [editKey, setEditKey] = useState('')

    useEffect(() => {
        const subscriber = db
            .collection('shoppingList')
            .doc(user?.uid)
            .collection('list')
            .onSnapshot(querySnapshot => {
                const list = [];

                querySnapshot.forEach(documentSnapshot => {
                    list.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                    });
                });

                setData(list);
                setLoading(false);
            });

        // Unsubscribe from events when no longer in use
        return () => subscriber();
    }, []);


    const addToList = () => {
        if(input.length == 0){
            alert('Please enter a valid item.')
            return;
        }
        db.collection('shoppingList').doc(user?.uid).collection('list')
            .add({
                title: input,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                id: user?.uid
            }).then(() => {
                console.log('done')
                setInput('')
            })
    }

    const deleteItem = (key) => {
        db.collection('shoppingList').doc(user?.uid).collection('list')
            .doc(key).delete().then(() => {
                console.log('done')
            })
    }

    const editList = () => {
        if(editText.length == 0){
            alert('Please enter a valid item.')
            return;
        }
        db.collection('shoppingList').doc(user?.uid).collection('list')
            .doc(editKey).update({
                title: editText,
                time: firebase.firestore.FieldValue.serverTimestamp(),
                id: user?.uid
            }).then(() => {
                setEditModal(false);
                setEditText('');
                setEditKey('');
            })
    }

    const setEditing = (item) => {
        setEditText(item.title);
        setEditKey(item.key);
        setEditModal(true)
    }

    if (loading) {
        return (
            <View style={{ alignItems: 'center', justifyContent: "center", height: "100%", width: "100%" }}>
                <ActivityIndicator color='blue' size='large' />
            </View>
        )
    }

    return (
        <View style={{ height: "100%", width: '100%', backgroundColor: "white" }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, backgroundColor: "#ffffff", }}>
                <TextInput maxLength={50} placeholder='Add new item...' style={{ height: 50, width: '94%', marginHorizontal: '3%', marginTop: 8, padding: 5, fontSize: 16, borderRadius: 5, borderColor: "#c4c4c4", borderWidth: 1 }} value={input} onChangeText={(text) => setInput(text)} />
            </View>
            <View style={{ marginTop: 65, marginBottom: 60 }}>
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <View style={{ height: 60, width: '94%', marginHorizontal: '3%', alignItems: "center", flexDirection: "row", justifyContent: "space-between", borderColor: 'black', borderWidth: 1, borderRadius: 10, marginTop:10 }}>
                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>{item.title}</Text>
                            <View style={{ flexDirection: "row", marginRight: 10 }}>
                                <TouchableOpacity onPress={() => { setEditing(item) }} style={{ width: 50, height: 40, backgroundColor: "#31DB5E", alignItems: "center", justifyContent: "center", borderRadius: 5, marginRight: 5 }}>
                                    <AntDesign name='edit' color='white' size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.key)} style={{ width: 50, height: 40, backgroundColor: "#FF6464", alignItems: "center", justifyContent: "center", borderRadius: 5 }}>
                                    <MaterialCommunityIcons name='delete-empty-outline' color='white' size={25} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={{ position: "absolute", bottom: 0, right: 0, left: 0, height: 60, backgroundColor: "white", zIndex: 1, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity onPress={addToList} style={{ height: 50, width: '94%', marginHorizontal: '3%', padding: 5, borderRadius: 5, backgroundColor: "#0080FF", alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name='add' color='white' size={35} />
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={editModal}
                style={{ flexDirection: "column" }}
                onRequestClose={() => {
                    setEditModal(!editModal)
                }}
            >
                <View style={{ height: "30%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: "absolute", bottom: 0 }}>
                    <TextInput placeholder='Edit Item' textAlignVertical="center" multiline={false} style={{ height: 50, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={editText} onChangeText={(text) => setEditText(text)} />
                    <TouchableOpacity onPress={editList} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                        <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

export default ShoppingList;