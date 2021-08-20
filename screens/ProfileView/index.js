import React, { useLayoutEffect } from 'react'
import { StyleSheet, Text, View,FlatList,TouchableOpacity ,Image} from 'react-native';
import {ListItem, Avatar,Button} from 'react-native-elements';
import moment from 'moment';
 


const ProfileView = ({navigation,route}) => {
    var visitors = route?.params?.profileViewers;
    const circleNames = route?.params?.circleNames
    const text = route?.params?.text
    const data = visitors || circleNames
    const todos = route?.params?.todos
    const compliments = route?.params?.compliments;
    const mentions = route?.params?.mentions


    // console.log('data-->',(todos?.[0].description));
// 
    useLayoutEffect(() =>{
        navigation.setOptions({
            headerTitle: text,
            headerTitleAlign: "center"
        })
    },[navigation])

  
    const CircleList = ({circleNames}) =>{
        return(
            <>
                <FlatList
                        data={circleNames}
                        keyExtractor={(item) => item?.circledBy?.uid}
                        renderItem={({item}) =>
                        <View>
                            {
                                // console.log('item-->',item.names);
                                item?.names?.map((name,i) =>(
                                    // console.log('i-->',name),
                                    <ListItem key={i} bottomDivider>
                                        <Avatar avatarStyle={{borderRadius: 10}} containerStyle={{height: 50, width:50}} source={{uri: item?.circledBy?.photoURL}} />
                                        <ListItem.Content>
                                            <ListItem.Title style={{fontSize: 16}}>{item?.circledBy?.displayName} added  you in circle {name}</ListItem.Title>
                                        </ListItem.Content>
                                </ListItem>
                                ))
                            }
                                </View>
                    }
                    />
                </>
        )
    }

    const VisitorList = ({visitors}) =>{
        return(
            <>
                <FlatList 
                    data={visitors}
                    keyExtractor={(item) => item?.uid}
                    renderItem = {({item}) => 
                        <ListItem onPress={() => navigation.navigate("UserProfile", {user : item})} key={item?.uid} bottomDivider>
                            <Avatar avatarStyle={{borderRadius: 10}} containerStyle={{height: 50, width:50}} source={{ uri: item?.photoURL || item?.circledBy?.photoURL 
                                || 'https://www.nicepng.com/png/detail/128-1280406_TouchableOpacity-user-icon-png-user-circle-icon-png.png'
                            }} />
                            <ListItem.Content>
                                <ListItem.Title style={{fontSize: 19}}>{item?.displayName || item?.name}</ListItem.Title>
                            </ListItem.Content>
                        </ListItem>
                }
                /> 
            </>
        )
    }


    const TodoList = ({todos}) =>{
        return(
            <>
                <FlatList
                    data={todos}
                    keyExtractor={(item) => item.id}
                    renderItem = {({item}) =>
                    // console.log('item--->',item)
                    // <Text>{item.title}</Text>
                    // (
                        <View>
                            {!item?.completed ? 
                            <ListItem bottomDivider>
                                <Text style={{color: "red"}}>Due {moment(todos?.[0]?.timestamp).fromNow()} |</Text>
                                <ListItem.Title>{item?.title}</ListItem.Title>
                            </ListItem>
                            : null
                        }
                        </View>
                        // )  
                    // console.log('item-->',item)
                    }

                />
            </>
        )
    }


    const Compliment = ({compliments}) =>{
        return(
            <>
                <FlatList 
                    data={compliments}
                    keyExtractor={(item) => item?.emoji?.id}
                    renderItem={({item}) =>
                        <View style={{flexDirection: "row", alignItems:"center"}}>
                             <Image style={{width: 100, height: 100}} source={{uri: item?.emoji?.url}} />
                            <Text style={{fontWeight: "bold", fontSize: 18}}>{item.sentBy.displayName}</Text> 
                            {item?.message ? <Text style={{fontSize: 18}}>: {item?.message}</Text> : null}
                        </View>
                    }
                />
            </>
        )
    }

    

    const Mentions = ({mentions}) =>{
        const handleReply = () =>{

        }

        const handleViewPost = (postId, userId) =>{
            console.log('postId-->',postId);
            console.log('userId-->',userId);
            navigation.navigate('ViewPost', {postId: postId, userId: userId})
        }
     
     
        return(
            <>
                <FlatList 
                    data={mentions}
                    keyExtractor={(item) => item?.id}
                    renderItem={({item}) => 
                    <View>
                        <ListItem key={item?.id} bottomDivider>
                            <Avatar avatarStyle={{borderRadius: 10}} containerStyle={{height: 50, width:50}} source={{uri: item?.mentionedBy?.photoURL}} />
                            <ListItem.Content>
                                <ListItem.Title style={{fontSize: 16}}>{item?.mentionedBy?.displayName} mentioned you in a comment.</ListItem.Title>
                            </ListItem.Content>
                        <View style={{flexDirection:"row"}}>
                            <Button onPress={() => handleViewPost(item.postId, item.userId)} buttonStyle={{backgroundColor:"gray"}} title="View Post" />
                            <Button onPress={handleReply} buttonStyle={{marginLeft: 5}} title="Reply" />
                        </View>
                        </ListItem>
                    </View>        
                
                    }
                />
            </>
        )
    }

    const If = ({ condition, children }) => {
        if (condition) {
          return children;
        }else{
            return(
                <View>
                </View>
            )
        }
      };
    

 

    return (
        <View style={{flex: 1, backgroundColor:"#ffffff"}}>
             <If condition={text === "TodoList"}>
                <TodoList todos={todos} />
            </If>
            <If condition={text === "Your Visitors"}>
                <VisitorList visitors={visitors} />
            </If>
            
            <If condition={text === "Circles"}>
                <CircleList circleNames={circleNames} />
            </If>
            <If condition={text === "Compliments"}>
                <Compliment compliments={compliments} />
            </If>
            <If condition={text === "Mentions"}>
                <Mentions mentions={mentions} />
            </If>
        </View>
    )
}

export default ProfileView

const styles = StyleSheet.create({})
