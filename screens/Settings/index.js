import React, { useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import { FontAwesome, FontAwesome5, Feather } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/userSlice';

const Settings = ({ navigation }) => {
  const disptach = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
    });
  }, []);

  const logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('signed out');
        navigation.replace('Authentication');
      })
      .catch((err) => console.log('err in signout-->', err));
  };

  return (
    <View style={{ backgroundColor: '#ffffff', flex: 1 }}>
      <ListItem bottomDivider>
        <FontAwesome name="group" size={24} color="black" />
        <ListItem.Content>
          <TouchableOpacity onPress={() => navigation.navigate('GroupProfile')}>
            <ListItem.Title>Page Profile</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <Feather name="settings" size={24} color="black" />
        <ListItem.Content>
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupProfileSettings')}
          >
            <ListItem.Title>Page Profile Settings</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <FontAwesome5 name="user-secret" size={24} color="black" />
        <ListItem.Content>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivateAccount')}
          >
            <ListItem.Title>Account Privacy</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <FontAwesome5 name="trash-alt" size={24} color="black" />
        <ListItem.Content>
          <TouchableOpacity
            onPress={() => navigation.navigate('DeleteAccount')}
          >
            <ListItem.Title>Delete Account</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <TouchableOpacity
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <ListItem.Title>Privacy Policy</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <ListItem bottomDivider>
        <ListItem.Content>
          <TouchableOpacity onPress={() => navigation.navigate('ContactUs')}>
            <ListItem.Title>Contact Us</ListItem.Title>
          </TouchableOpacity>
        </ListItem.Content>
      </ListItem>
      <View style={styles.bottom}>
        <Button
          title="LOGOUT"
          buttonStyle={{
            width: 200,
            backgroundColor: '#49cbe9',
            borderRadius: 10,
            padding: 14,
          }}
          onPress={logout}
        />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  bottom: {
    margin: 20,
    alignSelf: 'center',
  },
});
