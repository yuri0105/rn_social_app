import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import {
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  View,
  TextInput,
  Text,
  KeyboardAvoidingView
} from 'react-native';
import Login from './screens/Login';
import { createStackNavigator } from '@react-navigation/stack';
import {
  DarkTheme,
  getFocusedRouteNameFromRoute,
  NavigationContainer,
  useNavigation,
  DefaultTheme,
  useTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MobileVerification from './screens/MobileVerification';
import Home from './screens/Home';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Comment from './screens/Comment';
import Notifications from './screens/Notifications';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as firebase from 'firebase';
import FlashMessage from 'react-native-flash-message';
import _ from 'lodash';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Search from './screens/Search';
import Profile from './screens/Profile';
import { Avatar } from 'react-native-elements';
import { auth, db } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  logout,
  selectUser,
  setStats,
  setUserInfo,
} from './redux/features/userSlice';
import { selectDarkThemeStatus, changeDarkTheme } from "./redux/features/setting";
import { Provider } from 'react-redux';
import store from './redux/app/store';
import AddPost from './screens/AddPost';
import { LogBox } from 'react-native';
import FilterImage from './screens/FilterImage';
import ImageBrowserScreen from './screens/ImageBrowser';
import Story from './screens/Story';
import { addUsers, selectUsers } from './redux/features/usersSlice';
import UserProfile from './screens/UserProfile';
import { Feather } from '@expo/vector-icons';
import ViewProfile from './screens/ViewProfile';
import ChatScreen from './screens/ChatScreen';
import ChatList from './screens/ChatList';
import UserFollowers from './screens/UserFollowers';
import ProfileSettings from './screens/ProfileSettings';
import CreateGroup from './screens/CreateGroup';
import GroupSettings from './screens/GroupSettings';
// import GroupImage from './screens/GroupImage';
import Invite from './screens/Invite';
import GroupProfile from './screens/GroupProfile';
import GroupProfileSettings from './screens/GroupProfileSettings';
import Sidebar from './customDrawer';
import Settings from './screens/Settings';
import SearchList from './screens/SearchList';
import { addPages } from './redux/features/pagesSlice';
import Reshare from './screens/Reshare';
import Activities from './screens/Activities';
import ProfileView from './screens/ProfileView';
import AddTodo from './screens/AddTodo';
import EditRealTodo from './screens/EditRealTodo';
import EditTodo from './screens/EditTodo';
import LikedList from './screens/LikedList'
import Compliment from './screens/Compliment';
import ViewPost from './screens/ViewPost';
import PostList from './screens/PostList';
import CameraPreview from './screens/CameraPreview';
import PrivateAccount from './screens/PrivateAccount';
import { addPost } from './redux/features/postSlice';
import { addFriend } from './redux/features/friendSlice';
import PrivacyPolicy from './screens/PrivacyPolicy';
import ContactUs from './screens/ContactUs';
import PrivateChat from './screens/PrivateChat';
import SendPvtImage from './screens/SendPvtImage';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPhoto from './components/AddPhoto';
import ProfileStory from './screens/ProfileStory';
import LocalAuth from './screens/LocalAuth';
import AddPersonalStory from './screens/AddPersonalStory';
import ShoppingList from './screens/ShoppingList';
import ImageEditor from './screens/ImageEditor';
import peopleNearby from './screens/PeopleNearby';
import deleteAccount from './screens/DeleteAccount';

const Stack = createStackNavigator();
const HomeStack = createBottomTabNavigator();
var authUser = firebase.auth().currentUser;
LogBox.ignoreLogs([
  'Setting a timer',
  "Can't perform a React state update on an unmounted component",
  'value provided is not in a recognized RFC2822 or ISO format',
]);

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Socially';
  switch (routeName) {
    case 'Home':
      return 'Socially';
    case 'Settings':
      return 'Settings';
    case 'Find People':
      return 'Find People';
    case 'Profile':
      return authUser?.displayName || 'user';
    case 'Post':
      return 'Add a Post';
    case 'Notification':
      return 'Notification';
  }
}

const PostStack = createStackNavigator();

const PostNavigator = () => {
  return (
    <PostStack.Navigator>
      <PostStack.Screen
        name="Post"
        component={AddPost}
        options={{ headerShown: false }}
      />
      <PostStack.Screen
        name="FilterImage"
        component={FilterImage}
        options={{ headerShown: false }}
      />
      <PostStack.Screen name="ImageBrowser" component={ImageBrowserScreen} />
      <PostStack.Screen name="Reshare" component={Reshare} />
    </PostStack.Navigator>
  );
};

const SearchStack = createStackNavigator();

const SearchNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Search"
        options={{ headerTitle: 'Search', headerTitleAlign: 'center' }}
        component={Search}
      />
      <SearchStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerTitleAlign: 'center' }}
      />
      <Stack.Screen
        name="SearchList"
        component={SearchList}
        options={{ headerTitleAlign: 'center' }}
      />
      <Stack.Screen name="Compliment" component={Compliment} />
      <Stack.Screen name="PostList" component={PostList} />
      <Stack.Screen name="UserFollowers" component={UserFollowers} />
    </SearchStack.Navigator>
  );
};

const NotificationStack = createStackNavigator();
const NotificationNavigator = () => {
  return (
    <NotificationStack.Navigator>
      <NotificationStack.Screen name="Notification" component={Notifications} />
      <NotificationStack.Screen name="ViewProfile" component={ViewProfile} />
      <NotificationStack.Screen name="Activities" component={Activities} />
      <NotificationStack.Screen name="ProfileViewers" component={ProfileView} />
      <NotificationStack.Screen name="ViewPost" component={ViewPost} />
    </NotificationStack.Navigator>
  );
};

const ProfileStack = createStackNavigator();

const Drawer = createDrawerNavigator();

const ProfileSettingsStack = createStackNavigator();

const ProfileSettingsNavigator = () => {
  return (
    <ProfileSettingsStack.Navigator>
      <ProfileStack.Screen name="ProfileSettings" component={ProfileSettings} />
    </ProfileSettingsStack.Navigator>
  );
};

const CreateGroupStack = createStackNavigator();

const CreateGroupNavigator = () => {
  return (
    <CreateGroupStack.Navigator>
      <CreateGroupStack.Screen name="CreateGroup" component={CreateGroup} />
      <CreateGroupStack.Screen name="GroupSettings" component={GroupSettings} />
      {/* <CreateGroupStack.Screen name="GroupImage" component={GroupImage} /> */}
      <CreateGroupStack.Screen name="Invite" component={Invite} />
    </CreateGroupStack.Navigator>
  );
};

const PageStack = createStackNavigator();

const PageNavigator = () => {
  return (
    <PageStack.Navigator>
      <PageStack.Screen name="Settings" component={Settings} />
      <PageStack.Screen
        name="GroupProfile"
        component={GroupProfile}
        options={{
          drawerLabel: 'Page Profile',
          drawerIcon: () => (
            <FontAwesome name="group" size={24} color="black" />
          ),
        }}
      />
      <PageStack.Screen
        name="GroupProfileSettings"
        component={GroupProfileSettings}
        options={{
          drawerLabel: 'Page Profile Settings',
          drawerIcon: () => <Feather name="settings" size={24} color="black" />,
        }}
      />
      <PageStack.Screen
        name="DeleteAccount"
        component={deleteAccount}
        options={{
          drawerLabel: 'Delete Account',
          drawerIcon: () => (
            <FontAwesome5 name="trash-alt" size={24} color="black" />
          ),
        }}
      />
      <PageStack.Screen
        name="PrivateAccount"
        component={PrivateAccount}
        options={{
          drawerLabel: 'Account Privacy',
          drawerIcon: () => (
            <FontAwesome5 name="user-secret" size={24} color="black" />
          ),
        }}
      />
      <PageStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          drawerLabel: 'Privacy Policy',
        }}
      />
      <PageStack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          drawerLabel: 'Contact Us',
        }}
      />
    </PageStack.Navigator>
  );
};

const TodoStack = createStackNavigator();

const TodoNavigator = () => {
  return (
    <TodoStack.Navigator>
      <TodoStack.Screen name="AddTodo" component={AddTodo} />
      <TodoStack.Screen name="Add Todo" component={EditTodo} />
      <TodoStack.Screen name="Edit Todo" component={EditRealTodo} />
    </TodoStack.Navigator>
  );
};

const ShoppingStack = createStackNavigator();

const ShoppingNavigator = () => {
  return (
    <ShoppingStack.Navigator>
      <ShoppingStack.Screen
        name="AddShoppingList"
        component={ShoppingList}
        options={{ title: 'Shopping List', headerTitleAlign: 'center' }}
      />
    </ShoppingStack.Navigator>
  );
};

const PeopleNearbyStack = createStackNavigator();

const PeopleNearbyNavigator = () => {
  return (
    <PeopleNearbyStack.Navigator>
      <PeopleNearbyStack.Screen
        name="peopleNearby"
        component={peopleNearby}
        options={{ title: 'people Nearby', headerTitleAlign: 'center' }}
      />
    </PeopleNearbyStack.Navigator>
  );
};

const DrawerNavigator = () => {
  const isDarkTheme = useSelector(selectDarkThemeStatus);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  return (
    <Drawer.Navigator drawerContent={(props) => <Sidebar isDarkTheme={isDarkTheme} setIsDarkTheme={() => dispatch(changeDarkTheme(!isDarkTheme))} {...props} />}>
      <Drawer.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          drawerIcon: () => (
            <MaterialIcons name="person-outline" size={24} color={colors.icon} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileSettings"
        component={ProfileSettingsNavigator}
        options={{
          drawerLabel: 'Profile Settings',
          drawerIcon: () => <Feather name="settings" size={24} color={colors.icon} />,
          headerTitle: 'Profile Settings',
        }}
      />
      <Drawer.Screen
        name="CreateGroup"
        component={CreateGroupNavigator}
        options={{
          drawerLabel: 'Create Page',
          drawerIcon: () => (
            <AntDesign name="addusergroup" size={24} color={colors.icon} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddTodo"
        component={TodoNavigator}
        options={{
          drawerLabel: 'Add Todos',
          drawerIcon: () => (
            <Entypo name="add-to-list" size={24} color={colors.icon} />
          ),
        }}
      />
      <Drawer.Screen
        name="LocalAuth"
        component={LocalAuth}
        options={{
          drawerLabel: 'Enable Guard',
          drawerIcon: () => (
            <FontAwesome5 name="user-shield" size={24} color={colors.icon} />
          ),
        }}
      />
      <Drawer.Screen
        name="ShoppingList"
        component={ShoppingNavigator}
        options={{
          drawerLabel: 'Shopping List',
          drawerIcon: () => (
            <MaterialIcons name="add-shopping-cart" size={24} color={colors.icon} />
          ),
        }}
      />

      <Drawer.Screen
        name="PeopleNearby"
        component={PeopleNearbyNavigator}
        options={{
          drawerLabel: 'People Nearby',
          drawerIcon: () => (
            <MaterialIcons name="people-alt" size={24} color={colors.icon} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const ProfileNavigator = ({ navigation }) => {
  const { colors } = useTheme();
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{ margin: 10 }}
              onPress={() => navigation.openDrawer()}
            >
              <Entypo name="menu" size={28} color={colors.icon} />
            </TouchableOpacity>
          ),
        }}
      />
      <ProfileStack.Screen name="UserFollowers" component={UserFollowers} />
      <ProfileStack.Screen
        name="Settings"
        component={PageNavigator}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};

function HomeNavigatorStack({ navigation, route }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const users = useSelector(selectUsers);
  const [likes, setLikes] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [newPosts, setNewPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const { dark, colors } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser?.uid,
            photoURL: authUser?.photoURL || null,
            email: authUser?.email || '',
            displayName: authUser?.displayName || '',
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = db.collection('posts').onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        var uid = doc.id;
        db.collection('posts')
          .doc(uid)
          .collection('userPosts')
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) =>
            snapshot.docs.map((doc) =>
              setNewPosts((prev) => [
                ...prev,
                {
                  id: doc.id,
                  data: doc.data(),
                  uid: uid,
                },
              ])
            )
          );
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (newPosts) {
      dispatch(
        addPost(
          newPosts.map((post) => ({
            id: post.id,
            uid: post.uid,
            image: post.data.image,
          }))
        )
      );
    }
  }, [newPosts]);

  // useEffect(() => {
  // 	if (user || authUser) {
  // 		db.collection("posts").doc(user?.uid || authUser?.uid).set({
  // 			displayName: user?.displayName || authUser?.displayName || '',
  // 			userImg: user?.photoURL || authUser?.photoURL || ''
  // 		}).then(() => console.log('profile updated'));

  // 		db.collection("users").doc(authUser?.uid || user?.uid).set({
  // 			displayName: user?.displayName || authUser?.displayName || '',
  // 			email: user?.email || authUser?.email || '',
  // 			photoURL: user?.photoURL || authUser?.photoURL || null,
  // 			uid: user?.uid || authUser?.uid,

  // 		})
  // 	}
  // }, [user]);

  useEffect(() => {
    if (users) {
      users.map((u) =>
        db
          .collection('users')
          .doc(u?.uid)
          .collection('page')
          .onSnapshot((snapshot) =>
            dispatch(
              addPages(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  name: doc.data().name,
                  description: doc.data().description,
                  invite: doc.data().invite,
                  privacy: doc.data().privacy,
                  types: doc.data().types,
                  uid: u?.uid,
                  website: doc.data().website || '',
                  location: doc.data().location || [],
                  bio: doc.data().bio || '',
                }))
              )
            )
          )
      );
    }
  }, [users]);

  useEffect(() => {
    db.collection('users').onSnapshot((snapshot) => {
      const array = [...new Map(snapshot.docs.map((doc) => [doc.data()["uid"], doc.data()])).values()]
      dispatch(addUsers(array));
    });
  }, []);

  useEffect(() => {
    if (user || authUser) {
      db.collection('users')
        .doc(user?.uid || authUser?.uid)
        .collection('friends')
        .onSnapshot((snapshot) => {
          setFollowing(
            snapshot?.docs?.map((doc) => ({
              id: doc.id,
              displayName: doc?.data()?.displayName || '',
              photoURL: doc?.data().photoURL || null,
              timestamp: doc.data().timestamp,
            }))
          );
          setFriends(
            snapshot.docs.map((doc) => ({
              displayName: doc.data().displayName || '',
              email: doc.data().email || '',
              uid: doc.data().uid,
              photoURL: doc.data().photoURL || '',
              id: doc.id,
            }))
          );
        });

      db.collection('users')
        .doc(user?.uid || authUser?.uid)
        .collection('info')
        .doc(user?.uid)
        .get()
        .then((doc) => {
          dispatch(
            setUserInfo({
              bio: doc?.data()?.bio || '',
              location: doc?.data()?.location || null,
              privacy: doc?.data()?.privacy || 'public',
              website: doc?.data()?.website || '',
            })
          );
        });
    }
  }, [user || authUser]);

  useEffect(() => {
    if (user || authUser) {
      const unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .collection('followers')
        .onSnapshot((snapshot) =>
          setFollowers(
            snapshot?.docs?.map((doc) => ({
              id: doc.id,
              displayName: doc?.data()?.displayName || '',
              photoURL: doc?.data().photoURL || null,
              timestamp: doc.data().timestamp || null,
            }))
          )
        );
      return unsubscribe;
    }
  }, [user || authUser]);

  useEffect(() => {
    if (user || authUser) {
      const unsubscribe = db
        .collection('posts')
        .doc(user?.uid || authUser?.uid)
        .collection('likedPosts')
        .onSnapshot((snapshot) => {
          setLikes(snapshot.size);
        });
      return unsubscribe;
    }
  }, [user]);

  // useEffect(() => {
  // 	if (user || authUser) {
  // 		const unsubscibe = db.collection("users").doc(user?.uid || authUser?.uid).collection("friends").onSnapshot((snapshot) =>
  // 			setFriends(snapshot.docs.map((doc) =>
  // 			({
  // 				displayName: doc.data().displayName || '',
  // 				email: doc.data().email || '',
  // 				uid: doc.data().uid,
  // 				photoURL: doc.data().photoURL || '',
  // 				id: doc.id
  // 			})
  // 			)

  // 			))
  // 		return unsubscibe;
  // 	}
  // }, [user]);

  useEffect(() => {
    if (friends) {
      dispatch(addFriend(friends));
    }
  }, [friends]);

  useEffect(() => {
    dispatch(
      setStats({
        followers: followers,
        following: following,
        likes: likes,
      })
    );
  }, [followers, following, likes]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(route),
      headerBackTitleVisible: false,
      headerShown:
        getFocusedRouteNameFromRoute(route) === 'Post' ||
          getFocusedRouteNameFromRoute(route) === 'Search' ||
          getFocusedRouteNameFromRoute(route) === 'Notification' ||
          getFocusedRouteNameFromRoute(route) === 'Chat' ||
          getFocusedRouteNameFromRoute(route) === 'Profile'
          ? false
          : true,
      headerRight: () => (
        <TouchableOpacity
          style={{ margin: 10 }}
          onPress={() => navigation.navigate('Chat')}
        >
          <Feather name="message-square" size={24} color={colors.icon} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, route]);

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: () => <Entypo name="home" size={24} color="gray" />,
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={SearchNavigator}
        options={{
          tabBarIcon: () => <AntDesign name="search1" size={24} color="gray" />,
        }}
      />

      <HomeStack.Screen
        name="Post"
        component={PostNavigator}
        options={{
          tabBarIcon: () => (
            <MaterialIcons name="add-a-photo" size={24} color="gray" />
          ),

          tabBarVisible: false,
        }}
      />
      <HomeStack.Screen
        name="Notification"
        component={NotificationNavigator}
        options={{
          tabBarIcon: () => (
            <Ionicons name="md-notifications" size={24} color="gray" />
          ),
        }}
      />

      <HomeStack.Screen
        name="Profile"
        component={DrawerNavigator}
        options={{
          tabBarIcon: () => (
            <Avatar
              size="small"
              source={{
                uri:
                  user?.photoURL ||
                  'https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png',
              }}
              rounded
              icon={{ name: 'user', type: 'font-awesome' }}
            />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

const ChatStack = createStackNavigator();

const ChatNavigator = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="ChatList"
        component={ChatList}
        options={{ headerTitle: 'Chat' }}
      />
      <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      <ChatStack.Screen
        name="PvtChat"
        component={PrivateChat}
        options={{ headerTitle: 'Private Note' }}
      />
      <ChatStack.Screen
        name="PvtImage"
        component={SendPvtImage}
        options={{ headerTitle: 'Private Note' }}
      />
    </ChatStack.Navigator>
  );
};

const Main = () => {
  const isDarkTheme = useSelector(selectDarkThemeStatus);
  const darkThemeCustom = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      icon: "#fff"
    },
  }

  const defaultThemeCustom = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      icon: "black"
    }
  }

  return (
    <NavigationContainer theme={isDarkTheme ? darkThemeCustom : defaultThemeCustom}>
      <Stack.Navigator>
        <Stack.Screen
          name="Authentication"
          component={MobileVerification}
          options={{ headerTitle: '', headerTransparent: true }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerTransparent: true }}
        />
        <Stack.Screen
          name="Socially"
          component={HomeNavigatorStack}
          options={{
            headerTitleAlign: 'center',
            headerTitle: 'Socially',
          }}
        />
        <Stack.Screen
          name="Comment"
          component={Comment}
          options={{ headerTitleAlign: 'center' }}
        />
        <Stack.Screen name="Story" component={Story} />
        <Stack.Screen
          name="Chat"
          component={ChatNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CameraPreview"
          component={CameraPreview}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileStory"
          component={ProfileStory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddPersonalStory"
          component={AddPersonalStory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ImageEditor"
          component={ImageEditor}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Likes"
          component={LikedList}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default function App() {
  const [localAuth, setLocalAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [val, setVal] = useState('');

  useEffect(() => {
    checkLocalAuth();
  }, []);

  const checkLocalAuth = async () => {
    try {
      const value = await AsyncStorage.getItem('@local_auth');
      if (value !== null) {
        setLocalAuth(true);
        setVal(value);
        setLoading(false);
      } else {
        setLocalAuth(false);
        setLoading(false);
      }
    } catch (e) {
      // error reading value
    }
    // const support = await LocalAuthentication.supportedAuthenticationTypesAsync()
    // console.log(support, 'supp')
  };

  const checkAuth = () => {
    if (password === val) {
      setLocalAuth(false);
    } else {
      alert('Wrong pin');
    }
  };

  const authUsingBio = async () => {
    const bioMets = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate using Fingerprint ID or Face ID',
    });
    if (bioMets.success) {
      setLocalAuth(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color="blue" size="large" />
      </View>
    );
  }

  if (localAuth) {
    if (val.length != 0) {
      {
        authUsingBio();
      }
      return (
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <TextInput
            secureTextEntry={true}
            maxLength={6}
            keyboardType={'phone-pad'}
            placeholder="Enter Pin to continue"
            textAlignVertical="center"
            multiline={false}
            style={{
              height: 50,
              width: '90%',
              marginHorizontal: '5%',
              borderColor: '#c4c4c4',
              borderWidth: 1,
              padding: 5,
              borderRadius: 10,
              fontSize: 16,
            }}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            onPress={checkAuth}
            style={{
              width: '90%',
              marginHorizontal: '5%',
              borderRadius: 10,
              backgroundColor: '#0080FF',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 17, fontWeight: 'bold' }}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
  return (
    // <AddTodo/>
    //  <NavigationContainer>
    //     <TodoNavigator/>
    //  </NavigationContainer>
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* <StatusBar style="dark" /> */}
          <Main />

          <FlashMessage position="top" />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
