import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import * as firebase from 'firebase';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import AddPostComp from '../../components/AddPostComp';
import ImageEditorComp from '../../components/ImageEditorComp';
import * as ImageManipulator from 'expo-image-manipulator';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);;

const AddPost = ({ route }) => {
  const [tweet, setTweet] = useState('');
  const user = useSelector(selectUser);
  const [startCamera, setStartCamera] = React.useState(true);
  const [flashMode, setFlashMode] = React.useState('off');
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const [videos, setVideos] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [press, setPress] = useState(false);
  const [edit, setEdit] = useState(false)

  const generateThumbnail = async (vidUri) => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        vidUri,
        {
          time: 1000,
        }
      );
      setThumbnails(prevArray => [...prevArray, uri]);
      console.log('uri --->', uri);
      return uri;
    } catch (e) {
      console.warn(e);
      return '';
    }
  };


  useEffect(() => {
    (async () => {
      const perms = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.AUDIO_RECORDING,
      );
      console.log(perms.status);
      setHasPermission(perms.status)
    })();
  }, []);


  useEffect(() => {
    if (route?.params?.photos) {
      uploadImage(route?.params.photos);
    }
  }, [route]);



  const onCameraReady = () => {
    setIsCameraReady(true);
  };


  const cameraRef = useRef();

  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
            setVideos(prev => [...prev, videoSource])
            generateThumbnail(videoSource);
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


  const renderCancelPreviewButton = () => (
    <View>
      <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
        <View style={[styles.closeCross, { transform: [{ rotate: "45deg" }] }]} />
        <View
          style={[styles.closeCross, { transform: [{ rotate: "-45deg" }] }]}
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8} style={{ top: 35, right: 15, position: "absolute" }} onPress={() => done()}>
        <Text style={{ fontSize: 18, color: "#49cbe9", fontWeight: "600" }}>Done</Text>
      </TouchableOpacity>
    </View>
  );

  const done = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setStartCamera(false);
    setVideoSource(null);
    setEdit(true)
    //uploadImage(source);


  }

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
  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
    setImages(images.splice(-1, 1))
    setVideoSource(null);
    setSource(null);
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
          [{ rotate: 0 }, { resize: { width: 800, height: 1050 } }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        setIsPreview(true);
        setSource(manipResult.uri);

      }
    }
  };


  const renderCaptureControl = () => (
    <View style={styles.control}>
      <TouchableHighlight
        activeOpacity={0.7}
        disabled={!isCameraReady}
        onLongPress={recordVideo}
        onPressOut={stopVideoRecording}
        onPress={takePicture}
        underlayColor={"#49cbe9"}
        onHideUnderlay={() => {
          setPress(false);
        }}
        onShowUnderlay={() => {
          setPress(true);
        }}
        style={[styles.capture, { backgroundColor: press ? "#49cbe9" : "white" }]}
      />
    </View>
  );


  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarVisible: false
    });
  }, [navigation])

  useEffect(() => {
    setStartCamera(true);
  }, [navigation])



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      await uploadImage(result.uri, result.type);
      setStartCamera(false);
      setVideoSource(null);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, alignItems: "center", justifyContent: "center" }} size="large" color="#49cbe9" />
  }

  const uploadImage = async (uri, type) => {
    setLoading(true);
    setEdit(false)
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child(`${type === 'image' ? 'images' : 'video'}/${Math.floor(100000 + Math.random() * 900000).toString()}`);

    await ref.put(blob)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL();
      })
      .then(downloadURL => {
        console.log(`Successfully uploaded file and got download link - ${downloadURL}`);
        setLoading(false);
        if (type === 'video') {
          setVideos(prevArray => [...prevArray, downloadURL]);
          generateThumbnail(downloadURL)
        }
        else {
          setImages(prevArray => [...prevArray, downloadURL])
        }
        return downloadURL;
      });
  }


  const onPostTweet = async () => {
    setImages([]);
    setTweet('')
    navigation.goBack();
  };


  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off');
    } else if (flashMode === 'off') {
      setFlashMode('on');
    } else {
      setFlashMode('auto');
    }
  };

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === 'granted') {
      // start the camera
      setStartCamera(true);
    } else {
      Alert.alert('Access denied');
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  const goBack = () => {
    setImages([]);
    setTweet('');
    navigation.goBack();
  }
  if (edit) {
    return (

      <ImageEditorComp uri={source} onPress={uploadImage} />
    )
  }


  return (
    <>
      {
        startCamera ? (
          <View style={{ flex: 1, width: '100%' }}>
            <Camera
              ref={cameraRef}
              ratio={"16:9"}
              style={styles.container}
              type={cameraType}
              flashMode={flashMode}
              onCameraReady={onCameraReady}
              onMountError={(error) => {
                console.log("cammera error", error);
              }}
            >
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
                    <TouchableOpacity onPress={__handleFlashMode} style={{ height: 25, width: 25 }}>
                      <Ionicons name={flashMode === 'on' ? "ios-flash" : "ios-flash-off"} size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={switchCamera} style={{ marginTop: 20, height: 25, width: 25 }}>
                      <Text style={{ fontSize: 20 }}>
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
                    onPress={() => setStartCamera(false)}
                  >
                    <Entypo name="cross" size={38} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity style={{
                    position: 'absolute',
                    left: '2%',
                    bottom: '5%',
                    borderRadius: 5,
                    height: captureSize - 30,
                    width: captureSize - 30,
                    marginHorizontal: 31,
                  }}
                    onPress={() => pickImage()}>
                    <Feather name="image" size={30} color="white" />
                  </TouchableOpacity>
                </View>

              ) : <View />}
            </Camera>
            <View style={styles.container}>
              {isVideoRecording && renderVideoRecordIndicator()}
              {videoSource && renderVideoPlayer()}
              {isPreview && renderCancelPreviewButton()}
              {!videoSource && !isPreview && renderCaptureControl()}
            </View>

          </View>
        ) : (
          //   <>
          // <ScrollView style={styles.container}>
          // 	<View style={styles.headerContainer}>
          // 		<TouchableOpacity onPress={() => goBack()}>
          // 			<AntDesign name="close" size={30} color="black" />
          // 		</TouchableOpacity>
          // 		<TouchableOpacity activeOpacity={0.7} style={styles.button} onPress={onPostTweet}>
          // 			<Text style={styles.buttonText}>Post</Text>
          // 		</TouchableOpacity>
          // 	</View>
          // 	<View style={styles.newTweetContainer}>
          // 		<Avatar
          // 			rounded
          // 			size="medium"
          // 			source={{
          // 				uri:
          // 					user?.photoURL ||
          // 					'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'
          // 			}}
          // 			containerStyle={{ marginTop: 30, marginRight: 10 }}
          // 		/>
          // 		<View style={styles.inputsContainer}>
          // 			<TextInput
          // 				value={tweet}
          // 				onChangeText={(value) => setTweet(value)}
          // 				multiline={true}
          // 				numberOfLines={3}
          // 				style={styles.tweetInput}
          // 				placeholder={"What's happening?"}
          // 			/>
          // 			<TouchableOpacity onPress={__startCamera}>
          // 				<Text style={styles.pickImage}>Pick a image</Text>
          // 			</TouchableOpacity>
          //       <View style={styles.images}>
          //         {images?.map((image, index) =>
          //         <TouchableOpacity key={index} onPress={() => filterImage(image)}>
          //           <Image key={index} source={{uri: image}} style={[styles.image, calculatedSize()]} />
          //         </TouchableOpacity>
          //         // <Text sty  le={{color: "white", fontSize:20, flexDirection: "row", alignItems: "center", justifyContent:"center"}}>{image}</Text>
          //         )}
          //       </View>
          //       <View style={styles.images}>
          //         {thumbnails?.map((uri, index) =>
          //         <TouchableOpacity key={index}>
          //           <Image key={index} source={{uri: uri}} style={[styles.image, calculatedSize()]} />
          //         </TouchableOpacity>
          //         // <Text sty  le={{color: "white", fontSize:20, flexDirection: "row", alignItems: "center", justifyContent:"center"}}>{image}</Text>
          //         )}
          //       </View>
          // 		</View>
          // 	</View>
          // </ScrollView>
          <AddPostComp
            user={user}
            goBack={goBack}
            onPostTweet={onPostTweet}
            __startCamera={__startCamera}
            thumbnails={thumbnails}
            images={images} />
          // </>
        )}
    </>
  );
};

export default AddPost;

const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    marginBottom: 10
  },
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

  images: {
    flexDirection: "row",
    flexWrap: "wrap",
    // flex: 1,

    // backgroundColor: "black",
    // flex:1

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
});


























// useEffect(() => {
//     getPermissionAsync();
// }, []);




// const __retakePicture = () => {
// 	setCapturedImage(null);
// 	setPreviewVisible(false);
// 	__startCamera();
// };

// const __switchCamera = () => {
//     if (cameraType === 'back') {
//       setCameraType('front')
//     } else {
//       setCameraType('back')
//     }
//   }
//   const __savePhoto = () => {}




// const getPermissionAsync = async () => {
// 	if (Platform.OS !== 'web') {
// 		const { status } = await Permissions.askAsync(Permissions.CAMERA);
// 		if (status !== 'granted') {
// 			alert('Sorry, we need camera roll permissions to make this work!');
// 		}
// 	}
// };






// const uploadTask = storage.ref(`images/${image.url}`).put(image);
// uploadTask.on(
//   "state_changed",
//   (snapshot) =>{

//   },
//   (error) =>{
//     console.log('error in uploading-->', error);
//     alert(error.message)
//   },
//   () =>{
//     storage.ref("images")
//     .child(image.url)
//     .getDownloadURL()
//     .then((url) => {
//       setNewImages(prevArray => [...prevArray, url]);
//     })
//   }
// )




{/* <View
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              flexDirection: 'row',
                              flex: 1,
                              width: '100%',
                              padding: 20,
                              justifyContent: 'space-between'
                            }}
                          >
                            <View
                              style={{
                                alignSelf: 'center',
                                flex: 1,
                                alignItems: 'center'
                              }}
                            >
                              <TouchableOpacity
                                onPress={__takePicture}
                                
                                style={{
                                  width: 70,
                                  height: 70,
                                  bottom: 0,
                                  borderRadius: 50,
                                  backgroundColor: '#fff'
                                }}
                              />
                            </View>
                          </View> */}


{/* <TouchableOpacity
                              onPress={__switchCamera}
                              style={{
                                marginTop: 20,
                                // borderRadius: '50%',
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
                            </TouchableOpacity> */}




{/* {previewVisible && capturedImage ? (
						<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
					) : (
                        <Camera
                        ratio={"16:9"}
                        autoFocus="on"
                            type={cameraType}
                            flashMode={flashMode}
                            style={{flex: 1}}
                            ref={(r) => {
                            camera = r
                            }}
                      >
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
                                // backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                                // borderRadius: '50%',
                                height: 25,
                                width: 25
                              }}
                            >
                              <Ionicons name={flashMode==='on' ? "ios-flash" : "ios-flash-off"} size={28} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={__switchCamera}
                              style={{
                                marginTop: 20,
                                // borderRadius: '50%',
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
                                // flexDirection: 'column',
                                // justifyContent: 'space-between'
                              }}
                              onPress={() => setStartCamera(false)}
                            
                          >
                            <Entypo name="cross" size={38} color="white" />
                          </TouchableOpacity>
                          <View
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              flexDirection: 'row',
                              flex: 1,
                              width: '100%',
                              padding: 20,
                              justifyContent: 'space-between'
                            }}
                          >
                            <View
                              style={{
                                alignSelf: 'center',
                                flex: 1,
                                alignItems: 'center'
                              }}
                            >
                              <TouchableOpacity
                                onPress={__takePicture}
                                
                                style={{
                                  width: 70,
                                  height: 70,
                                  bottom: 0,
                                  borderRadius: 50,
                                  backgroundColor: '#fff'
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      </Camera>
                    )} */}




	// const __takePicture = async () => {
	// 	if (!camera) return;
	// 	const photo = await camera.takePictureAsync();
    //     // console.log('ratio-->', camera.getSupportedRatioAsync());
    //     const ratio = await camera.getSupportedRatiosAsync();
    //     console.log('ratio-->',ratio);
	// 	setPreviewVisible(true);
	// 	setCapturedImage(photo);
    // };
    // console.log('flashmode-->',flashMode);
