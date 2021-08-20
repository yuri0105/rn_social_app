import React, { useEffect, useRef, useState } from 'react';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { SliderBox } from 'react-native-image-slider-box';

const ImageCarousel = ({ images, handleCurrentImage }) => {
	

	return (
		<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
			<SliderBox  currentImageEmitter={index => handleCurrentImage(images[index])} circleLoop autoplay={true} images={images} sliderBoxHeight={530} />
		</View>
	);
};

export default ImageCarousel;

const styles = StyleSheet.create({
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		height: 530
	},
	imageText: {
		color: 'white',
		fontSize: 16,
		textAlign: 'center',
		// paddingHorizontal: 10
		paddingHorizontal: 10,
		paddingVertical: 5
	},
	number: {
		position: 'absolute',
		bottom: 10,
		right: '5%',
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 30
	}
});

{
	/* <Carousel
					layout={'default'}
					ref={(ref) => (carousel = ref)}
					data={images}
					sliderWidth={300}
					itemWidth={windowWidth}
					renderItem={_renderItem}
					onSnapToItem={(index) => setIndex(index)}
				/> */
}

//             let carousel = useRef();
// const [ index, setIndex ] = useState(0);
// const [imageCarousel,setImageCarousel] = useState([]);

// const _renderItem = ({ item, index }) => {
// 	return (
// 		<ImageBackground source={{ uri: item }} style={styles.image}>
// 			{/* <Text>Hello</Text> */}
// 			<View style={styles.number}>
// 				<Text style={styles.imageText}>{index+1} / {images.length}</Text>
// 			</View>
// 		</ImageBackground>
// 	);
// };
