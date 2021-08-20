import React from 'react';
import TimedSlideshow from 'react-native-timed-slideshow';
import { useNavigation } from '@react-navigation/native';
 
 

const StoryView = ({items}) => {
 const navigation = useNavigation()
  
    return (
        
        <TimedSlideshow
          items={items}
          onClose={() => navigation.navigate('Home')}
        />
      
    )
}

export default StoryView

 