import React from 'react'
import {Image, View} from 'react-native'
import MapView, {Marker} from 'react-native-maps';

const dataFake = [
  {
    latlng: {latitude : 21.018372041069743, longitude : 105.77155308526282},
    name: 'Long test',
    url_image: 'https://thudaumot.edu.vn/wp-content/uploads/2021/03/Ngoai-hinh-husky-768x1024.jpg'
  },
  {
    latlng: {latitude : 21.01889282004422, longitude : 105.77510432980402},
    name: 'Long test1',
    url_image: 'https://tunglocpet.com/wp-content/uploads/2020/09/cho-husky-su-that-02.jpg'
  },
  {
    latlng: {latitude : 21.01676205760823, longitude : 105.77338984901549},
    name: 'Long test2',
    url_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6WB7cjV2M-ojSidRSaTCaYYjpiaYajb7uvKOpz51mNe_vI6GJKTXJw3i8zGyDBqh8Yt4&usqp=CAU'
  },
  {
    latlng: {latitude : 21.020246766928864, longitude : 105.77123306266525},
    name: 'Long test3',
    url_image: 'https://miaolands.com/wp-content/uploads/2019/03/Husky-m%E1%BA%B7t-ng%C3%A1o-1.jpg'
  },
]

function peopleNearby(props) {
  return(
    <MapView
      style={{flex: 1}}
      initialRegion={{
        latitude: 21.018182157867393,
        longitude: 105.77317041388199,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation={true}>
        {
          dataFake.map((e, i) => (
            <Marker
              key={i}
              coordinate={e.latlng}>
                <View style={{width: 50, height: 50, borderRadius: 10, borderColor: '#BDBDBD', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
                  <Image
                    style={{height: 40, width: 40, borderRadius: 5}}
                    source={{uri: e.url_image}}
                  />
                </View>
            </Marker>
          ))
        }
    </MapView>
  )
}

export default peopleNearby