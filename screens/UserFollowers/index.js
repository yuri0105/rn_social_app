import React, { useLayoutEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
// import {Picker} from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Text, Avatar, ListItem, Button, CheckBox, Input } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUser, selectUserStats } from '../../redux/features/userSlice';
import { selectUsers } from '../../redux/features/usersSlice';
import { Overlay } from 'react-native-maps';





const UserFollowers = ({ navigation, route }) => {
  const [filteNewToOld, setFilterNewToOld] = useState(false);
  const [filterOldToNew, setFilterOldToNew] = useState(false);
  const user = useSelector(selectUser);
  const [selectedOption, setSelectedOption] = useState();
  const [filteredList, setFilteredList] = useState([]);
  const [userFilter, setUserFilter] = useState(false);
  const users = useSelector(selectUsers);
  let _menu = useRef(null);
  const [checkCircle, setCheckCircle] = useState(false);
  const [check, setCheck] = useState('');
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [renderText, setRenderText] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{ margin: 12 }} onPress={() => navigation.goBack()}>
          <Ionicons name="md-arrow-back" size={28} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: route?.params?.text,
      headerTitleAlign: "center"
    })
  }, [])

  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const showMenu = () => {
    _menu.show();
  };

  const filterNewestToOldest = () => {
    if (!filteNewToOld) {
      setFilterNewToOld(true);
      var arr = list.sort(function (a, b) {

        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      console.log('arr-->', arr);
      setFilteredList(arr);
    }
    hideMenu();
  }

  const filterOldestToNewest = () => {
    if (!filterOldToNew) {
      setFilterOldToNew(true);
      var arr = list.sort(function (a, b) {

        return new Date(a.timestamp) - new Date(b.timestamp);
      });
      setFilteredList(arr);
    }
    hideMenu();
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerTitle: route?.params?.text,
      headerRight: () => (
        <Menu
          ref={setMenuRef}
          button={<TouchableOpacity style={{ margin: 10 }} onPress={showMenu}><MaterialIcons name="filter-list" size={28} color="black" /></TouchableOpacity>}
        >
          <MenuItem onPress={filterNewestToOldest}>newest to oldest</MenuItem>
          <MenuDivider />
          <MenuItem onPress={filterOldestToNewest}>oldest to newest</MenuItem>
        </Menu>
      )
    })
  }, [navigation])

  const unfollow = (id) => {
    db.collection("users").doc(user?.uid).collection("friends").doc(id).delete().then(() => {
      console.log('successfully deleted');
      list.splice(list.findIndex(a => a.id === id), 1)
    })
  }

  const handleCheckCircle = () => {
    setCheckCircle(true);
    setCheckRound(false);
  }

  const handelRoundCircle = () => {
    setCheckCircle(false);
    setCheckRound(true);
  }

  const onAdd = () => {
    if (value) {
      let u = users.filter(user => user.displayName === selectedItem.displayName)[0];

      db.collection("users").doc(u?.uid).collection("circles").doc(user?.uid).set({
        // circleNames:[...circleNames,value], 
        circledBy: {
          uid: user?.uid,
          photoURL: user?.photoURL,
          displayName: user?.displayName
        }
      })
      db.collection("users").doc(u?.uid).collection("circles").doc(user?.uid).collection("circlNames").add({
        circleName: value
      })
      setValue("");
      setVisible(false);
    }
  }

  const handlePress = (text, l) => {
    setRenderText(text);
    setVisible(true);

    if (text === "Circle") {
      handleAddtoCicle(l);
    }

  }
  const handleAddtoCicle = (item) => {
    setVisible(true);
    setSelectedItem(item);
    // console.log('selected ite-->',item);
  }

  const RenderContent = () => {
    return (
      <View style={{ width: 300, height: 350, backgroundColor: '#fff', padding: 20, flexDirection: "column", justifyContent: "space-around" }}>

        <Input
          placeholder="New Circle Name"
          value={value}
          onChangeText={text => setValue(text)}
        />
        <View style={styles.bottom}>
          <Button
            title="Add"
            buttonStyle={{ width: 100, borderRadius: 20, backgroundColor: "#E5554D" }}
            onPress={onAdd}
          />
        </View>
      </View>
    )
  }

  const reportList = [
    "Sexual Content",
    "Violent or repulsive content",
    "Hateful or abusive content",
    "Harmful acts",
    "Child abuse",
    "Spam",
    "Promote terrorism"
  ]

  // console.log('rendertext-->',renderText);

  const handleCheck = (l) => {
    if (check === l) {
      setCheck('')
    } else {
      setCheck(l)
    }
  }

  const RenderReport = () => {
    return (
      <View style={{ width: 300, height: "80%", backgroundColor: '#fff', padding: 20, flexDirection: "column", justifyContent: "space-around" }}>
        {
          reportList.map((l, i) => (
            <ListItem key={i}>

              <ListItem.Content>
                <ListItem.Title>
                  <CheckBox
                    title={l}
                    checked={check === l}
                    onPress={() => handleCheck(l)}
                  />
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))
        }
        <Button buttonStyle={{ borderRadius: 10 }} onPress={() => setVisible(false)} title="Done" />
      </View>
    )
  }

  const list = route?.params?.list
  return (
    <ScrollView style={{ backgroundColor: 'white' }}>
      <View style={styles.listHeader}>
      </View>
      {((!filteNewToOld || !filterOldToNew) ? list : filteredList)?.map((l, i) => (
        <ListItem key={i} bottomDivider>
          <Avatar avatarStyle={{ borderRadius: 10 }} source={{ uri: l.photoURL }} />
          <ListItem.Content>
            <ListItem.Title style={{ fontSize: 18 }}>{l.displayName}</ListItem.Title>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }} >
              <ListItem.Subtitle><Button onPress={() => handlePress("Circle", l)} titleStyle={{ color: "black" }} buttonStyle={{ borderRadius: 10, backgroundColor: "lightgray", margin: 2 }} title="Add to Circle" /></ListItem.Subtitle>
              {route?.params?.text === "Following" ?
                <ListItem.Subtitle><Button titleStyle={{ color: "black" }} onPress={() => unfollow(l.id)} buttonStyle={{ borderRadius: 10, backgroundColor: "lightgray", margin: 2 }} title="Unfollow" /></ListItem.Subtitle>
                : null
              }
              <ListItem.Subtitle><Button onPress={() => handlePress("Report")} titleStyle={{ color: "black" }} buttonStyle={{ borderRadius: 10, backgroundColor: "lightgray", margin: 2 }} title="Report" /></ListItem.Subtitle>
            </View>

          </ListItem.Content>
        </ListItem>
      ))}
      <View style={{ flexDirection: "column", height: 100, width: 100, justifyContent: "center", alignItems: "center" }}>
        <Modal animationType="slide" visible={visible} style={{ flexDirection: "column" }} onRequestClose={() => { setVisible(!visible); }}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#00000080',
            alignItems: 'center'
          }}>
            <TouchableOpacity style={{ position: "absolute", top: 10, left: 10 }} onPress={() => setVisible(false)}>
              <Ionicons name="md-arrow-back" size={28} color="white" />
            </TouchableOpacity>
            {renderText === "Circle" ? <RenderContent /> : <RenderReport />}
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default UserFollowers;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  listButton: {
    backgroundColor: "lightgray",
    borderRadius: 10,

  },


});


{/* <CheckBox
                                title='Circle'
                                checked={checkCircle}
                                onPress={() => handleCheckCircle()}
                                />
                                <CheckBox
                                title='Round'
                                checked={checkRound}
                                onPress={() => handelRoundCircle()}
                                /> */}
{/* <TextInput
                                  style={{ height: 50, borderColor: 'gray', borderWidth: 0.5, backgroundColor: "lightgray"}}
                                  placeholderTextColor = "black"
                                  onChangeText={text => onChangeText(text)}
                                  value={value}
                                  placeholder="New Circle Name"
                                /> */}