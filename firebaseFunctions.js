import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { db } from './firebase';

const firebaseFunctions = () => {
	const [ users, setUsers ] = useState([]);

    useEffect(() =>{
        db.collection('users').onSnapshot((snapshot) => {
            setUsers(snapshot.docs.map((doc) => doc.data()));
        });
    },[])
	return <View />;
};

export default firebaseFunctions;

const styles = StyleSheet.create({});
