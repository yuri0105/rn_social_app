// import React, { useEffect, useLayoutEffect, useState } from 'react'
// import { StyleSheet, Text, View,TextInput } from 'react-native'
// // import { useSelector } from 'react-redux';
// import { db } from '../../firebase';
// import {Input,Button} from 'react-native-elements';
// import { selectUser } from '../../redux/features/userSlice';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { TouchableOpacity } from 'react-native';

// const EditTodo = ({navigation,route}) => {
// 	const [ title, setTitle ] = useState('');
//     const [description, setDescription] = useState('');
//     // const user = useSelector(selectUser);
//     const [date, setDate] = useState(new Date());
//     const [mode, setMode] = useState('date');
//     const [show, setShow] = useState(false);
//     console.log('navigation', navigation)
//     const onChange = (event, selectedDate) => {
//         const currentDate = selectedDate || date;
//         setShow(Platform.OS === 'ios');
//         setDate(currentDate);
//         // console.log('date->',currentDate);
//       };

//       const showMode = (currentMode) => {
//         setShow(true);
//         setMode(currentMode);
//       };

//       const showDatepicker = () => {
//         showMode('date');
//       };




//       const onSubmit = () =>{
//         if(title!=='' && description!==''){
//             console.log('ehy');
//             if(headerTitle === "Add a Todo"){
//                 db.collection("users").doc(user?.uid || firebaseUser?.uid).collection("todos").add({
//                     title: title,
//                     completed: false,
//                     description: description,
//                     timestamp: date
//                 })
//             }else if(headerTitle === "Edit a Todo"){
//                 db.collection("users").doc(user?.uid || firebaseUser?.uid).collection("todos").doc(route?.params?.id).set({
//                     title: title,
//                     completed: false,
//                     description: description,
//                     timestamp: date,
//                     id: route?.params?.id,
//                     completed: route?.params?.completed
//                })
//             }
//             navigation.goBack();
//         }else{

//         }
//     }

//     const headerTitle = route?.params?.headerTitle

//     useLayoutEffect(() =>{
//         navigation.setOptions({
//             headerTitle:headerTitle,
//             headerTitleAlign:"center",

//         })
//     },[navigation]);

//     useEffect(() =>{
//         if(headerTitle  === "Edit a Todo"){
//             setTitle(route?.params?.title);
//             setDate(new Date(route?.params?.date))
//             setDescription(route?.params?.description);
//         }
//       },[navigation]);


//       const onDelete =() =>{
//         navigation.goBack();
//         db.collection("users").doc(user?.uid || firebaseUser?.uid).collection("todos").doc(route?.params?.id).delete().then(() =>{
//               console.log('deleted successfully');
//         })
//       }


//     // console.log('title-->',title);
//     // console.log('description-->',description)



//     return (
//         <View
// 			style={{
// 				flex: 1,
// 				width: '100%',
// 				flexDirection: 'row',
// 				// alignItems: 'center',
// 				paddingRight: 10,
// 				paddingBottom: 5,
// 				paddingTop: 5
// 			}}
// 		>
//             	<View
// 				style={{
// 					flex: 1,
// 					justifyContent: 'flex-start',
// 					alignItems: 'flex-start',
// 					paddingLeft: 25
// 				}}
// 			>
//                  <Input
//                         labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
//                         label="Title"
//                         style={[styles.input, {marginTop: 10}]}
//                         value={title}
//                         onChangeText={setTitle}
//                         autoFocus
//                         autoCapitalize="none"
//                         errorMessage={title==='' ? "Please enter the title" : ''}
//                         // containerStyle={{width: "100%"}}
//                     />
//                      <Input
//                         labelStyle={{ paddingBottom: 5, color: "#49cbe9" }}
//                         label="Description"
//                         style={[styles.input, {marginTop: 10}]}
//                         value={description}
//                         onChangeText={setDescription}
//                         autoFocus
//                         autoCapitalize="none"
//                         numberOfLines={5}
//                         errorMessage={description=== '' ?  "Please enter description" : ''}
//                         // inputStyle={{height: 100}}
//                     />
//                     <View style={{width: "80%", alignSelf:"center"}}>
//                         <Button buttonStyle={{borderRadius: 10,backgroundColor:"#49cbe9", paddingVertical: 15}} title="Due Date" onPress={showDatepicker} />
//                     </View>
//                     {headerTitle === "Edit a Todo" ?
//                         <View style={{width: "80%", alignSelf:"center",paddingTop: 15}}>
//                             <Button onPress={onDelete} buttonStyle={{borderRadius: 10,backgroundColor:"#EB504E", paddingVertical: 15}} title="Delete"/>
//                         </View> : null
//                     }
//                     <View style={{width: "80%", alignSelf:"center",paddingTop: 15}}>
//                         <Button onPress={onSubmit} buttonStyle={{borderRadius: 10,backgroundColor:"#56ab2f", paddingVertical: 15}} title="Done"/>
//                     </View>
//             </View>
//             {show ? (
                // <DateTimePicker
                //     testID="dateTimePicker"
                //     value={date}
                //     mode={mode}
                //     is24Hour={true}
                //     display="default"
                //     onChange={onChange}
                // />
//             ) : null}
//         </View>
//     )
// }

// export default EditTodo

// const styles = StyleSheet.create({
//     input: {
// 		borderWidth: 1,
// 		borderColor: 'black',
// 		padding: 10,
//         width: "100%"
// 	},
// })

import React ,{useRef}from "react";
import { ImageBackground, StyleSheet, Text, View,TouchableOpacity,Image,TextInput,ScrollView,Dimensions } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from 'reanimated-bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';

// var openImagePickerAsync;
import { Picker as SelectPicker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons';
var x=[require("../../assets/0.png"),require("../../assets/1.jpg"),require("../../assets/2.jpg"),require("../../assets/3.jpg"),require("../../assets/4.jpg"),require("../../assets/5.jpg"),require("../../assets/6.jpg")]
// const image =require('../../assets/0.png')
class index extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef(null);
        this.state = {
            imgurl:'',
            categoery:'',
            date:new Date(),
            mode:'date',
            show:0,
            showDue:'select Date',
            sheet:'',
            showBottomSheet:0,
            wallImg:require('../../assets/0.png'),
            whole:x,
            title:'',
            description:'',
            due:'',
            
                  };
    }
    componentDidMount=()=>{
        // console.log("params is",this.props.route.params)
        this.setState({categoery:this.props.route.params.cat,title:this.props.route.params.title,description:this.props.route.params.description,showDue:this.props.route.params.due,wallImg:this.props.route.params.wallpaper})
    }
    renderContent = () => (
        <View
          style={{
            backgroundColor: 'whitesmoke',
            padding: 16,
            height: 750,
          }}
        >
            <View style={{width:50,height:5,backgroundColor:'grey',alignSelf:'center',marginLeft:-20,borderRadius:30}}></View>
            <Text style={{fontSize:14,fontWeight:'bold'}}>Choose wallpaper</Text>
            {/* <ScrollView horizontal style={{marginTop:20}}>
                <View style={{flexDirection:'row'}}>
            {
                this.state.whole.map((l,i)=>{
                    console.log("l is ",l,i);
                    return(
                        // <Text>hloo</Text> 
                        <TouchableOpacity 
                        onPress={()=>{
                            this.setState({wallImg:l})
                        }}
                        >
                        <Image source={l} style={{width:100,height:150,marginLeft:20}} resizeMode="cover"></Image>

                        </TouchableOpacity>

                         )
                })
            }
                </View>
            </ScrollView> */}
            <View style={{flexDirection:'row',marginLeft:40,marginTop:40}}>
                <TouchableOpacity 
                onPress={()=>{
        // console.log("satte is",this.state)
                    
                    this.setState({wallImg:require("../../assets/0.png")})
                }}
                >
                <Image source={require("../../assets/0.png")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/2.jpg")})
                }}
                style={{marginLeft:30}}>
                <Image source={require("../../assets/2.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
            </View>   
            <View style={{flexDirection:'row',marginLeft:40,marginTop:40}}>
                <TouchableOpacity 
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/1.jpg")})
                }}
                >
                <Image source={require("../../assets/1.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/2.jpg")})
                }}
                style={{marginLeft:30}}>
                <Image source={require("../../assets/2.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
            </View>
        
            <View style={{flexDirection:'row',marginLeft:40,marginTop:40}}>
                <TouchableOpacity
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/3.jpg")})
                }}
                >
                <Image source={require("../../assets/3.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/4.jpg")})
                }}
                style={{marginLeft:30}}>
                <Image source={require("../../assets/4.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',marginLeft:40,marginTop:40}}>
                <TouchableOpacity
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/5.jpg")})
                }}
                >
                <Image source={require("../../assets/5.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{
                    this.setState({wallImg:require("../../assets/6.jpg")})
                }}
                style={{marginLeft:30}}>
                <Image source={require("../../assets/6.jpg")} style={{width:120,height:150}} resizeMode="cover"></Image>
                </TouchableOpacity>
            </View>
          {/* <Text>Swipe down to close</Text> */}

        </View>
      );
     openImagePickerAsync =async () => {
         console.log("heheh")
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    
        if (permissionResult.granted === false) {
          alert('Permission to access camera roll is required!');
          return;
        }
    
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        console.log(pickerResult.uri);
        this.state.imgurl=pickerResult.uri
        this.setState({imgurl:this.state.imgurl})
        console.log(this.state.imgurl,"from stte")
      };
      onChange= (event, selectedDate) => {
        this.setState({show:0})
                const currentDate = selectedDate || date;
                // console.log(new Date().getYear())
                // console.log("you selectedddd ",typeof(selectedDate),selectedDate,selectedDate.getDate()+'/'+(selectedDate.getMonth()+1)+'/'+(selectedDate.getYear()+1))
                if(selectedDate.getDate()===new Date().getDate()){
                    this.setState({showDue:'Today'})
                }else{
                    var x=selectedDate.getDate()+'/'+(selectedDate.getMonth()+1)+'/'+new Date().getFullYear()
                    console.log("x is",x,typeof(x))
                    this.setState({showDue:x})
                }
                // setShow(Platform.OS === 'ios');
                // setDate(currentDate);
                // console.log('date->',currentDate);
              };
    render() {
        // const sheetRef = React.useRef(null);
        return (
            <View>
               
            <ScrollView style={styles.container}>
            <ImageBackground source={this.state.wallImg} resizeMode="cover" style={styles.image}>
                <View style={{width:'100%',height:'100%',marginTop:100}}>
       <View style={{width:'100%',alignItems:'center'}}>
           <View style={{width:200,height:200,marginLeft:50}}>
               <View>
                   {
                       this.state.imgurl===''?<View>
               <Image source={require('../../assets/uploadImg.png')} style={{width:150,height:150,borderRadius:100,borderColor:'black',borderWidth:1}}></Image>

                       </View>:<View>
               <Image source={{uri:this.state.imgurl}} style={{width:150,height:150,borderRadius:100,borderColor:'black',borderWidth:1}}></Image>

                       </View>
                   }
               </View>
<TouchableOpacity  style={{marginLeft:100,marginTop:-30,elevation:10}}  onPress={this.openImagePickerAsync}>
<AntDesign name="camera" size={32} color="black" />

</TouchableOpacity>
           </View>
       </View>
       <View style={{width:'100%',marginLeft:20}}>
           <View style={{width:'100%'}}></View>

         <Text style={{fontSize:15,fontWeight:'bold'}}>Categoery</Text>
         <View
                    style={{
                        width: '90%',
                        height:40,
                        marginTop: 10,
                        marginLeft:1,
                        // marginRight:20,
                        borderColor: 'black',
                        borderWidth:1,
                        borderRadius: 10,
                        // alignSelf: 'center'
                    }}>
                    <SelectPicker
                    style={{ height: 40, width: '100%' }}
                        selectedValue={this.state.categoery}
                        onValueChange={(i)=>{this.setState({categoery:i})}}
                    >
                        <SelectPicker.Item label="Bussiness" value="Male" />
                        <SelectPicker.Item label="Personal" value="Female" />
                    </SelectPicker>
                </View>
                
         <Text style={{fontSize:15,fontWeight:'bold',marginTop:20}}>Title</Text>
         <View
                    style={{
                        width: '90%',
                        height:40,
                        marginTop: 10,
                        marginLeft:1,
                        // marginRight:20,
                        borderColor: 'black',
                        borderWidth:1,
                        borderRadius: 10,
                        // alignSelf: 'center'
                    }}>
             <TextInput  
             value={this.state.title}
             ></TextInput>
                </View>
         <Text style={{fontSize:15,fontWeight:'bold',marginTop:20}}>Description</Text>
         <View
                    style={{
                        width: '90%',
                        height:90,
                        marginTop: 10,
                        marginLeft:1,
                        // marginRight:20,
                        borderColor: 'black',
                        borderWidth:1,
                        borderRadius: 10,
                        // alignSelf: 'center'
                    }}>
             <TextInput multiline={true}
             value={this.state.description}
             ></TextInput>
                </View>
                <Text style={{fontSize:15,fontWeight:'bold',marginTop:20}}>Due</Text>
                <TouchableOpacity
                  style={{
                    width: '90%',
                    height:40,
                    marginTop: 10,
                    marginLeft:1,
                    // marginRight:20,
                    borderColor: 'black',
                    borderWidth:1,
                    justifyContent:'center',
                    borderRadius: 10,
                    // alignSelf: 'center'
                }}
                onPress={()=>{
               this.setState({show:1});
                }}
                >   
                  <Text style={{marginLeft:10}}>{this.state.showDue}</Text>
                  
                </TouchableOpacity>
     <View style={{flexDirection:'row',alignSelf:'center'}}>
     <TouchableOpacity
           style={{width:130,height:40,backgroundColor:'#1E90FF',justifyContent:'center',alignItems:'center',marginTop:20,marginLeft:-30,borderRadius:10}}
           >
               <Text style={{color:'white',fontSize:15}}>Save Changes</Text>
           </TouchableOpacity>
           <TouchableOpacity
           style={{width:130,height:40,backgroundColor:'red',justifyContent:'center',alignItems:'center',marginTop:20,marginLeft:-30,borderRadius:10,marginLeft:30}}
           >
               <Text style={{color:'white',fontSize:15}}>Delete Todo</Text>
           </TouchableOpacity>
     </View>
       </View>
              </View>
            </ImageBackground>
            <View>{
                this.state.show===0?<View></View>:<DateTimePicker
                testID="dateTimePicker"
                value={this.state.date}
                mode={this.state.mode}
                is24Hour={true}
                display="default"
                onChange={this.onChange}
            />
    }</View>
      
          </ScrollView>
          <TouchableOpacity
          onPress={()=>{
            //   console.log("this.myRef",this.myRef)
            this.myRef.current.snapTo(0)
          }}
          style={{backgroundColor:'#00FF7F',width:40,height:40,position:'absolute',bottom:30,right:30,borderRadius:20,justifyContent:'center',alignItems:'center'}}>
          <MaterialIcons name="wallpaper" size={20} color="white" />

</TouchableOpacity>
<BottomSheet
        ref={this.myRef}
        snapPoints={[300,200 ,0]}      
        renderContent={this.renderContent}
        // enabledContentGestureInteraction={false}
        // enabledGestureInteraction={true}
        enabledContentTapInteraction={false}

        // enabledInnerScrolling={true}    
        // enabledGestureInteraction={true}
      />
          </View>
        );
    }
}

export default index;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width:'100%',
    height:'100%'
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    marginTop:300,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

// export default App;