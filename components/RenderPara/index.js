import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const RenderPara = ({heading, text}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

export default RenderPara

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems:"center",
        margin: 10
    },
    heading:{
        fontSize: 18,
        fontWeight:"bold"
    },
    text:{
        fontSize: 15
    }
})
