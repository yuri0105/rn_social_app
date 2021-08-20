import React , {useState} from 'react';
import {StyleSheet, ImageBackground, Pressable, Text, Image, View} from 'react-native';
import ExpoDraw from 'expo-draw'
import { FontAwesome } from '@expo/vector-icons';
import ColorPicker from '../ColorPicker/index';

export default function SketchBox({url}) {
    const [color, setColor] = useState({
        name : 'black',
        display : false
    })
    return (
        <>
            {!color.display ?
                <View style = {{height : '100%', width : '100%' , paddingVertical : 80, paddingHorizontal : 5}} >
                    <ImageBackground
                        style={{width : '100%', height : '100%', }}
                        source = {require('../../assets/image/Ash.jpg')}
                        resizeMode = 'cover'>
                        <ExpoDraw
                          strokes={[]}
                          containerStyle={{backgroundColor: 'transparent', height : '100%', width : '100%'}}
                          color={color.name}
                          clear={(clear) => {this._clear = clear}}
                          strokeWidth={4}
                          enabled={true}
                          onChangeStrokes={(strokes) => console.log(strokes)}
                        />
                    </ImageBackground>
                    <View style = {{
                            flexDirection: 'row',
                            padding : 10,
                            alignItems : 'center',
                            justifyContent: 'space-evenly',
                            marginTop : 10,
                    }}>
                        <Pressable
                         onPress = {() => {
                            let obj = {
                                name : color.name,
                                display : true
                            }
                            setColor(obj);
                        }}>
                            <Image
                                style = {{width : 30, height : 30}}
                                source = {require('../../assets/image/color_picker.png')}
                            />
                        </Pressable>
                        <Pressable
                            style = {{flexDirection : 'row', alignItems : 'center'}}
                            onPress={()=>{this._clear()}}
                            >
                            <FontAwesome name="eraser" size={30} color="black" />
                            <Text> Erase </Text>
                        </Pressable>
                    </View>
                 </View> : <ColorPicker setColor = {setColor}/> }
        </>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: "center"
    },
    text: {
        color: "white",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000c0"
    },
    container: {
        height : '100%',
        width : '100%',
        backgroundColor:  'blue',
        // height : '100%',
        // width : '100%',
        // backgroundColor: 'transparent',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
