import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Platform, Image,Dimensions,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { AntDesign } from '@expo/vector-icons';
import { View, Text,FlatList } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import {  db, storage } from '../../firebase';
import * as firebase from 'firebase';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import {Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator';
 
const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);;
const width = Dimensions.get('window').width - 40;
const WINDOW_WIDTH = Dimensions.get('window').width;





const AddPhoto = () => {
	const [ startCamera, setStartCamera ] = React.useState(true);
    const [ flashMode, setFlashMode ] = React.useState('off');
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
    const [isVideoRecording, setIsVideoRecording] = useState(false);
    const [videoSource, setVideoSource] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [images, setImages] = useState([]);
    const [filteredImage, setFilteredImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState(null);
    const [videos, setVideos] = useState([]);
    const firebaseUser = firebase.auth().currentUser;
    const[input, setInput] = useState('');
    const [message, setMessage] = useState('');

    const navigation = useNavigation();

     



    
    
    useEffect(() => {
        (async () => {
        const perms = await Permissions.askAsync(
            Permissions.CAMERA,
            Permissions.AUDIO_RECORDING
        );
        setHasPermission(perms.status)
        })();
      }, []);

    const cameraRef = useRef();

 

    const recordVideo = async () => {
        if (cameraRef.current) {
          try {
            const videoRecordPromise = cameraRef.current.recordAsync({
              maxDuration: 3600
            });
            if (videoRecordPromise) {
              setIsVideoRecording(true);
              const data = await videoRecordPromise;
              const source = data.uri;
              if (source) {
                setIsPreview(true);
                console.log("video source", source);
                setVideoSource(source);
                setVideos(prev => [...prev, videoSource])

              }
            }
          } catch (error) {
            console.warn(error);
          }
        }
      };
      const stopVideoRecording = () => {
        if (cameraRef.current) {
          setIsPreview(false);
          setIsVideoRecording(false);
          cameraRef.current.stopRecording();
        }
    }
        
        const renderVideoPlayer = () => (

            <Video
              source={{ uri: videoSource }}
              shouldPlay={true}
              style={styles.media}
              resizeMode="cover"
              isLooping
            />
          );

          const renderVideoRecordIndicator = () => (
            <View style={styles.recordIndicatorContainer}>
              <View style={styles.recordDot} />
              <Text style={styles.recordTitle}>{"Recording..."}</Text>
            </View>
          );

            
          
          const switchCamera = () => {
            if (isPreview) {
              return;
            }
            setCameraType((prevCameraType) =>
              prevCameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          };
         
          const takePicture = async () => {
            if (cameraRef.current) {
              const options = { quality: 0.5, base64: true, skipProcessing: true };
              const data = await cameraRef.current.takePictureAsync(options);
              const source = data.uri;
              if (source) {
                await cameraRef.current.pausePreview();
                const manipResult = await ImageManipulator.manipulateAsync(
                  source,
                  [{ rotate: 0 }, {resize:{width:800, height:1050}}],
                  { compress: 1, format: ImageManipulator.SaveFormat.PNG }
                );
                navigation.navigate('ImageEditor',{photo: manipResult.uri});
                await cameraRef.current.resumePreview();
              }
            }
          };
        

          const renderCaptureControl = () => (
            <View style={styles.control}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!isCameraReady}
                onLongPress={recordVideo}
                onPressOut={stopVideoRecording}
                onPress={takePicture}
                style={styles.capture}
              />
            </View>
          );
        

        const __handleFlashMode = () => {
            if (flashMode === 'on') {
                setFlashMode('off');
            } else if (flashMode === 'off') {
                setFlashMode('on');
            } else {
                setFlashMode('auto');
            }
        };
        
        
        if (hasPermission === null) {
            return <View />;
          }
          if (hasPermission === false) {
            return <Text style={styles.text}>No access to camera</Text>;
          }
     
    const onCameraReady = () => {
        setIsCameraReady(true);
      };

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          });
          if (!result.cancelled) {
            navigation.navigate('CameraPreview',{photo: result.uri});
          }
      };

      

    return (
        <View style={{
            flex: 1,
            width: '100%'
            }}>
              <Camera
                ref={cameraRef}
                ratio={"16:9"}
                style={styles.container}
                type={cameraType}
                flashMode={flashMode}
                onCameraReady={onCameraReady}
                onMountError={(error) => {
                console.log("cammera error", error);
                }}>
                    {!isPreview ? (
                            <View
                                style={{
                                flex: 1,
                                width: '100%',
                                backgroundColor: 'transparent',
                                flexDirection: 'row'
                            }}
                            >
                            <View
                                style={{
                                position: 'absolute',
                                left: '5%',
                                top: '10%',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                            >
                            <TouchableOpacity
                                onPress={__handleFlashMode}
                                style={{

                                height: 25,
                                width: 25
                                }}
                            >
                                <Ionicons name={flashMode==='on' ? "ios-flash" : "ios-flash-off"} size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                    onPress={switchCamera}
                                    style={{
                                        marginTop: 20,
                                        height: 25,
                                        width: 25
                                    }}
                                    >
                                    <Text
                                        style={{
                                        fontSize: 20
                                        }}

                                        >
                                        <Entypo name="retweet" size={28} color="white" />
                                    </Text>
                            </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={{
                                position: 'absolute',
                                right: '8%',
                                top: '10%',

                                }}
                                onPress={() => navigation.goBack()}
                            >
                                <Entypo name="cross" size={38} color="white" />
                            </TouchableOpacity>
                              
                            <TouchableOpacity style={{
                                position: 'absolute',
                                left: '2%',
                                bottom: '5%',
                                borderRadius: 5,
                                height: captureSize -30,
                                width: captureSize -30,
                                marginHorizontal: 31,
                                }}
                                onPress={() => pickImage()}>
                                    <Feather name="image" size={30} color="white" />
                                </TouchableOpacity>
                            </View>

                    ): <View /> }
                </Camera>
                <View style={styles.container}>
                    {isVideoRecording && renderVideoRecordIndicator()}
                    {videoSource && renderVideoPlayer()}
                    {!videoSource && !isPreview && renderCaptureControl()}
                </View>
        </View>
    )
}

export default AddPhoto

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: Constants.statusBarHeight,
        flex:1,
        marginBottom:10,
    }
      ,
      closeButton: {
        position: "absolute",
        top: 35,
        left: 15,
        height: closeButtonSize,
        width: closeButtonSize,
        borderRadius: Math.floor(closeButtonSize / 2),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#c4c5c4",
        opacity: 0.7,
        zIndex: 2,
      },
      media: {
        ...StyleSheet.absoluteFillObject,
      },
      closeCross: {
        width: "68%",
        height: 1,
        backgroundColor: "black",
      },
      control: {
        position: "absolute",
        flexDirection: "row",
        bottom: 38,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      },
      capture: {
        backgroundColor: "#f5f6f5",
        borderRadius: 5,
        height: captureSize,
        width: captureSize,
        borderRadius: Math.floor(captureSize / 2),
        marginHorizontal: 31,
      },
      recordIndicatorContainer: {
        flexDirection: "row",
        position: "absolute",
        top: 25,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
        opacity: 0.7,
      },
      recordTitle: {
        fontSize: 14,
        color: "#ffffff",
        textAlign: "center",
      },
      recordDot: {
        borderRadius: 3,
        height: 6,
        width: 6,
        backgroundColor: "#ff0000",
        marginHorizontal: 5,
      },
      text: {
        color: "#fff",
      },
 
      textInput: {
        // bottom: 0,
        height: 70,
        flex: 1,
        marginBottom: 20,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'black',
        borderRadius: 30,
        // position:"absolute"
        },

 
	headerContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	button: {
		backgroundColor: '#49cbe9',
		borderRadius: 30
	},
	buttonText: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16
	},
	newTweetContainer: {
		flexDirection: 'row',
		// alignItems:"center",
		paddingHorizontal: 15
	},
	inputsContainer: {
		marginLeft: 10
	},
	tweetInput: {
		height: 100,
		maxHeight: 300,
		fontSize: 20
	},
	pickImage: {
		fontSize: 18,
		color: '#49cbe9',
		marginVertical: 10,
		fontWeight: 'bold'
	},
	image: {
		 marginHorizontal: 5,
		borderRadius: 10,
    marginVertical: 5,
  	}
}) 