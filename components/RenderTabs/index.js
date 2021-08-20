import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  TouchableOpacity,
  StatusBar,
  Image
} from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { Octicons } from '@expo/vector-icons';
import HeaderComp from '../../components/HeaderComp';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import ProfileComp from '../ProfileComp';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { useTheme } from '@react-navigation/native'
import { selectUser } from '../../redux/features/userSlice';
import { color } from 'react-native-elements/dist/helpers';
let h = null;
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const TabBarHeight = 48;
const HeaderHeight = windowHeight - 290;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const RenderTabs = ({ posts, mentionedPosts, ownProfile, u, logout, bookmarkedPosts, compliments, likes, stories, currentUser }) => {

  const navigation = useNavigation();
  const [h, setH] = useState(HeaderHeight);

  const user = useSelector(selectUser);
  const tab1ItemSize = (windowWidth - 30) / 2;
  const tab2ItemSize = (windowWidth - 40) / 3;

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'tab1', title: 'Posts' },
    { key: 'tab2', title: 'Mentions' },
    { key: 'tab3', title: 'Bookmarked' },
    { key: 'tab4', title: 'Compliments' },
    { key: 'tab5', title: 'Likes' },
    { key: 'tab6', title: 'Stories' }
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const { colors } = useTheme()

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },

      onPanResponderRelease: (evt, gestureState) => {
        syncScrollOffset();
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        headerScrollY.setValue(scrollY._value);
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        listRefArr.current.forEach((item) => {
          if (item.key !== routes[_tabIndex.current].key) {
            return;
          }
          if (item.value) {
            item.value.scrollToOffset({
              offset: -gestureState.dy + headerScrollStart.current,
              animated: false,
            });
          }
        });
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    }),
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    }),
  ).current;

  /**
   * effect
   */
  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const handlePress = (posts, index) => {
    navigation.navigate("Search", { screen: "PostList", params: { userId: user?.uid, posts: posts, index: index } })
  }

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = () => {
    syncScrollOffset();
  };


  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, h],
      outputRange: [0, -h],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={[styles.header, { transform: [{ translateY: y }], height: h }]}>
        {!ownProfile ? <HeaderComp user={user} /> : <ProfileComp setH={setH} u={u} logout={logout} />}
      </Animated.View>
    );
  };

  const handleViewPost = (userId, postId) => {
    navigation.navigate("Notification", { screen: "ViewPost", params: { userId: userId, postId: postId } })
  }
  const rednerTab1Item = ({ item, index }) => {
    return (
      <View>
        {item?.data?.image?.length > 0 ? (
          <TouchableOpacity onPress={() => handlePress(posts, index)} activeOpacity={0.7} style={{ marginLeft: index % 2 === 0 ? 0 : 10, marginBottom: 10, marginRight: 7 }}>
            <Image
              source={{ uri: item?.data?.image?.[0] }}
              style={{ height: tab1ItemSize, width: tab1ItemSize, borderRadius: 16 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };



  const rednerTab2Item = ({ item, index }) => {
    return (
      <View>
        {item?.data?.image?.length > 0 ? (
          <TouchableOpacity onPress={() => handleViewPost(item?.userId, item?.id)} activeOpacity={0.7} style={{ marginLeft: index % 2 === 0 ? 0 : 10, marginBottom: 10, marginRight: 7 }}>
            <Image
              source={{ uri: item?.data?.image?.[0] }}
              style={{ height: tab1ItemSize, width: tab1ItemSize, borderRadius: 16 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderTab3Item = ({ item, index }) => {
    return (
      <View>
        {item?.data?.image?.length > 0 ? (
          <TouchableOpacity onPress={() => handleViewPost(item?.userId, item?.id)} activeOpacity={0.7} style={{ marginLeft: index % 2 === 0 ? 0 : 10, marginBottom: 10, marginRight: 7 }}>
            <Image
              source={{ uri: item?.data?.image?.[0] }}
              style={{ height: tab1ItemSize, width: tab1ItemSize, borderRadius: 16 }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  const renderTab4Item = ({ item, index }) => {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.7} style={{ marginLeft: index % 2 === 0 ? 0 : 10, marginBottom: 10, marginRight: 7, flexDirection: "column", alignItems: "center" }}>
          <Text style={{ alignSelf: "flex-start", fontWeight: "bold", fontSize: 18 }}>{item?.data?.sentBy?.displayName} :</Text>
          <Image
            source={{ uri: item?.data?.emoji?.url }}
            style={{ height: tab1ItemSize, width: tab1ItemSize, borderRadius: 16 }}
          />
          <Text style={{ fontSize: 18 }}>{item?.data?.message}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  console.log(user)

  const renderTab5Item = ({ item, index }) => {
    return (
      <View style={{ height: 130, width: "100%", borderBottomColor: "grey", borderBottomWidth: 2 }}>
        <View style={{ flexDirection: "row", width: '92%', marginHorizontal: '4%', justifyContent: "space-between", }}>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Image source={{ uri: item?.data.hasOwnProperty('image') ? item?.data?.image[0] : item.img }} style={{ height: 50, width: 50, borderRadius: 25 }} />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{user?.displayName}</Text>
              <Text style={{ marginTop: 5 }}>{item?.data?.timestamp === "Invalid date" ? "Invalid date" : "Invalid date"}</Text>
            </View>
          </View>
          <MaterialCommunityIcons style={{ marginRight: -25 }} name="dots-vertical" size={35} color="black" />
        </View>
        <View>
          <Text numberOfLines={2} style={{ color: 'black', fontSize: 17, marginTop: 5, marginHorizontal: '4%' }}>{item?.data?.text}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: '4%', position: "absolute", bottom: 5 }}>
          <MaterialCommunityIcons name="cards-heart" size={25} color="red" />
          <Text style={{ fontSize: 17, }}>{item?.likeCount}</Text>
        </View>
      </View>
    )
  }

  const renderTab6Item = ({ item, index }) => {
    if (item.type == 'button') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('AddPersonalStory', { currentUser })} style={{ width: "33%", height: 70, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <Ionicons name='md-add-circle-outline' size={80} color='#FFCC80' />
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ProfileStory', { data: item?.data })} style={{ width: "33%", height: 70, alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Image source={{ uri: item?.data?.posts[0]?.image }} style={{ height: 70, width: 70, borderRadius: 35 }} />
      </TouchableOpacity>
    )
  }

  const If = ({ condition, children }) => {
    if (condition) {
      return children;
    } else {
      return (
        <View>
        </View>
      )
    }
  };


  const renderLabel = ({ route, focused }) => {
    return (
      <>
        <If condition={route.title === "Posts"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <MaterialCommunityIcons name="collage" size={24} color="black" />
          </Text>
        </If>
        <If condition={route.title === "Mentions"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <Octicons name="mention" size={24} color="black" />
          </Text>
        </If>
        <If condition={route.title === "Bookmarked"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <Feather name="bookmark" size={24} color="black" />
          </Text>
        </If>
        <If condition={route.title === "Compliments"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <MaterialCommunityIcons name="human-greeting" size={24} color="black" />
          </Text>
        </If>
        <If condition={route.title === "Likes"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <MaterialCommunityIcons name="cards-heart" size={24} color="black" />
          </Text>
        </If>
        <If condition={route.title === "Stories"}>
          <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
            <MaterialCommunityIcons name="camera" size={24} color="black" />
          </Text>
        </If>
      </>
    );
  };

  {/* {route.title}{' '}
    {route.title === 'Posts' ? <MaterialCommunityIcons name="collage" size={24} color="black" /> : <Octicons name="mention" size={24} color="black" />} */}

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let header;

    switch (route.key) {
      case 'tab1':
        numCols = 2;
        data = posts;
        renderItem = rednerTab1Item;
        header = <View style={{ height: 10 }} />;
        break;
      case 'tab2':
        numCols = 3;
        data = mentionedPosts;
        renderItem = rednerTab2Item;
        header = <View style={{ height: 10 }} />;
        break;
      case 'tab3':
        numCols = 3;
        data = bookmarkedPosts;
        renderItem = renderTab3Item;
        header = <View style={{ height: 10 }} />;
        break;
      case 'tab4':
        numCols = 3;
        data = compliments;
        renderItem = renderTab4Item;
        header = <View style={{ height: 10 }} />;
        break;
      case 'tab5':
        numCols = 1;
        data = likes;
        renderItem = renderTab5Item;
        header = <View style={{ height: 10 }} />;
        break;
      case 'tab6':
        numCols = 3;
        data = [{ type: "button" }, ...stories]
        renderItem = renderTab6Item;
        header = <View style={{ height: 10 }} />;
        break;
      default:
        return null;
    }
    return (
      <Animated.FlatList
        // scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: scrollY } },
                },
              ],
              { useNativeDriver: true },
            )
            : null
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={() => header}
        contentContainerStyle={{
          paddingTop: h + TabBarHeight,
          paddingHorizontal: 10,
          minHeight: windowHeight - SafeStatusBar + h,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, h],
      outputRange: [h, 0],
      extrapolate: 'clamp',
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: 'absolute',
          transform: [{ translateY: y }],
          width: '100%',
        }}>
        {/* <ScrollView> */}
        <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
        {/* </ScrollView> */}
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: windowWidth,
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {renderTabView()}
      {renderHeader()}
    </View>
  )
}

export default RenderTabs

const styles = StyleSheet.create({
  header: {
    // height: HeaderHeight,
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 16,
    color: '#222',
    alignItems: "center",
    flexDirection: "row"
  },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#FFCC80',
    height: TabBarHeight,
  },
  indicator: { backgroundColor: '#222' },

})
