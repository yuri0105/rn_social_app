import React, { useEffect, useLayoutEffect, useState } from 'react';
import {  Text, View, TouchableOpacity,ScrollView,SafeAreaView,ImageBackground } from 'react-native';
import { ListItem,CheckBox } from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/features/userSlice';
import * as firebase from 'firebase';
import {LinearGradient} from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import { styles } from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';
// import { CheckBox } from 'react-native-elements'

// import { SwipeListView } from 'react-native-swipe-list-view';
const AddTodo = ({navigation}) => {
    const [todos, setTodos] = useState([{cat:'Business',title:'Brush',wallpaper:require("../../assets/0.png"),description:'want ti brush',due:'Today',isCompleted:false},{cat:'Personal',title:'Bath',wallpaper:require("../../assets/1.jpg"),description:'want ti bath',due:'Today',isCompleted:false},{cat:'Business',title:'Listen class',wallpaper:require("../../assets/3.jpg"),description:'want ti brush',due:'Today',isCompleted:false},{cat:'Personal',title:'break fast',wallpaper:require("../../assets/4.jpg"),description:'want ti bath',due:'Today',isCompleted:false}]);
    var [checkarray,setcheckarray]=useState([false,false])
    // const user = useSelector(selectUser)
    const [completedList, setCompletedList] = useState([]);
  
    // useLayoutEffect(() =>{
    //   navigation.setOptions({
    //     headerTitle: "Todos",
    //     headerTitleAlign: "center"
    //   })
    // },[navigation]);


  useEffect(() =>{
    // setTodos(todos.concat({id:1,title:"Hi",timestamp:"10",completed:'no',description:'ntg'}))
    // console.log("todos are",todos)
    // db.collection("users").doc(user?.uid).collection("todos").orderBy('timestamp', 'desc').onSnapshot((snapshot) =>
    //  setTodos(snapshot.docs.map((doc) =>({
    //     id: doc.id,
    //     title: doc.data().title,
    //     timestamp: doc.data().timestamp,
    //     completed: doc.data().completed,
    //     description: doc.data().description
    //   })))
    // )
  },[]);


  useEffect(() =>{
    if(todos){
      setCompletedList(todos.map((todo) => todo.completed));
    }
  },[todos]);

  const getProgress = () =>{
	  var p =  0;
    var len = completedList.length;
    completedList.map((list) => {
      if(list){
        p=p+(100/len)
      } 
    });
	  return p;
}
 
  const onPressAdd = () =>{
    // if(text === "Add"){
      navigation.navigate("Add Todo", {headerTitle:"Add a Todo"});
    // }
    // else if(text === "Edit"){
    //   console.log('date-->',typeof(new Date(date?.seconds * 1000).toUTCString()));
    //   navigation.navigate("EditTodo",{headerTitle: "Edit a Todo", title:title,description:description, date:new Date(date?.seconds * 1000).toUTCString(),id:id,completed:completed })
    // }
  }

  const onCheck = (id,title,description,timestamp,completed) =>{
      db.collection("users").doc(user?.uid).collection("todos").doc(id).set({
          id:id,
          title:title,
          description:description,
          timestamp: timestamp,
          completed: !completed
      })
  }
  
  const listViewData = todos
    .map((l, i) => ({ key: `${i}`, title: l.title }));

	return (
		<SafeAreaView style={styles.container}>
      {/* <View style={{marginHorizontal: 10}}>
       <LinearGradient colors={['#1E9600', '#FFF200', '#FF0000']} start={[0.0, 0.0]}
          end={[1.0, 1.0]} style={[styles.slider, {width: `${getProgress()}%`}]} />
          <Text style={{marginLeft: 5}}>{getProgress()}%</Text>
      </View> */}
      <ScrollView style={{Width:'100%'}}>
        <View style={{width:'100%',marginLeft:20,marginTop:40}}>
          <Text style={{fontSize:14,fontWeight:'bold',color:'grey'}}>CATEOGERIOUS</Text>
          <ScrollView style={{marginTop:30}} horizontal={true}>
            <View style={{width:200,height:150,backgroundColor:'white',borderRadius:20}}>
            <Text style={{marginLeft:20,marginTop:40,color:'grey',fontWeight:'bold'}}>40 tasks</Text>
            <Text style={{marginLeft:20,marginTop:10,fontSize:20,fontWeight:'bold'}}>Business</Text>
            <View style={{width:180,marginLeft:10,marginTop:10}}>
            <Progress.Bar progress={0.2} width={180}  height={5} color={'#e754ca'} />

            </View>


            </View>
<View style={{width:200,height:150,backgroundColor:'white',borderRadius:20,marginLeft:30}}>
<Text style={{marginLeft:20,marginTop:40,color:'grey',fontWeight:'bold'}}>10 tasks</Text>
            <Text style={{marginLeft:20,marginTop:10,fontSize:20,fontWeight:'bold'}}>Personal</Text>
            <View style={{width:180,marginLeft:10,marginTop:10}}>
            <Progress.Bar progress={0.2} width={180}  height={5} color={'blue'} />

            </View>

            </View>
            <View style={{width:50}}></View>
            <View></View>
            <View></View>
            <View></View>
          </ScrollView>
          <Text style={{marginTop:40,color:'grey',fontWeight:'bold'}}>Today's Tasks</Text>
          <ScrollView style={{width:'90%',marginLeft:0}}>
            <View>
              {
                todos.map((l,i)=>{
                  return(
                    <TouchableOpacity key={i} style={{marginTop:15,borderRadius:20}} 
                    onPress={()=>{
                      navigation.navigate({name:'Edit Todo',params:l})
                    }}
                    >
                     <ImageBackground source={l.wallpaper} style={{width:'100%',height:60,borderRadius:20}} imageStyle={{ borderRadius: 20}}
>
                       
                     <View style={{width:'100%',height:60,borderRadius:20,justifyContent:'center'}}>
                         <View style={{flexDirection:'row',}}>
                           <CheckBox
                           onPress={()=>{
                            let updatedList = todos.map((item,ind) => 
                              {
                                if (ind == i){
                                  return {...item, isCompleted: !item.isCompleted}; //gets everything that was already in item, and updates "done"
                                }
                                return item; // else return unmodified item 
                              });
                              setTodos(updatedList)
                           }}
                           containerStyle={{borderColor:'red'}}
                           checked={l.isCompleted}
                           uncheckedColor={l.cat==='Business'?'#e754ca':'blue'}
                           checkedColor={l.cat==='Business'?'#e754ca':'blue'}
                           />
                           <Text style={l.isCompleted===false?{fontSize:15,justifyContent:'center',marginTop:15,width:100}:{fontSize:15,width:100,justifyContent:'center',marginTop:15,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{l.title}</Text>
                           <Text style={l.isCompleted===false?
                          {fontSize:15,justifyContent:'center',marginTop:15,marginLeft:50}
                        :
                        {fontSize:15,justifyContent:'center',marginTop:15,marginLeft:50,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}
                      }>Due:{l.due}</Text>
                         </View>
                       </View>
                     </ImageBackground>
                    </TouchableOpacity>
                  )
                })
              }
              {/* <SwipeListView
                     data={todos}
                     renderItem={ 
                    ((l,i)=>{
                      console.log(l,i)
                        return(
                          <TouchableOpacity key={i} style={{marginTop:15}}>
                             <View style={{width:'100%',height:60,backgroundColor:'white',borderRadius:20,justifyContent:'center'}}>
                               <View style={{flexDirection:'row',}}>
                                 <CheckBox
                                 onPress={()=>{
                                  let updatedList = todos.map((item,ind) => 
                                    {
                                      if (ind == i){
                                        return {...item, isCompleted: !item.isCompleted}; //gets everything that was already in item, and updates "done"
                                      }
                                      return item; // else return unmodified item 
                                    });
                                    setTodos(updatedList)
                                 }}
                                 containerStyle={{borderColor:'red'}}
                                 checked={l.isCompleted}
                                 uncheckedColor={l.cat==='Business'?'#e754ca':'blue'}
                                 checkedColor={l.cat==='Business'?'#e754ca':'blue'}
                                 />
                                 <Text style={l.isCompleted===false?{fontSize:15,justifyContent:'center',marginTop:15,}:{fontSize:15,justifyContent:'center',marginTop:15,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>{l.title}</Text>
                                 
                               </View>
                             </View>
                          </TouchableOpacity>
                        )
                      })
                }
                  renderHiddenItem={ (data, rowMap) => (
                    <View style={styles.rowBack}>
                    <Text>Left</Text>
                    <Text>Right</Text>
                </View>

                )}
                leftOpenValue={75}
                rightOpenValue={-75}
              /> */}
            </View>

          </ScrollView>
          </View> 
          <Text></Text>
 <Text></Text>
 <Text></Text>
 <Text></Text>
 <Text></Text>
 <Text></Text>
 <Text></Text>
      </ScrollView>
			<ScrollView>
      {/* {
        todos.map((l, i) =>{
          console.log("title is",l.title)
          return (
          
          <ListItem key={i} bottomDivider onPress={() => onPressAdd("Edit", l.title, l.description,l.timestamp,l.id,l.completed)}>
			        <CheckBox checked={l.completed} onPress={() => onCheck(l.id,l.title, l.description,l.timestamp,l.completed)}/>
            <ListItem.Content>
              <ListItem.Title style={{ textDecorationLine: l.completed ? 'line-through' : 'none',}}>{l.title}</ListItem.Title>
              <ListItem.Subtitle>{l.description}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )})
      } */}

        </ScrollView>
        <TouchableOpacity style={{width:50,height:50,position:'absolute',bottom:30,right:30,borderRadius:20,justifyContent:'center',alignItems:'center'}}  onPress={() => onPressAdd("Add")}>
				<AntDesign name="pluscircle" size={45} color="#1E90FF" />
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default AddTodo;

 