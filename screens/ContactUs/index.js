import { Input,Button } from 'react-native-elements'
import React, { useLayoutEffect, useState } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { showMessage } from 'react-native-flash-message';
import { styles } from './styles';

const ContactUs = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [message, setMessage] = useState('');
    const isNotValid = name === '' || email === '' || website === '' || message === '';
	const errorMessage = isNotValid ? 'This Field is Required' : '';

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: "Contact Us",
            headerTitleAlign: "center"
        })
    },[navigation])

    const handlePress = () =>{
        if(!isNotValid){
            showMessage({
                type: 'success',
                message: 'Message Successfully Sent!'
            })
            navigation.navigate('Profile');
        }else{
            showMessage({
                type: 'danger',
                message: 'Please fill all the details!'
            })
        }
    }

    return (
        <KeyboardAvoidingView style={{flex:1, backgroundColor: "white"}}>
        <ScrollView style={styles.container}>
            <Input  
                labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
                label="Name"
                style={[ styles.input ]}
                value={name}
                onChangeText={setName}
                autoFocus
                errorMessage={errorMessage}
                autoCapitalize="none"
                inputContainerStyle={{margin: 10}}
            />
            <Input
                onChangeText={(text) => setEmail(text)}
                value={email}
                label="email"
                inputContainerStyle={{ height: 40 }}
                labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
                autoFocus
                errorMessage={errorMessage}
                autoCapitalize="none"
                inputContainerStyle={{margin: 10}}

            />
            <Input
                onChangeText={(text) => setWebsite(text)}
                value={website}
                label="Website"
                inputContainerStyle={{ height: 40 }}
                labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
                autoFocus
                errorMessage={errorMessage}
                autoCapitalize="none"
                inputContainerStyle={{margin: 10}}

            />
            
            <Input
                onChangeText={(text) => setMessage(text)}
                value={message}
                label="Message"
                inputContainerStyle={{ height: 40 }}
                labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
                autoFocus
                errorMessage={errorMessage}
                autoCapitalize="none"
                inputContainerStyle={{margin: 10}}

            />
            
            <Button
                title="Submit"
                buttonStyle={{ backgroundColor: '#49cbe9', margin: 20, height: 50 }}
                onPress={() => handlePress()}
            />
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

export default ContactUs

