import React from 'react'
import { StyleSheet, Text, View , FlatList} from 'react-native'

const List = () => {
    return (
        <FlatList
        data={requests}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
            (
                <View>
                { item.uid !== user.uid ? 
                    <TouchableOpacity onPress={() => profile(item)} style={styles.container}>
                        <Image
                            source={{ uri: item.photoURL }}
                            style={{ height: 70, width: 70, borderRadius: 70 }}
                        />
                        <Text style={styles.text}>{item.displayName}</Text>
                    </TouchableOpacity> : null}
                </View>
            )
        )
    }
    />
    )
}

export default List

const styles = StyleSheet.create({})
