import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View ,ScrollView} from 'react-native';
import { Button, Text } from 'react-native-elements';
import ImageFilters, { Constants } from 'react-native-gl-image-filters';
import Filters from '../../components/Filters';
import { Surface } from 'gl-react-expo';
import * as ImageManipulator from 'expo-image-manipulator';

const width = Dimensions.get('window').width ;
const height  =Dimensions.get('window').height;
let settings = [
	{
		name: 'hue',
		minValue: 0,
		maxValue: 6.3
	},
	{
		name: 'blur',
		minValue: 0,
		maxValue: 30
	},
	{
		name: 'sepia',
		minValue: -5,
		maxValue: 5
	},
	{
		name: 'sharpen',
		minValue: 0,
		maxValue: 15
	},
	{
		name: 'negative',
		minValue: -2.0,
		maxValue: 2.0
	},
	{
		name: 'contrast',
		minValue: -10.0,
		maxValue: 10.0
	},
	{
		name: 'saturation',
		minValue: 0.0,
		maxValue: 2
	},
	{
		name: 'brightness',
		minValue: 0,
		maxValue: 5
	},
	{
		name: 'temperature',
		minValue: 0.0,
		maxValue: 40000.0
	},
	{
		name: 'exposure',
		minValue: -1.0,
		maxValue: 1.0,
		step: 0.05
	}
];

const FilterImage = ({navigation, route}) => {
	let image = useRef();
	const [img, setImg] = useState(null);
	let [ filters, setFilters ] = useState({
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
		exposure: 0
	});

	const saveImage = async () => {
		if (!image) return;

		const result = await image.glView.capture();
        navigation.navigate("Post", {photos: result.uri});
		console.log("results------>",result.uri);
	};

	const resetImage = () => {
		setFilters({...Constants.DefaultValues});
	};

	useEffect(() =>{
		_rotate90andFlip();
	},[])

	const _rotate90andFlip = async () => {
		const manipResult = await ImageManipulator.manipulateAsync(
		  route.params.localUri || route.params.uri,
		  [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Vertical }],
		  { compress: 1, format: ImageManipulator.SaveFormat.PNG }
		);
		setImg(manipResult);
		// if (!image) return;

		// const result = await image.glView.capture();
        // navigation.navigate("Post", {uri: result.uri});

	  };
 
    // console.log("params-->",route.params.uri);
 
// console.log(img);
	return (
		<View style={styles.container}>
			<Text style={{color:"white", fontSize: 20}}>Image Filters</Text>
	 
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <>
            <Surface style={{ width, height: 550  }} ref={ref => (image = ref)}>
              <ImageFilters  {...filters} width={300} height={300}>
                {{ uri: route.params.uri }}
              </ImageFilters>
            </Surface>
            {settings.map(filter => (
              <Filters
                key={filter.name}
                value={filters[`${filter.name}`]}
                name={filter.name}
                minimum={filter.minValue}
                maximum={filter.maxValue}
                onChange={value =>  setFilters({...filters, [`${filter.name}`] : value})}
              />
            ))}
            <Button
                rounded={false}
                style={styles.button}
                block
                onPress={() => saveImage()} title="Save" />
                <Button
                    rounded={false}
                    danger
                    style={styles.button}
                    block
                    onPress={resetImage} title="Reset" />
          </>
        </ScrollView>
		</View>
	);
};

export default FilterImage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
        flexDirection: "column",
        justifyContent:"center",
        alignItems:"center"
	},
    button: { marginTop: 20, borderRadius: 0 },
    content: { marginTop: 20, marginHorizontal: 20 },
});
