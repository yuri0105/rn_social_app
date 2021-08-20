import React, { useEffect, useLayoutEffect, useState } from 'react'
import { View,FlatList } from 'react-native'
import {ListItem, Avatar} from 'react-native-elements'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/features/userSlice'

const Activities = ({route, navigation}) => {
    const user= useSelector(selectUser);
    const [data, setData] = useState([]);
    const t = route?.params?.text
    const [text, setText] = useState('');

    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: "New " + text,
            headerTitleAlign: "center"

        })
    },[navigation])

    useEffect(() =>{
      setData(route?.params?.data)
      if(t === "Reshares"){
        setText("reshared") 
      }else if(t === "Likes"){
        setText("liked") 
      }else if(t === "Comments"){
          setText("commented") 
      }
    },[navigation]);

    return (
        <View style={{flex:1, backgroundColor: "#ffffff"}}>
            <FlatList 
                data={data}
                keyExtractor={(item) => item.postId}
                renderItem = {({item}) =>(
                    <ListItem key={item?.uid} bottomDivider>
                        <Avatar containerStyle={{height: 50, width:50}} avatarStyle={{borderRadius: 10}} source={{uri: item?.photoURL}} />
                        <ListItem.Content>
                            <ListItem.Title h5 h5Style={{fontSize: 19}}>{item?.displayName} {text} your post</ListItem.Title>
                        </ListItem.Content>
                  </ListItem>
                )}
            />
        </View>
    )
}

export default Activities
 