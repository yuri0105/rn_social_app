import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native"
import { ListItem, Avatar, Button } from 'react-native-elements';
import { db } from '../../firebase';
import * as firebase from 'firebase';
import { useTheme } from "@react-navigation/native";
import { selectUser } from '../../redux/features/userSlice';
import { useSelector } from "react-redux";




const ItemShareFollowers = ({ currentImage, item, open }) => {
    const [status, setStatus] = useState("Send");
    const [disable, setDisable] = useState(false);
    const user = useSelector(selectUser);
    const { colors } = useTheme();

    useEffect(() => {
        if (!open) {
            setDisable(false);
            setStatus("Send");
        }
    }, [open])

    const createSharePost = () => {
        if (currentImage) {
            setStatus("Loading...");
            setDisable(true);
            db.collection("messages").doc(`${user?.uid}-${item?.id}`).collection('data').add({
                message: "",
                sender: user?.uid,
                reciever: item?.id,
                image: currentImage,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                setDisable(true)
                setStatus("Sent");

            })
                .catch(err => {
                    setStatus("Send");
                    setDisable(false);
                })
        }

    }
    if (!item) {
        return null;
    }
    const renderContent = () => {
        return (
            <View style={{ flexDirection: "row" }}>
                <ListItem.Title style={{ fontSize: 19, color: colors.text, flex: 1 }}>{item?.displayName || item?.name}</ListItem.Title>
                <View>
                    <Button disabled={disable} title={status} style={{ borderRadius: 5, padding: 5, }} onPressIn={createSharePost} />
                </View>

            </View>
        )
    }
    return (
        <ListItem key={item.uid} bottomDivider >
            <Avatar avatarStyle={{ borderRadius: 10 }} containerStyle={{ height: 50, width: 50 }} source={{
                uri: item.photoURL
                    || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png'
            }} />
            <ListItem.Content>
                {renderContent()}

                {/* <Right>
                   
                </Right> */}

            </ListItem.Content>
        </ListItem>
    )
}
export default ItemShareFollowers;