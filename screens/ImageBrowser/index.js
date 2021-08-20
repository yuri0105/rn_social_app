import React, { useEffect, useState } from 'react';
import {  View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';

import { ImageBrowser } from 'expo-image-picker-multiple';
import { styles } from './styles';
 


const ImageBrowserScreen = ({route, navigation}) => {
    const [hasPermission, setHasPermission] = useState(null);

	useEffect(() => {
        (async () => {
        const perms = await Permissions.askAsync(
			Permission.MEDIA_LIBRARY
        );
        console.log(perms.status);
        setHasPermission(perms.status)
        })();
      }, []);
	const _getHeaderLoader = () => <ActivityIndicator size="small" color={'#49cbe9'} />;

 
	const imagesCallback = (photos) => {
		navigation.setOptions({
		headerRight: () => _getHeaderLoader()
		});
		console.log(2);
		const cPhotos = [];
		for(let photo of photos) {
		cPhotos.push({
		uri: photo.uri,
		name: photo.filename,
		type: 'image/jpg'
		})
		}
		navigation.navigate('AddPost', {photos: cPhotos});
		
		};
 
	const _renderDoneButton = (count, onSubmit) => {
		if (!count) return null;
		return (
			<TouchableOpacity title={'Done'} onPress={onSubmit}>
				<Text onPress={onSubmit}>Done</Text>
			</TouchableOpacity>
		);
	};
	const updateHandler = (count, onSubmit) => {
	    navigation.setOptions({
			title: `Selected ${count} files`,
			headerRight: () => _renderDoneButton(count, onSubmit)
		});
	};
	if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text style={styles.text}>No access to camera</Text>;
      }

	const renderSelectedComponent = (number) => (
		<View style={styles.countBadge}>
			<Text style={styles.countBadgeText}>{number}</Text>
		</View>
	);

  

	const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;
	return (
		<View style={[ styles.flex, styles.container ]}>
			<ImageBrowser
				max={4}
				onChange={updateHandler}
				callback={imagesCallback}
				renderSelectedComponent={renderSelectedComponent}
				emptyStayComponent={emptyStayComponent}
			/>
		</View>
	);
};

export default ImageBrowserScreen;

