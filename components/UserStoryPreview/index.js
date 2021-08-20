import React from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import styles from './styles';

import { useNavigation } from '@react-navigation/native';

const UserStoryPreview = () => {

    const navigation = useNavigation();
    const { user: { uid, displayName, photoURL } } = props;
  
   
  
    const onPress = () => {
      navigation.navigate('Story', { userId: uid });
    }
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
          <View style={styles.image}>
          <Image
            source={{ uri: photoURL || '' }}
            style={{
              width: 70,
              height: 70,
              borderRadius: size
            }}
          />
          </View>
          <Text style={styles.username}>{displayName}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
}

export default UserStoryPreview

 
