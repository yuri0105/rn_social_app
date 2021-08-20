import React, { useEffect, useLayoutEffect } from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProfileComp from '../../components/ProfileComp'
import { selectPage, setPage } from '../../redux/features/pageSlice'
import { Entypo } from '@expo/vector-icons'; 
import { db } from '../../firebase'
import { selectUser } from '../../redux/features/userSlice'
import * as firebase from 'firebase';
import { selectPages } from '../../redux/features/pagesSlice'


const GroupProfile = ({navigation}) => {
    const pages= useSelector(selectPages);
    var page = useSelector(selectPage);
	page = page?.length > 0 ? page : pages;
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const authUser = firebase.auth().currentUser
    // console.log('page-->',page);
    
    

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: page?.name || "Page Profile",
            headerTitleAlign: "center",
            headerRight: () => 
            (	
                <TouchableOpacity style={{margin: 10}} onPress={() => navigation.openDrawer()}>
                    <Entypo name="menu" size={28} color="black" />
                </TouchableOpacity>
            )
        })
    },[navigation]);


    

    return (
        <>
        {page ?
            <ProfileComp u={false} /> : <Text>Create a page to view.</Text>
        }
        </>
    )
}

export default GroupProfile

const styles = StyleSheet.create({})
