import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native';

export default function PollQuestion({title, data}) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} >
                    { title }
                </Text>
            </View>
            <View style={styles.content}>
                {
                    data.map(val => {
                        if(val.id){
                            return(
                                <TouchableOpacity style={styles.input} key={val.id}>
                                    <Text style={styles.description}>
                                        {
                                            val.text
                                        }
                                    </Text>
                                </TouchableOpacity>
                            );
                        }
                    })
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5,
        alignSelf: 'center',
        height: 250,
        width: "80%",
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        top: '33%',
        left: '10%',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: 'black',
        width: '100%',
        height: 50,
        borderTopStartRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7
    },
    content: {
        flexDirection: 'column',
        height: 200,
        width: "100%",
        backgroundColor: 'white',
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 5,
        opacity: 0.85
    },
    title: {
        textAlign: 'center', 
        backgroundColor: 'transparent', 
        fontSize: 20, 
        color: 'white', 
        fontWeight: 'bold', 
        alignSelf: 'center'
    },
    description: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    card: {
        height: "90%",
        width: "48%",
        marginRight: 10,
        backgroundColor: 'gray',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 8
    },
    input: {
        backgroundColor: 'white',
        width: '90%',
        height: 40,
        borderRadius: 8,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        marginBottom: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    swipeable: {
        backgroundColor: '#000',
        width: '90%',
        height: 40,
        marginBottom: 8,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTrue: {
        width: 35,
        height: 35,
        backgroundColor: 'green',
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonFalse: {
        width: 35,
        height: 35,
        backgroundColor: 'red',
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }
});