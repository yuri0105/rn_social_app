import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { fetchGifs, fetchSearch } from '../../gifs';
const windowWidth = Dimensions.get('window').width;
import { SearchBar } from 'react-native-elements';

const RenderGif = ({handleSelect}) => {
	const [ gifs, setGifs ] = useState([]);
	const [ term, updateTerm ] = useState('');

	useEffect(() => {
		if (term?.length ==0) fetchGifs(setGifs);
	}, []);
	const onEdit = (newTerm) => {
        // console.log('new term-->',newTerm);
		updateTerm(newTerm);
		fetchSearch(setGifs,newTerm);
	};


    const handlePress =(image) =>{
        console.log('image is-->',image);
        handleSelect(image)
    }
	// console.log('gif00s<',gifs);
	return (
		<Animated.View style={styles.gif}>
			<View style={styles.header}>

            </View>
			<SearchBar
				// disabled
				autoCorrect={false}
				containerStyle={{ backgroundColor: 'gray', marginBottom: 10,borderTopWidth: 0, borderBottomWidth:0 }}
                inputContainerStyle={{borderWidth: 0}}
                inputStyle={{borderWidth: 0}}
				round
				lightTheme
				placeholder="Search"
				onChangeText={onEdit}
				value={term}
			/>
			{/* </View> */}
			<FlatList
				data={gifs}
				numColumns={2}
				style={{ marginBottom: 40 }}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handlePress(item.images.original.url)}>
						<Image resizeMode="contain" style={styles.image} source={{ uri: item.images.original.url }} />
					</TouchableOpacity>
				)}
			/>
		</Animated.View>
	);
};

export default RenderGif;

const styles = StyleSheet.create({
	gif: {
		// maxHeight: "60%",
		// position:"absolute",
		backgroundColor: 'gray'
		// top: 300,
	},
    header:{
       
    },

	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: 10,
		alignItems: 'center'
	},
	image: {
		width: windowWidth / 2,
		height: 150,
		borderWidth: 3,
		marginBottom: 20
	},
	textInput: {
		bottom: 0,
		height: 50,
		flex: 1,
		marginRight: 15,
		backgroundColor: '#ECECEC',
		padding: 10,
		color: 'black',
		borderRadius: 30
	}
});
