import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    LogBox,
    ImageBackground
} from 'react-native';
import { db } from '../../firebase';
import * as firebase from 'firebase';
export default function SelectOption({ vote, voted, userId, photo, content, childrenOne, childrenTwo }) {

    LogBox.ignoreLogs(["evaluating 'docData.find"]);

    const [voteAvailable, setVoteAvailable] = useState(vote);

    const [votes1Qtt, setVotes1Qtt] = useState([]);
    const [votes2Qtt, setVotes2Qtt] = useState([]);

    const loadVotes = async (id) => {
        const voteValues = db
            .collection('users')
            .doc(userId)
            .collection('stories').doc(`${id}`);

        var doc = await voteValues.get();
        if (!doc.exists) {
            console.log('nada');
        }

        let docData = doc.data().votes;

        if (docData) {
            setVotes1Qtt([docData.find(ad => ad.photo === 1).userId]);
        }

        if (docData) {
            setVotes2Qtt([docData.find(ad => ad.photo === 2).userId]);
        }
    }

    useEffect(() => {
        setVotes1Qtt([]);
        setVotes2Qtt([]);
        if(vote == true){
            loadVotes(content.id);
        }
    }, [content, photo]);


    const percentage = (photo1Votes, photo2Votes) => {
        var result = photo1Votes * 100 / (photo2Votes + photo1Votes);
        var result2 = photo2Votes * 100 / (photo2Votes + photo1Votes);

        if (isNaN(result) && isNaN(result2)) {
            return { 1: '0%', 2: '0%' };
        }

        return { 1: `${result.toString()}%`, 2: `${result2.toString()}%` };
    }

    const incrementVote = (photoId) => {
        const unsubscribe = db.collection('users').doc(`${userId}`).collection('stories').doc(`${content.id}`).update({
            "votes": firebase.firestore.FieldValue.arrayUnion({
                photo: photoId,
                userId: userId
            })
        }, { merge: true });
        setVoteAvailable(false);
        return unsubscribe;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.description}>Which is your favorite?</Text>
            </View>
            <View style={styles.content}>
                {
                    (vote !== true) ?
                        <>
                            {
                                childrenOne
                            }
                            {
                                childrenTwo
                            }
                        </>
                        :
                        <>
                            <TouchableOpacity style={styles.card} onPress={() => {
                                incrementVote(1);
                            }}
                                activeOpacity={0.7}
                            >
                                {voted ?
                                    <>
                                        <ImageBackground source={{ uri: photo.find(id => id.idPhoto == 1).url }} style={styles.imageBackground} imageStyle={{ borderRadius: 8 }}>
                                        </ImageBackground>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image source={require('../../assets/heart.png')} style={{height: 25, width: 25}}/>
                                            <Text style={styles.percentageNumber}> {percentage(votes1Qtt.length, votes2Qtt.length)?.[1]} </Text>
                                        </View>
                                    </>
                                    :
                                    <Image source={{ uri: photo.find(id => id.idPhoto == 1).url }} style={styles.imageBackground} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.card} onPress={() => {
                                incrementVote(2);
                            }}
                                activeOpacity={0.7}
                            >
                                {voted ?
                                    <>
                                        <ImageBackground source={{ uri: photo.find(id => id.idPhoto == 2).url }} style={styles.imageBackground} imageStyle={{ borderRadius: 8 }}>
                                        </ImageBackground>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Image source={require('../../assets/heart.png')} style={{height: 25, width: 25, tintColor: '#7f0e7f'}}/>
                                            <Text style={styles.percentageNumber}> {percentage(votes1Qtt.length, votes2Qtt.length)?.[2]} </Text>
                                        </View>
                                    </>
                                    :
                                    <Image source={{ uri: photo.find(id => id.idPhoto == 2).url }} style={styles.imageBackground} />
                                }
                            </TouchableOpacity>
                        </>
                }
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 5,
        alignSelf: 'center',
        height: 250,
        width: "80%",
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderColor: 'white',
        alignItems: 'center',
        top: '33%',
        left: '10%',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: 'black',
        width: '100%',
        height: 50,
        borderTopStartRadius: 12,
        borderTopRightRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1
    },
    content: {
        flexDirection: 'row',
        height: 200,
        width: "100%",
        backgroundColor: 'white',
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10,
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        opacity: 1
    },
    description: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    card: {
        height: "80%",
        width: "48%",
        marginRight: 10,
        // backgroundColor: 'gray',
        justifyContent: "center",
        alignItems: 'center',
        borderRadius: 8
    },
    imageBackground: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    percentageNumber: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    }
});
