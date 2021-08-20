import { FontAwesome5 } from '@expo/vector-icons';
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { Switch } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from 'react-native-elements';
import * as firebase from 'firebase';
import {
  selectUser,
  selectUserInfo,
  setUserInfo,
} from '../../redux/features/userSlice';

const DeleteAccount = ({ navigation }) => {
  const firebaseUser = firebase.auth().currentUser;
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCheck = () => {
    setChecked(!checked);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Delete Account',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const onPress = () => {
    if (checked) {
      firebaseUser
        .delete()
        .then(() => {
          console.log('user ' + firebaseUser.uid + ' deleted');
          setMessage('Account deleted successfully');
        })
        .catch((error) => {
          setMessage(error);
        });
    }
    setMessage('Please approve to the concequences');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      <View style={styles.heading}>
        <View
          style={{
            backgroundColor: 'whitesmoke',
            padding: 10,
            borderRadius: 5,
          }}
        >
          <FontAwesome5 name="trash-alt" size={24} color="gray" />
        </View>
        <Text style={styles.headingText}>Delete Account</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.headingText}>Delete Account</Text>
        <Text style={{ fontSize: 17, color: 'gray' }}>
          Deleting your account will delete all of the content you have created.
          It will be completely irrecoverable.
        </Text>
        <View style={styles.concequences}>
          <CheckBox checked={checked} onPress={handleCheck} />
          <Text style={{ fontSize: 17, color: 'gray' }}>
            I understant the consequences
          </Text>
        </View>
        <Button
          buttonStyle={{
            borderRadius: 5,
            padding: 15,
            backgroundColor: 'grey',
            width: '50%',
          }}
          onPress={onPress}
          title="DELETE ACCOUNT"
        />
      </View>
      {message !== null && <Text> {message}</Text>}
    </View>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    margin: 15,
    borderBottomWidth: 0.6,
    width: '100%',
    padding: 10,
  },
  headingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  content: {
    flexDirection: 'column',
    padding: 10,
  },
  concequences: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'gray',
  },
});
