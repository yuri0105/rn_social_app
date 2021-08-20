import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { selectUsers } from '../../redux/features/usersSlice';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import { setChatUser } from '../../redux/features/chatUser';
import { useNavigation } from '@react-navigation/native';
import { selectFriend } from '../../redux/features/friendSlice';


const SLIDER_WIDTH = Dimensions.get('window').width - 90;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.2);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

const AvatarCarousel = ({currentIndex, uid}) => {
    const users = useSelector(selectUsers);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const friend = useSelector(selectFriend);
    const [index, setIndex] = useState(friend.findIndex(u => u?.uid === uid));

    
// console.log('freind--->',friend);
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerShown: false
        })
    },[navigation])
    
    useEffect(() =>{
        dispatch(setChatUser(friend[index]));
    },[index]);
  

     

    const renderItem = ({item}) =>{
        return(
            <Image source={{uri: item?.photoURL}} style={styles.image} />
        )
    }
 
    const getIndex = () =>{
        const index =  friend.findIndex(u => u?.uid === uid);
 
        return index;
    }   

    // console.log(friend);
    let carousel = useRef();
    return (
            <Carousel
              layout={'default'} 
              ref={(c) => { carousel = c }}
              data={friend}
              firstItem={getIndex()}
              renderItem={renderItem}
              containerCustomStyle={styles.carouselContainer}
              sliderWidth={SLIDER_WIDTH}
              itemWidth={ITEM_WIDTH}
              onSnapToItem={(index) => setIndex(index)}
            />
    )
}

export default AvatarCarousel

const styles = StyleSheet.create({
    image:{
        width: 70, 
        height: 70, 
        borderRadius: 50,
      
    },
    carouselContainer:{
        alignSelf: "center"
    }
})
