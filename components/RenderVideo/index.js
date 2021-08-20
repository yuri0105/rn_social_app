import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;


const index = ({videos}) => {
	const video = React.useRef(null);
	const [ status, setStatus ] = React.useState({});



    // console.log('video -->', videos);
	return (
		<View style={styles.container}>
			<Video
				ref={video}
				style={styles.video}
				source={{
					uri: videos[0]
				}}
				useNativeControls
				resizeMode="cover"
				isLooping
				onPlaybackStatusUpdate={(status) => setStatus(() => status)}
			/>
			<View style={styles.buttons}>
            <TouchableOpacity onPress={() => (status.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}>
                <AntDesign name={status.isPlaying ? "pausecircle" :  "play"} size={50} color="gray" />
            </TouchableOpacity>
				{/* <Button
					title={status.isPlaying ? 'Pause' : 'Play'}
					onPress={() => (status.isPlaying ? video.current.pauseAsync() : video.current.playAsync())}
				/> */}
			</View>
		</View>
	);
};

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
      },
      video: {
        // alignSelf: 'center',
        width: windowWidth,
        height: 530
      },
      buttons: {
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        position: "absolute",
        left: "45%"

      },
});
