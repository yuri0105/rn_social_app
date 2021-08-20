import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserStats } from '../../redux/features/userSlice';
import { SearchBar, Button } from 'react-native-elements';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import ItemShareFollowers from "./Item";



const SearchUserFollowers = ({ currentImage, open }) => {
    const stats = useSelector(selectUserStats);
    const { colors } = useTheme();
    const [followers, setFollowers] = useState([]);
    const [value, setValue] = useState('');
    useEffect(() => {
        setFollowers(stats.followers)
    }, [])
    const searchFilterFunction = (text) => {
        setValue(text);
        const newData = followers.filter((item) => {
            const itemData = `${item?.displayName?.toUpperCase()} ${item?.email?.toUpperCase()} ${item?.name?.toUpperCase()} `;
            //    ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;

            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        setFollowers(newData);
    };
    return (
        <View style={styles.container, { backgroundColor: "white", height: "100%" }}>

            <FlatList
                data={stats.followers}
                style={{ flex: 1 }}
                keyExtractor={(item) => item?.id || (typeof item?.uid !== 'undefined' && item?.uid)}
                renderItem={({ item }) => (
                    // console.log('item-->', item)
                    <ItemShareFollowers item={item} currentImage={currentImage} open={open} />
                )}
                ListHeaderComponent={
                    <SearchBar
                        autoCorrect={false}
                        containerStyle={{ backgroundColor: '#ffffff', borderWidth: 0 }}
                        round
                        editable
                        lightTheme
                        placeholder="Type Here..."
                        onChangeText={searchFilterFunction}
                        value={value}
                    />
                }
            />
        </View>
    );
}

export default SearchUserFollowers;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    leftActions: {
        backgroundColor: "#000",
        justifyContent: "center",
        flex: 1
    },
    leftText: {
        color: "white",
        padding: 20
    },
    rightActions: {
        backgroundColor: "#4286f4",
        justifyContent: "center",
        alignItems: "flex-end",
        height: "100%"
        // flex:1
    },
});