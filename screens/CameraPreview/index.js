import React, {
    useRef,
    useState,
    useEffect
} from 'react';

import {
    ImageBackground,
    ScrollView,
    TouchableOpacity as TC,
    ActivityIndicator,
    View,
    Image,
    StyleSheet,
    Modal,
    Dimensions,
    Alert,
    TextInput,
    Text
} from 'react-native';

import {
    // TextInput,
    TouchableOpacity
} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

// ==== ↓↓↓ Firebase ↓↓↓ =====

import * as firebase from 'firebase';
import {db} from '../../firebase';

// ==== ↓↓↓ Expo Api ↓↓↓ ======

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
    MaterialCommunityIcons,
    MaterialIcons,
    Entypo,
    Fontisto,
    Foundation,
    Ionicons,
    FontAwesome,
    AntDesign
} from '@expo/vector-icons';
import {Audio} from 'expo-av';

//====== ↓↓↓ Components ↓↓↓ ======//

import RenderGif from '../../components/RenderGif';
import SelectOption from '../../components/SelectOptionComp';

//===== ↓↓↓ React Native Libraries ↓↓↓ ======

// import {} from 'ex'
import Draggable from 'react-native-draggable';
import ViewShot, {captureRef} from 'react-native-view-shot';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {ColorPicker} from 'react-native-color-picker';
import ExpoDraw from 'expo-draw'
import BottomSheet from 'reanimated-bottom-sheet';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CameraPreview = ({navigation, route}) => {
    const photo = route?.params?.photo;
    const [image, setImage] = useState(null);
    const sheetRef = React.useRef(null);
    const [loading, setLoading] = useState(false);
    const firebaseUser = firebase.auth().currentUser;
    const [text, setText] = useState('');
    const [emojiText, setEmojiText] = useState('');
    const [emoji, setEmoji] = useState(false);
    const [input, setInput] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [soundUri, setSoundUri] = useState('');
    const [backgroundModalVisible, setBackgroundModalVisible] = useState(false)
    const [downloadUri, setDownloadUri] = useState('');
    const [textColor, setTextColor] = useState("white");
    const [formModal, setFormModal] = useState(false);
    const [header, setHeader] = useState('');
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);
    const drawRef = React.useRef(null);

    const [draw, setDraw] = useState(false);
    const [strokes, setStrokes] = useState([]);

    const [images, setImages] = useState([]);
    const [questionPoll, setQuestionPoll] = useState(false);
    const [photoPoll, setPhotoPoll] = useState(false);

    const [txtQuestion, setTxtquestion] = useState("");
    const [txt1, setTxt1] = useState("");
    const [txt2, setTxt2] = useState("");
    const [txt3, setTxt3] = useState("");
    const [txt4, setTxt4] = useState("");

    const [pollData, setPollData] = useState([]);
    const [questionData, setQuestionData] = useState([]);

    const [swipeable, setSwipable] = useState([
        {
            id: 1,
            opened: false,
            right: undefined,
        },
        {
            id: 2,
            opened: false,
            right: undefined,
        },
        {
            id: 3,
            opened: false,
            right: undefined,
        },
        {
            id: 4,
            opened: false,
            right: undefined,
        },
    ]);

    const pollTrue = (index) => {
        switch (index) {
            case 1:
                let data1 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = true;

                    } else {
                        swip.right = false;
                    }
                    return swip;
                });
                setSwipable(data1);
                break;
            case 2:
                let data2 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = true;

                    } else {
                        swip.right = false;
                    }
                    return swip;
                });
                setSwipable(data2);
                break;
            case 3:
                let data3 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = true;

                    } else {
                        swip.right = false;
                    }
                    return swip;
                });
                setSwipable(data3);
                break;
            case 4:
                let data4 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = true;

                    } else {
                        swip.right = false;
                    }
                    return swip;
                });
                setSwipable(data4);
                break;
        }
    }
    const pollWrong = (index) => {
        switch (index) {
            case 1:
                let data1 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = false;
                    }
                    return swip;
                });
                setSwipable(data1);
                break;
            case 2:
                let data2 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = false;

                    }
                    return swip;
                });
                setSwipable(data2);
                break;
            case 3:
                let data3 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = false;

                    }
                    return swip;
                });
                setSwipable(data3);
                break;
            case 4:
                let data4 = swipeable.map(swip => {
                    if (swip.id === index) {
                        swip.right = false;

                    }
                    return swip;
                });
                setSwipable(data4);
                break;
        }
    }

    useEffect(() => {
        if (pollData.length === 2) {
            console.log(pollData);
            saveImage();
        }
    }, [pollData]);

    const removePhoto = (val) => {
        setImages(images.filter(oldValue => oldValue.uri !== val));
    }

    const pickImageSelectOption = async (num) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.9,
        });
        if (!result.cancelled) {
            setImages([
                ...images, {
                    idPhoto: num,
                    uri: result.uri,
                    height: result.height,
                    width: result.width,
                }
            ]);
            console.log(images);
        }
        console.log(images);
    };

    const sound = new Audio.Sound();

    async function playSound() {
        console.log('Loading Sound');
        await sound.loadAsync({
            uri: soundUri
        })
        sound.playAsync();
        uploadSound(soundUri);
    }

    const retakePicture = () => {
        navigation.goBack();
    };

    const handleSelect = (image) => {
        setImage(image);
    };

    const renderContent = () => {
        return (
            <>
                {!emoji ?
                    <View style={{backgroundColor: 'gray', padding: 16}}>
                        <View style={{
                            width: 30,
                            alignSelf: "center",
                            backgroundColor: "white",
                            margin: 10,
                            height: 7,
                            borderRadius: 10
                        }}/>
                        <RenderGif handleSelect={handleSelect}/>
                    </View>
                    : null
                }
            </>
        );
    };


    const renderHeader = () => {
        <View
            style={{
                width: '100%',
                height: 40,
                borderWidth: 2
            }}
        >

        </View>;
    };
    let captureViewRef = useRef();

    const saveImage = async () => {
        await sound.unloadAsync();
        console.log('unloading');
        setUploading(true)
        captureRef(captureViewRef, {
            format: 'jpg',
            quality: 0.9
        }).then((uri) => uploadImage(uri), (error) => console.log('Oops, snapshot failed', error));
    };

    const uploadSound = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child(`sounds/${Math.floor(100000 + Math.random() * 900000).toString()}`);

        await ref.put(blob)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).catch((err) => console.log('error in uploading audio->', err.message))
            .then(async (downloadURL) => {
                console.log(`Successfully uploaded sound and got download link - ${downloadURL}`);
                setDownloadUri(downloadURL);
                return downloadURL;
            }).catch((err) => console.log('error in downloading sound-->', err.message));
    }

    const uploadPollImage = async (uri, idPhoto) => {
        setLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        var data = firebase.storage().ref().child(`images/${Math.floor(100000 + Math.random() * 900000).toString()}`);

        await data.put(blob).then(snapshot => {
            return snapshot.ref.getDownloadURL();
        }).catch((err) => {
            console.log("Error in uploading poll images" + err);
        }).then(async (downloadURL) => {
            setLoading(false);
            setPollData(old => [...old, {
                idPhoto: idPhoto,
                url: downloadURL,
            }]);
            //console.log("Poll image uploaded: " + downloadURL);
            return downloadURL;
        }).catch((err) => {
            console.log('error in downloading pollImage-->', err.message);
        });
    }

    const uploadImage = async (uri) => {
        setLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = firebase.storage().ref().child(`images/${Math.floor(100000 + Math.random() * 900000).toString()}`);

        await ref.put(blob)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            }).catch((err) => console.log('error in uploading image/video->', err.message))
            .then(async (downloadURL) => {
                //console.log(`Successfully uploaded image and got download link - ${downloadURL}`);
                setLoading(false);
                await db.collection("users").doc(firebaseUser.uid).collection("stories").add({
                    image: downloadURL,
                    type: "image",
                    finish: 0,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    sound: downloadUri || '',
                    header: header,
                    description: desc,
                    typePoll: photoPoll ? "photoPoll" : "questionPoll",
                    storyContent: photoPoll ? pollData : questionData,
                    votes: []
                });
                setUploading(false);
                setFormModal(false);
                navigation.navigate('Story');
                return downloadURL;
            }).catch((err) => console.log('error in downloading image-->', err.message));
    }

    const handleIconPress = (text) => {
        if (text === "emoji") {
            setEmoji(!emoji);
        } else if (text === "text") {
            setInput(!input);
        }
    }
    const RenderText = () => {
        return (
            <Text style={{fontSize: 55}}>{emojiText}</Text>
        )
    }

    const renderInput = () => {
        return (
            <>
                {submit ?
                    <Text
                        style={{alignSelf: "center", fontSize: 39, fontWeight: "bold", color: textColor}}>{text}</Text>
                    :
                    <TextInput
                        placeholder="Enter text"
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={() => setSubmit(true)}
                        autoCapitalize="none"
                        placeholderTextColor="white"
                        style={{
                            width: width - 40,
                            padding: 10,
                            alignSelf: "center",
                            backgroundColor: "rgba(217, 217, 217,0.5)",
                            borderColor: "black",
                            borderWidth: 2,
                            fontSize: 19,
                            fontWeight: "bold",
                            color: "white"
                        }}
                    />
                }
            </>
        )
    }
    const handleColorChange = () => {
        setBackgroundModalVisible(true);
    }

    const handleAudioPress = async () => {
        let result = await DocumentPicker.getDocumentAsync({});
        setSoundUri(result.uri);
        playSound();
    }
    const textChangeColor = (color) => {
        setTextColor(color);
        setBackgroundModalVisible(false);
    }

    const handleSelectOption = () => {
        if (questionPoll == true) {
            setQuestionPoll(false);
        }
        setPhotoPoll(!photoPoll);
    }

    const handlePollQuestion = () => {
        if (photoPoll == true) {
            setPhotoPoll(false);
        }
        setQuestionPoll(!questionPoll);
    }

    const handlePen = () => {
        setDraw(!draw);
    }

    const clearDraw = () => {
        drawRef.current.clear();
    }

    return (
        <>
            <ScrollView
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%'
                }}
                horizontal={true}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={formModal}
                    style={{flexDirection: "column"}}
                    onRequestClose={() => {
                        setFormModal(!formModal)
                    }}
                >
                    <View style={{
                        height: "50%",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: 'white',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        position: "absolute",
                        bottom: 0
                    }}>
                        <TextInput placeholder='Set Header' textAlignVertical="center" multiline={false} style={{
                            height: 50,
                            width: '90%',
                            marginHorizontal: '5%',
                            borderColor: "#c4c4c4",
                            borderWidth: 1,
                            padding: 5,
                            borderRadius: 10,
                            fontSize: 16
                        }} value={header} onChangeText={(text) => setHeader(text)}/>
                        <TextInput placeholder='Set Description' textAlignVertical="center" multiline={false} style={{
                            height: 50,
                            marginTop: 10,
                            width: '90%',
                            marginHorizontal: '5%',
                            borderColor: "#c4c4c4",
                            borderWidth: 1,
                            padding: 5,
                            borderRadius: 10,
                            fontSize: 16
                        }} value={desc} onChangeText={(text) => setDesc(text)}/>
                        <TC disabled={uploading} onPress={saveImage} style={{
                            width: '90%',
                            marginHorizontal: '5%',
                            borderRadius: 10,
                            backgroundColor: "#0080FF",
                            height: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20
                        }}>
                            {uploading ? <ActivityIndicator size='small' color='white'/> :
                                <Text style={{color: "white", fontSize: 17, fontWeight: "bold"}}>Submit</Text>}
                        </TC>
                    </View>
                </Modal>
                <ViewShot ref={captureViewRef} options={{format: 'jpg', quality: 0.9}}>
                    <ImageBackground
                        source={{uri: photo}}
                        style={{
                            flex: 1,
                            height: height,
                            width: width,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center'
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                flexDirection: 'column'
                            }}
                        >
                            <Draggable
                                imageSource={{uri: image}}
                                renderSize={100}
                                x={100}
                                y={300}
                                onLongPress={() => console.log('long press')}
                                onShortPressRelease={() => console.log('press drag')}
                                onPressIn={() => console.log('in press')}
                                onPressOut={() => console.log('out press')}
                            />
                            <Draggable
                                renderSize={100}
                                x={5}
                                y={5}
                                onLongPress={() => console.log('long press')}
                                onShortPressRelease={() => console.log('press drag')}
                                onPressIn={() => console.log('in press')}
                                onPressOut={() => console.log('out press')}
                            >
                                <RenderText/>
                            </Draggable>
                            {input ? <Draggable
                                renderSize={100}
                                x={5}
                                y={100}
                                onLongPress={() => console.log('long press')}
                                onShortPressRelease={() => console.log('press drag')}
                                onPressIn={() => console.log('in press')}
                                onPressOut={() => console.log('out press')}
                            >
                                {renderInput()}
                            </Draggable> : null}
                        </View>
                        {emoji ?
                            <View style={{
                                backgroundColor: "white",
                                height: 450,
                                position: "absolute",
                                bottom: 0,
                                zIndex: 1
                            }}>
                                <EmojiSelector
                                    showSearchBar={false}
                                    showTabs={true}
                                    showHistory={true}
                                    showSectionTitles={true}
                                    category={Categories.all}
                                    onEmojiSelected={(emoji) => setEmojiText(emoji)}
                                />
                            </View>
                            : null
                        }
                        <View style={{
                            height: Dimensions.get('screen').height,
                            width: Dimensions.get('screen').width,
                            position: "absolute",
                            backgroundColor: 'transparent',
                            zIndex: 2
                        }}>
                            <ExpoDraw
                                strokes={strokes}
                                ref={drawRef}
                                containerStyle={{
                                    backgroundColor: 'rgba(0,0,0,0.01)',
                                    height: Dimensions.get('screen').height,
                                    width: Dimensions.get('screen').width
                                }}
                                color={textColor}
                                strokeWidth={4}
                                enabled={true}
                                onChangeStrokes={(strokes) => setStrokes(strokes)}
                            />
                        </View>
                    </ImageBackground>
                </ViewShot>
                <View style={[styles.aside, questionPoll || photoPoll ? {backgroundColor: 'rgba(0,0,0,0.8)'} : {}]}>
                    <TouchableOpacity
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => sheetRef.current.snapTo(0)}
                    >
                        <MaterialCommunityIcons name="gif" size={40} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleIconPress("emoji")}
                    >
                        <Entypo name="emoji-happy" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleIconPress("text")}
                    >
                        <MaterialCommunityIcons name="format-text" size={29} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleAudioPress()}
                    >
                        <MaterialIcons name="audiotrack" size={24} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleColorChange()}
                    >
                        <Foundation name="text-color" size={29} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.icon}
                        onPress={() => handleSelectOption()}
                    >
                        <MaterialCommunityIcons name="comment-question" size={29} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePollQuestion()}>
                        <Fontisto name="question" size={29} color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePen()}>
                        <FontAwesome name="pencil" size={29} color="white"/>
                    </TouchableOpacity>
                    {draw && <TouchableOpacity onPress={() => clearDraw()}>
                        <FontAwesome name="trash" size={29} color="white"/>
                    </TouchableOpacity>}
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={backgroundModalVisible}
                    style={{flexDirection: "column"}}
                    onRequestClose={() => {
                        setBackgroundModalVisible(!backgroundModalVisible);
                    }}
                >
                    <View style={stylesQuestionPoll.container}>
                        <View style={stylesQuestionPoll.header}>
                            <Text style={[stylesQuestionPoll.input, {
                                textAlign: 'center',
                                backgroundColor: 'transparent',
                                fontSize: 16,
                                color: 'white',
                                fontWeight: 'bold',
                                alignSelf: 'center'
                            }]}>{'Colour Picker'}</Text>
                        </View>
                        <View style={[stylesQuestionPoll.content, {
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: 70,
                            paddingHorizontal: 20
                        }]}>
                            <TC style={{backgroundColor: '#fc0d1b', height: 20, width: 20}} onPress={() => {
                                textChangeColor('#fc0d1b')
                            }}>
                            </TC>
                            <TC style={{backgroundColor: '#7f0e7f', height: 20, width: 20}} onPress={() => {
                                textChangeColor('#7f0e7f')
                            }}>
                            </TC>
                            <TC style={{backgroundColor: '#0f7f12', height: 20, width: 20}} onPress={() => {
                                textChangeColor('#0f7f12')
                            }}>
                            </TC>
                            <TC style={{backgroundColor: '#fffd38', height: 20, width: 20}} onPress={() => {
                                textChangeColor('#fffd38')
                            }}>
                            </TC>
                            <TC style={{backgroundColor: '#0b24fb', height: 20, width: 20}} onPress={() => {
                                textChangeColor('#0b24fb')
                            }}>
                            </TC>
                        </View>
                    </View>
                    {/*<ColorPicker onColorSelected={(color) => textChangeColor(color)} style={{ flex: 1, backgroundColor: "white" }} />*/}
                </Modal>
                {!emoji ?
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            position: 'absolute',
                            bottom: 10,
                            width: '100%'
                        }}
                    >
                        <TouchableOpacity
                            onPress={retakePicture}
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
                                Re-take
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {

                                setQuestionData([
                                    `${txtQuestion}`,
                                    {
                                        id: 1,
                                        right: swipeable.find(val => val.id == 1).right,
                                        text: `${txt1}`
                                    },
                                    {
                                        id: 2,
                                        right: swipeable.find(val => val.id == 2).right,
                                        text: `${txt2}`
                                    },
                                    {
                                        id: 3,
                                        right: swipeable.find(val => val.id == 3).right,
                                        text: `${txt3}`
                                    },
                                    {
                                        id: 4,
                                        right: swipeable.find(val => val.id == 4).right,
                                        text: `${txt4}`
                                    }
                                ]);

                                if (photoPoll) {
                                    Promise.all(
                                        images.map(val => {
                                            uploadPollImage(val.uri, val.idPhoto);
                                        })
                                    ).then(() => {
                                        setUploading(true);
                                    });
                                } else if (questionPoll) {
                                    if (swipeable[0].right == false && swipeable[1].right == false && swipeable[2].right == false && swipeable[3].right == false) {
                                        Alert.alert("Info", "At least one awnser must be true");
                                    } else if (swipeable[0].right == undefined && swipeable[1].right == undefined && swipeable[2].right == undefined && swipeable[3].right == undefined) {
                                        Alert.alert("Info", "At least one awnser must be true");
                                    } else {
                                        console.log(questionData);
                                        saveImage();
                                    }
                                } else {
                                    saveImage();
                                }
                            }}
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
                                Save photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                    : null}

                {
                    photoPoll ? <SelectOption content={{id: 1}} photo={[{
                        idPhoto: 1,
                        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bmhhJTIwdHJhbmclMjBiZWFjaHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
                    },
                        {
                            idPhoto: 2,
                            url: 'https://www.travelanddestinations.com/wp-content/uploads/2019/11/Beach-Destinations-in-Asia.jpg'
                        }
                    ]} vote={true} voted={true} childrenOne={(
                        <View style={styles.card}>
                            {
                                (!images.find(element => element.idPhoto === 1)) ?
                                    <TC
                                        onPress={() => {
                                            pickImageSelectOption(1)
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="add-circle" size={50} color="#3a3b3c"/>
                                    </TC>
                                    :
                                    <>
                                        <View style={{backgroundColor: "rgba(0, 0, 0, 0.5)", opacity: 1}}/>
                                        <Image source={{uri: images.find(element => element.idPhoto === 1)?.uri}}
                                               style={{width: "100%", height: "100%", borderRadius: 8}}
                                               blurRadius={0.5}/>
                                        <TC onPress={() => {
                                            removePhoto(images.find(element => element.idPhoto === 1)?.uri)
                                        }} style={styles.trashButton}>
                                            <FontAwesome name="trash-o" size={40} color="white"/>
                                        </TC>
                                    </>
                            }
                        </View>
                    )} childrenTwo={(
                        <View style={styles.card}>
                            {
                                (!images.find(element => element.idPhoto === 2)) ?
                                    <TC
                                        onPress={() => {
                                            pickImageSelectOption(2)
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="add-circle" size={50} color="#3a3b3c"/>
                                    </TC>
                                    :
                                    <>
                                        <Image source={{uri: images.find(element => element.idPhoto === 2)?.uri}}
                                               style={{width: "100%", height: "100%", borderRadius: 8}}
                                               blurRadius={0.5}/>
                                        <TC onPress={() => {
                                            removePhoto(images.find(element => element.idPhoto === 2)?.uri)
                                        }} style={styles.trashButton}>
                                            <FontAwesome name="trash-o" size={40} color="white"/>
                                        </TC>
                                    </>
                            }
                        </View>
                    )}/> : null
                }
                {
                    questionPoll ?
                        <View style={stylesQuestionPoll.container}>
                            <Image source={require('../../assets/picker.png')}
                                   style={{height: 20, width: 20, position: 'absolute', left: 10, zIndex: 9, top: 5}}/>
                            <View style={stylesQuestionPoll.header}>
                                <TextInput placeholder="Type Question" value={txtQuestion} onChangeText={setTxtquestion}
                                           placeholderTextColor="white" style={[stylesQuestionPoll.input, {
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    fontSize: 16,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    alignSelf: 'center'
                                }]}/>
                            </View>
                            <View style={stylesQuestionPoll.content}>
                                <Swipeable containerStyle={stylesQuestionPoll.swipeable} overshootLeft={false}
                                           renderLeftActions={() => (
                                               <>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonTrue}
                                                                     onPress={() => {
                                                                         pollTrue(1);
                                                                     }}>
                                                       <AntDesign name="check" size={20} color="white"/>
                                                   </TouchableOpacity>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonFalse}
                                                                     onPress={() => {
                                                                         pollWrong(1);
                                                                     }}>
                                                       <AntDesign name="close" size={20} color="white"/>
                                                   </TouchableOpacity>
                                               </>
                                           )} onSwipeableOpen={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 1) {
                                            swip.opened = true;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }} onSwipeableClose={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 1) {
                                            swip.opened = false;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {/*<MaterialIcons name={swipeable.find(val => val.id === 1).opened ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={22} color="white" />*/}
                                        <Text>{"1."}</Text>
                                        <TextInput
                                            value={txt1}
                                            onChangeText={setTxt1}
                                            style={[stylesQuestionPoll.input]} //swipeable.find(item => item.id === 1).right ? { borderLeftWidth: 5, borderLeftColor: 'green' } : { borderLeftWidth: 5, borderLeftColor: 'red' }
                                            placeholder="Option 1"
                                            placeholderTextColor="gray"
                                        />
                                    </View>
                                </Swipeable>
                                <Swipeable containerStyle={stylesQuestionPoll.swipeable} overshootLeft={false}
                                           renderLeftActions={() => (
                                               <>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonTrue}
                                                                     onPress={() => {
                                                                         pollTrue(2);
                                                                     }}>
                                                       <AntDesign name="check" size={20} color="white"/>
                                                   </TouchableOpacity>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonFalse}
                                                                     onPress={() => {
                                                                         pollWrong(2);
                                                                     }}>
                                                       <AntDesign name="close" size={20} color="white"/>
                                                   </TouchableOpacity>
                                               </>
                                           )} onSwipeableOpen={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 2) {
                                            swip.opened = true;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }} onSwipeableClose={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 2) {
                                            swip.opened = false;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text>{"2."}</Text>
                                        {/*<MaterialIcons name={swipeable.find(val => val.id === 2).opened ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={22} color="white" />*/}
                                        <TextInput
                                            value={txt2}
                                            onChangeText={setTxt2}
                                            style={[stylesQuestionPoll.input]} //, swipeable.find(item => item.id === 2).right ? { borderLeftWidth: 5, borderLeftColor: 'green' } : { borderLeftWidth: 5, borderLeftColor: 'red' }
                                            placeholder="Option 2"
                                            placeholderTextColor="gray"
                                        />
                                    </View>
                                </Swipeable>
                                <Swipeable containerStyle={stylesQuestionPoll.swipeable} overshootLeft={false}
                                           renderLeftActions={() => (
                                               <>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonTrue}
                                                                     onPress={() => {
                                                                         pollTrue(3);
                                                                     }}>
                                                       <AntDesign name="check" size={20} color="white"/>
                                                   </TouchableOpacity>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonFalse}
                                                                     onPress={() => {
                                                                         pollWrong(3);
                                                                     }}>
                                                       <AntDesign name="close" size={20} color="white"/>
                                                   </TouchableOpacity>
                                               </>
                                           )} onSwipeableOpen={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 3) {
                                            swip.opened = true;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }} onSwipeableClose={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 3) {
                                            swip.opened = false;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {/*<MaterialIcons name={swipeable.find(val => val.id === 3).opened ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={22} color="white" />*/}
                                        <Text>{"3."}</Text>
                                        <TextInput
                                            value={txt3}
                                            onChangeText={setTxt3}
                                            style={[stylesQuestionPoll.input]}//, swipeable.find(item => item.id === 3).right ? { borderLeftWidth: 5, borderLeftColor: 'green' } : { borderLeftWidth: 5, borderLeftColor: 'red' }
                                            placeholder="Option 3"
                                            placeholderTextColor="gray"
                                        />
                                    </View>
                                </Swipeable>
                                <Swipeable containerStyle={stylesQuestionPoll.swipeable} overshootLeft={false}
                                           renderLeftActions={() => (
                                               <>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonTrue}
                                                                     onPress={() => {
                                                                         pollTrue(4);
                                                                     }}>
                                                       <AntDesign name="check" size={20} color="white"/>
                                                   </TouchableOpacity>
                                                   <TouchableOpacity style={stylesQuestionPoll.buttonFalse}
                                                                     onPress={() => {
                                                                         pollWrong(4);
                                                                     }}>
                                                       <AntDesign name="close" size={20} color="white"/>
                                                   </TouchableOpacity>
                                               </>
                                           )} onSwipeableOpen={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 4) {
                                            swip.opened = true;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }} onSwipeableClose={() => {
                                    let open = swipeable.map(swip => {
                                        if (swip.id === 4) {
                                            swip.opened = false;
                                        }
                                        return swip;

                                    });
                                    setSwipable(open);
                                }}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        {/*<MaterialIcons name={swipeable.find(val => val.id === 4).opened ? "keyboard-arrow-left" : "keyboard-arrow-right"} size={22} color="white" />*/}
                                        <Text>{"4."}</Text>
                                        <TextInput
                                            value={txt4}
                                            onChangeText={setTxt4}
                                            style={[stylesQuestionPoll.input]}//, swipeable.find(item => item.id === 4).right ? { borderLeftWidth: 5, borderLeftColor: 'green' } : { borderLeftWidth: 5, borderLeftColor: 'red' }
                                            placeholder="Option 4"
                                            placeholderTextColor="gray"
                                        />
                                    </View>
                                </Swipeable>
                            </View>
                        </View>
                        :
                        null
                }
                <BottomSheet
                    ref={sheetRef}
                    snapPoints={[450, 300, 0]}
                    renderHeader={renderHeader}
                    borderRadius={10}
                    initialSnap={2}
                    renderContent={renderContent}
                />
            </ScrollView>
        </>
    );
};

export default CameraPreview;

const styles = StyleSheet.create({
    icon: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    aside: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        right: 20,
        top: 65,
        alignItems: "center",
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        width: 50,
        paddingBottom: 15
    },
    card: {
        height: "90%",
        width: "48%",
        marginRight: 10,
        backgroundColor: 'gray',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 8
    },
    trashButton: {
        position: 'absolute',
        bottom: 55,
        left: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 35,
        width: 70,
        height: 70
    }
});
const stylesQuestionPoll = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5,
        alignSelf: 'center',
        height: 250,
        width: "80%",
        borderRadius: 12,
        backgroundColor: 'transparent',
        //borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        top: '33%',
        left: '10%',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: 'black',
        width: '100%',
        height: 60,
        borderTopStartRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1
    },
    content: {
        flexDirection: 'column',
        height: 200,
        width: "100%",
        backgroundColor: 'white',
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 2,
        opacity: 1
    },
    description: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    card: {
        height: "90%",
        width: "48%",
        marginRight: 10,
        backgroundColor: 'gray',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 8
    },
    input: {
        backgroundColor: '#FFF',
        width: '90%',
        height: 40,
        color: '#000',
        fontSize: 14,
        marginLeft: 5,
        paddingHorizontal: 10,
    },
    swipeable: {
        backgroundColor: '#FFF',
        width: '90%',
        height: 40,
        marginBottom: 8,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 1
    },
    buttonTrue: {
        width: 35,
        height: 35,
        backgroundColor: 'green',
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
    },
    buttonFalse: {
        width: 35,
        height: 35,
        backgroundColor: 'red',
        borderRadius: 8,
        alignSelf: 'center',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2
    }
});
