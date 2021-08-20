import React, {useEffect, useState} from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  FlatList,
} from 'react-native';
import { db } from '../../firebase';
 
import UserStoryPreview from "../UserStoryPreview";

const UserStoryList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
     const unsubscribe = db.collection("users").onSnapshot((snapshot) => {
        setUsers(snapshot.docs.map((doc) => doc.data()))
     });
     return unsubscribe
    }, [setUsers])
    return (
        <View>
        <FlatList
          data={users}
          renderItem={({item}) => <UserStoryPreview user={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    )
}

export default UserStoryList

const styles = StyleSheet.create({})
