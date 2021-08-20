import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Slider
} from 'react-native';
import { Surface } from 'gl-react-expo';
import ImageFilters, { Constants } from 'react-native-gl-image-filters';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height;


const settings = [
    {
        name: 'hue',
        minValue: 0,
        maxValue: 6.3,
    },
    {
        name: 'blur',
        minValue: 0,
        maxValue: 30,
    },
    {
        name: 'sepia',
        minValue: -5,
        maxValue: 5,
    },
    {
        name: 'sharpen',
        minValue: 0,
        maxValue: 15,
    },
    {
        name: 'negative',
        minValue: -2.0,
        maxValue: 2.0,
    },
    {
        name: 'contrast',
        minValue: -10.0,
        maxValue: 10.0,
    },
    {
        name: 'saturation',
        minValue: 0.0,
        maxValue: 2,
    },
    {
        name: 'brightness',
        minValue: 0,
        maxValue: 5,
    },
    {
        name: 'temperature',
        minValue: 0.0,
        maxValue: 40000.0,
    },
    {
        name: 'exposure',
        step: 0.05,
        minValue: -1.0,
        maxValue: 1.0,
    },
];

export default class ImageEditorComp extends Component {
    state = {
        ...settings,
        hue: 0,
        blur: 0,
        sepia: 0,
        sharpen: 0,
        negative: 0,
        contrast: 1,
        saturation: 1,
        brightness: 1,
        temperature: 6500,
        exposure: 0,
    };

    saveImage = async () => {
        if (!this.image) return;

        const result = await this.image.glView.capture();
        this.props.onPress(result.uri)
    };

    resetImage = () => {
        this.setState({
            ...Constants.DefaultValues,
        });
    }

    render() {
        const photo = this.props?.uri;

        return (
            <View style={{ heigth: "100%", width: "100%" }}>
                <Surface style={{
                    height: height,
                    width: width,
                }} ref={ref => (this.image = ref)}>
                    <ImageFilters {...this.state} width={width} height={width}>
                        {{ uri: photo }}
                    </ImageFilters>
                </Surface>
                <View style={{position:"absolute", bottom:80, right:10}}>
                    <TouchableOpacity
                        onPress={this.saveImage}
                        style={{
                            width: 130,
                            height: 40,
                            alignItems: 'center',
                            borderRadius: 4
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 20
                            }}
                        >
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 70, backgroundColor: "rgba(0,0,0,0.2)" }}>
                    <FlatList
                        data={settings}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <View style={{ width: width * 0.90, height: 50, alignItems: "center", flexDirection: "row", marginHorizontal: width * 0.05, marginTop: 10 }}>
                                <View style={{ backgroundColor: "white", height: 50, width: 100, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={{ fontSize: 14, fontStyle: "italic" }}>{item.name}</Text>
                                </View>
                                <Slider
                                    style={{ width: 250 }}
                                    minimumValue={item.minimum}
                                    maximumValue={item.maximum}
                                    onValueChange={(val) => this.setState({ [item.name]: val })}
                                />
                            </View>
                        )}
                    />
                </View>
            </View>
        );
    }
}

