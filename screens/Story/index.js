import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  LogBox,
  Modal,
  BackHandler,
  Button,
} from 'react-native';

// ==== ↓↓↓ Firebase ↓↓↓ =====

import * as firebase from 'firebase';
import { db } from '../../firebase';

// ==== ↓↓↓ Expo Api ↓↓↓ ======

import Constants from 'expo-constants';
import { Audio, Video } from 'expo-av';
import { Ionicons, AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Sound } from 'expo-av/build/Audio';

//====== ↓↓↓ Components ↓↓↓ =====

import AddPhoto from '../../components/AddPhoto';
import SelectOption from '../../components/SelectOptionComp';
import PollQuestion from '../../components/PollQuestion';

const screenRatio = height / width;
const { width, height } = Dimensions.get('window');

export default function Story({ navigation, route }) {

  LogBox.ignoreLogs(["evaluating 'doc.data().votes'"]);

  const user = firebase.auth().currentUser;
  const [add, setAdd] = useState(false);
  const [soundUri, setSoundUri] = useState('');
  // const [sound, setSound] = useState(null);
  const [sounds, setSounds] = useState([]);

  const [content, setContent] = useState(
    [{
      content:
        'https://firebasestorage.googleapis.com/v0/b/instagram-clone-f3106.appspot.com/o/9.jpg?alt=media&token=0a382e94-6f3f-4d4e-932f-e3c3f085ebc3',
      type: 'image',
      finish: 0,
      // sound: ''
    }]
  );

  //====== ↓↓↓ Animation consts ↓↓↓ ===== //

  // for get the duration
  const [end, setEnd] = useState(0);
  // current is for get the current content is now playing
  const [current, setCurrent] = useState(0);
  // if load true then start the animation of the bars at the top
  const [load, setLoad] = useState(false);
  // progress is the animation value of the bars content playing the current state
  const progress = useRef(new Animated.Value(0)).current;
  const [playing, setPlaying] = useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [navigation]);
  const sound = new Audio.Sound();

  useEffect(() => {
    if (route?.params) {
      //console.log(route);
      //setContent(route?.params?.content)
    }
  }, [route, setContent]);

  const loadVotes = async (id) => {
    const voteValues = db
      .collection('users')
      .doc(user?.uid)
      .collection('stories').doc(`${id}`);

    var doc = await voteValues.get();
    if (!doc.exists) {
      console.log('nada');
    }

    let docData = doc.data().votes;
    let check = !!docData.find(val => val.userId == user.uid).userId;

    return check;
  }

  useEffect(() => {
    if (user) {
      const unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .collection('stories')
        .onSnapshot((snapshot) =>
          setContent(
            snapshot?.docs?.map((doc) => ({
              id: doc.id,
              content: doc.data().image,
              poll: doc.data().storyContent || null,
              type: doc.data().type,
              header: doc.data().header,
              finish: doc.data().finish,
              typePoll: doc.data().typePoll
            }))
          )
        );
      return unsubscribe;
    }
  }, []);

  useEffect(() => {

  }, [current]);

  useEffect(() => {
    const stop = async () => {
      await sound.unloadAsync();
      console.log('stopping in useffect');
    }
    return stop;
  }, [current]);

  useEffect(() => {
    if (add) {

      sound.unloadAsync();
    }
  }, [add]);


  const resetAudioClips = async () => {
    await sound.unloadAsync();
  }

  const checkPlaying = async () => {

    let soundStatus = await sound.getStatusAsync();
    // let playing = await sound.


    if (soundStatus.playing === true) {
      console.log('plying');
      setPlaying(true);

      // await sound.stopAsync()
      // await sound.unloadAsync();
    }

  }

  const loadSound = async (uri) => {
    await sound.unloadAsync();
    await sound.loadAsync(
      { uri: uri }
    );
    sound.playAsync();
    console.log('playing');
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false
    }).start(({ finished }) => {
      if (finished) {
        sound.unloadAsync();
        console.log('unloading');

        next();
      } else if (add) {
        sound.unloadAsync();
      }
    });
    // setTimeout(() => {
    //   // this.state.audioController.audioFemale.playAsync();
    // }, 10000);

  }

  const stop = async () => {
    await sound.unloadAsync();
  }

  // start() is for starting the animation bars at the top
  async function start(n) {
    // checking if the content type is video or not
    if (content[current].type == 'video') {
      // type video
      if (load) {
        Animated.timing(progress, {
          toValue: 1,
          duration: n,
          useNativeDriver: false
        }).start(({ finished }) => {
          if (finished) {
            next();
          }
        });
      }
    } else {
      if (content[current]?.sound?.length > 0) {
        console.log('setting sound uri', content[current].sound);
        setSoundUri(content[current].sound);
        loadSound(content[current].sound);
      } else {
        Animated.timing(progress, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false
        }).start(({ finished }) => {
          if (finished) {
            stop();
            next();
          }
        });
      }
    }
  }

  // handle playing the animation
  function play() {
    start(end);
  }

  // next() is for changing the content of the current content to +1
  async function next() {
    // check if the next content is not empty
    if (current !== content.length - 1) {
      await sound.unloadAsync();
      console.log('unloading in next');
      let data = [...content];
      data[current].finish = 1;
      setContent(data);

      setCurrent(current + 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      await sound.unloadAsync();
      // the next content is empty
      close();
    }
  }

  // previous() is for changing the content of the current content to -1
  async function previous() {
    // checking if the previous content is not empty
    if (current - 1 >= 0) {
      await sound.unloadAsync();
      console.log('unloading in previous');
      let data = [...content];
      data[current].finish = 0;
      setContent(data);
      setCurrent(current - 1);
      progress.setValue(0);
      setLoad(false);
    } else {
      await sound.unloadAsync();
      // the previous content is empty
      close();
    }
  }

  // closing the modal set the animation progress to 0
  async function close() {
    progress.setValue(0);
    // stopAudio();
    // stop();
    sound.setOnPlaybackStatusUpdate((status) => {
      console.log('isPlaying--->', status);
      if (!status.isPlaying) return;
      sound.unloadAsync();
    });
    // await sound.unloadAsync();
    console.log('unloading on closing');
    setLoad(false);
    setCurrent(0);
    navigation.navigate('Home');
  }

  return (
    <>
      {
        (content.length <= 0 || add) ? <AddPhoto /> :

          <View style={styles.containerModal}>
            <StatusBar backgroundColor="black" barStyle="light-content" />
            <View style={{ paddingTop: Constants.statusBarHeight }} />
            <View style={styles.backgroundContainer}>
              {/* check the content type is video or an image */}
              {content[current].type == 'video' ? (
                <Video
                  source={{
                    uri: content[current].content,
                  }}
                  rate={1.0}
                  volume={1.0}
                  resizeMode="cover"
                  shouldPlay={true}
                  positionMillis={0}
                  onReadyForDisplay={play()}
                  onPlaybackStatusUpdate={AVPlaybackStatus => {
                    // console.log(AVPlaybackStatus);
                    setLoad(AVPlaybackStatus.isLoaded);
                    setEnd(AVPlaybackStatus.durationMillis);
                  }}
                  style={{ height: height, width: width }}
                />
              ) : (
                <>
                  {
                    (content[current].typePoll == "photoPoll") ?
                      <SelectOption
                        vote={true}
                        voted={loadVotes(content[current].id)}
                        userId={user.uid}
                        content={content[current]}
                        photo={content[current].poll} />
                      :
                      null
                  }
                  {
                    (content[current].typePoll == "questionPoll") ?
                      <PollQuestion title={content[current]?.poll[0]} data={content[current]?.poll}/>
                    : 
                    null
                  }
                  <Image
                    onLoadEnd={() => {
                      progress.setValue(0);
                      play();
                    }}
                    source={{
                      uri: content[current].content
                    }}
                    style={{ width: width, height: height, resizeMode: 'cover' }}
                  />
                </>
              )}
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
              }}>
              <LinearGradient
                colors={['rgba(0,0,0,1)', 'transparent']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 100,
                }}
              />
              {/* ANIMATION BARS */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  paddingHorizontal: 10,
                }}>
                {content.map((index, key) => {
                  return (
                    // THE BACKGROUND
                    <View
                      key={key}
                      style={{
                        height: 2,
                        flex: 1,
                        flexDirection: 'row',
                        backgroundColor: 'rgba(117, 117, 117, 0.5)',
                        marginHorizontal: 2,
                      }}>
                      {/* THE ANIMATION OF THE BAR*/}
                      <Animated.View
                        style={{
                          flex: current == key ? progress : content[key].finish,
                          height: 2,
                          backgroundColor: 'rgba(255, 255, 255, 1)',
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {/* END OF ANIMATION BARS */}

              <View
                style={{
                  height: 50,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 15,
                }}>
                {/* THE AVATAR AND USERNAME  */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{ height: 30, width: 30, borderRadius: 25 }}
                    source={{
                      uri: user?.photoURL

                    }}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'white',
                      paddingLeft: 10,
                    }}>
                    {user?.displayName}
                  </Text>
                </View>
                {/* END OF THE AVATAR AND USERNAME */}
                {/* THE CLOSE BUTTON */}
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      close();
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        paddingHorizontal: 15,
                      }}>
                      <Ionicons name="ios-close" size={28} color="white" />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setAdd(true)}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 50,
                        paddingHorizontal: 15,
                      }}>
                      <FontAwesome name="plus-square-o" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
                {/* END OF CLOSE BUTTON */}
              </View>
              {/* HERE IS THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
              <View style={{ flex: 1, paddingTop: 100, flexDirection: 'row' }}>
                <TouchableWithoutFeedback onPress={() => previous()}>
                  <View style={{ flex: 1 }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => next()}>
                  <View style={{ flex: 1, paddingTop: 100 }} />
                </TouchableWithoutFeedback>
              </View>
              {/* END OF THE HANDLE FOR PREVIOUS AND NEXT PRESS */}
            </View>
          </View>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight + 50
  },
  containerModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});