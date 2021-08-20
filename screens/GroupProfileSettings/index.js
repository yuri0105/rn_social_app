import React, { useLayoutEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProfileSettingsComp from '../../components/ProfileSettingsComp'
import { selectPage, setPage } from '../../redux/features/pageSlice'
import * as firebase from 'firebase';
import { selectUser } from '../../redux/features/userSlice'
import { db } from '../../firebase'
import { selectPages } from '../../redux/features/pagesSlice'

const GroupProfileSettings = ({navigation}) => {
    const pages = useSelector(selectPages);
    var page = useSelector(selectPage);
	page = page?.length > 0 ? page : pages?.[0];
    const user = useSelector(selectUser);
    const firebaseUser = firebase.auth().currentUser;
    const dispatch = useDispatch();

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: "Page Profile Settings"
        })
    },[])
  


    const onSave = (photoURL,displayName,bio,website,location) =>{
           dispatch(setPage({
               description: bio || page?.description,
               invite: page?.invite,
               name: displayName || page?.name,
               privacy:  page?.privacy,
               types: page.types,
               photoURL: photoURL || page?.photoURL,
               location: location || page?.location || [],
               website: website || page?.website || ''
           }))

          db.collection("users").doc(user?.uid || firebaseUser?.uid).collection("page").doc(page?.id).set({
               description: bio || page?.description || '',
               invite: page?.invite || [],
               name: displayName || page?.name || '',
               privacy:  page?.privacy || '',
               types: page.types || [],
               photoURL: photoURL || page?.photoURL || '',
               location: location || page?.location || [],
               website: website || page?.website || ''
          })
          
        
          navigation.navigate("GroupProfile");
    }

    return (
        <>
           <ProfileSettingsComp u={false} onSave={onSave} />
        </>
    )
}

export default GroupProfileSettings

const styles = StyleSheet.create({})
