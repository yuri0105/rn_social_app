import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux'
import { setAuth } from '../../redux/features/authenticate';

function LocalAuth({navigation}) {

    const [password, setPassword] = useState('')
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [authEnabled, setAuthEnabled] = useState(false)
    const [val, setVal] = useState('')

    useEffect(() => {
        check();
        console.log('I ran')
    }, [navigation, authEnabled])

    const check = async () => {
        try {
            const value = await AsyncStorage.getItem('@local_auth')
            if (value !== null) {
                setAuthEnabled(true)
                setVal(value)
                setLoading(false)
            } else {
                setAuthEnabled(false)
                setLoading(false)
            }
        } catch (e) {
            // error reading value
        }
    }

    const update = async () => {
        if (password.length != 6) {
            alert("Enter a valid 6 digit password")
            return;
        }
        try {
            await AsyncStorage.setItem('@local_auth', password)
            setAuthEnabled(true)
            setVal('')
            setPassword('')
            navigation.goBack(null)
        } catch (e) {
            console.log(e)
        }
    }

    const disable = async () => {
        if (password !== val) {
            alert("Wrong password")
            return;
        }
        try {
            await AsyncStorage.removeItem('@local_auth')
            setAuthEnabled(false)
            setVal('')
            setPassword('')
            navigation.goBack(null)
        } catch (e) {
            console.log(e)
        }
    }

    if (loading) {
        return null
    }

    if (authEnabled) {
        return (
            <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white', }}>
                <Text style = {{textAlign:"center"}}>Auth already enabled</Text>
                <TextInput secureTextEntry={true} maxLength={6} keyboardType={'phone-pad'} placeholder='Enter Pin to Disable' textAlignVertical="center" multiline={false} style={{ height: 50, marginTop:10, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={password} onChangeText={(text) => setPassword(text)} />
                <TouchableOpacity onPress={disable} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                    <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Disable</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ height: "100%", width: "100%", alignItems: "center", justifyContent: "center", backgroundColor: 'white', }}>
            <TextInput secureTextEntry={true} maxLength={6} keyboardType={'phone-pad'} placeholder='Create Pin to continue' textAlignVertical="center" multiline={false} style={{ height: 50, width: '90%', marginHorizontal: '5%', borderColor: "#c4c4c4", borderWidth: 1, padding: 5, borderRadius: 10, fontSize: 16 }} value={password} onChangeText={(text) => setPassword(text)} />
            <TouchableOpacity onPress={update} style={{ width: "90%", marginHorizontal: '5%', borderRadius: 10, backgroundColor: "#0080FF", height: 50, justifyContent: "center", alignItems: "center", marginTop: 10 }}>
                <Text style={{ color: "white", fontSize: 17, fontWeight: "bold" }}>Submit</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LocalAuth;