import React from 'react';
import { useEffect } from 'react';
import { View, Text, Image, Dimensions, FlatList  } from 'react-native';

function ProfileStory({navigation, route}){

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const { data } = route.params;

    useEffect(()=>{
      //wait(3000).then(()=> navigation.goBack(null))
    },[]);

    console.log(data)

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    


    return(
        <View style = {{height:'100%', width:"100%"}}>
           <FlatList
                data={data?.posts}
                horizontal
                keyExtractor={(item, index) => `${item.image}${index}`}
                renderItem={({ item }) => (
                    <View style={{ height: '100%', width: width }}>
                        <Image style={{ height: '100%', width: "100%" }} source={{ uri: item.image }} />
                        <Text style={{ position: "absolute", bottom: 130, left: 20, fontSize: 25, fontWeight: "bold", zIndex: 1, color: "white" }}>{item.title}</Text>
                        <View style={{ position: "absolute", bottom: 15, left: 20, width: "60%", height: 100, }}>
                            <Text numberOfLines={3} style={{ fontSize: 18, fontWeight: "500", color: "white", }}>{item.desc}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default ProfileStory;