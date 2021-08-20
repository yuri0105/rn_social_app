import React, { useState } from 'react'
import { Text, View, Image } from 'native-base'
import { Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

function LikedList({route, navigation}) {
    const data = (route.params)
    const [text, setText] = useState('');
    
    return (
        <SafeAreaView>
            <View style={styles.inputWrapper}>
                <TextInput 
                    style={styles.input} 
                    placeholder='Search...'
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                />
            </View>
            <View style={styles.container}>
                {data
                    .filter(item => {
                        if (!text) return true
                        if (item.displayName.includes(text)) {
                            return true
                        }
                    })
                        .map(item => (
                        <View style={styles.div}>
                            <Avatar
                                rounded
                                size="medium"
                                source={{
                                    uri: item.imageUrl || 'https://wallpaperaccess.com/full/345330.jpg' 
                                }}
                                containerStyle={{ margin: 10 }}
                                onPress={() => handleAvatarPress()}
                            />
                            <Text style={styles.title}>{item.displayName} </Text>

                            <AntDesign name="heart" size={24} color="red" />
                        </View>
                    ))
                }
            </View>
        </SafeAreaView>
    )
}

export default LikedList

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
    },
	div: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10,
        borderBottomWidth: 0.5,
        borderColor: '#888',
    },
    title: {
        fontSize: 18,
        marginLeft: 10,
        flexGrow: 1
    },
    inputWrapper: {
        paddingLeft: 20,
        paddingRight: 20,
    },
    input: {
        backgroundColor: '#eee',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 18,
    }
});
