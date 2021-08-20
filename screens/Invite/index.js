import React, { useLayoutEffect, useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers } from '../../redux/features/usersSlice';
import { selectUser } from '../../redux/features/userSlice';
import { selectPage, setPage } from '../../redux/features/pageSlice';
import { db } from '../../firebase';
import * as firebase from 'firebase';
import { styles } from './styles';

const Invite = ({ navigation }) => {
	const users = useSelector(selectUsers);
	const user = useSelector(selectUser);
	const page = useSelector(selectPage);
	const firebaseUser = firebase.auth().currentUser;
	const [ check, setCheck ] = useState([]);
	const dispatch = useDispatch();
	const [id, setId] = useState(null);


	const handleDone =() =>{
		var arr =  check.filter((cb) => cb.checked === true);
		db.collection("users").doc(user?.uid).collection("page").add({
			name: page.name,
			description: page.description, 
			privacy: page.privacy,
			invite: arr,
			types: page.types 
	   }).then((doc) => setId(doc.id));

	   dispatch(setPage({
		name: page.name,
		description: page.description,
		privacy: page.privacy,
		invite: arr,
		types: page.types,
		id: id
	}))
	   navigation.navigate("Settings");
	}

	useLayoutEffect(
		() => {
			navigation.setOptions({
				headerTitle: 'Send Invites',
				headerTitleAlign: 'center',
				headerRight: () =>(
					<TouchableOpacity style={{margin: 10}} onPress={() => handleDone()}>
						<Text style={{fontSize: 18, color:'#49cbe9'}}>Done</Text>
					</TouchableOpacity>
				)
			});
		},
		[ navigation ]
	);

	const handleInvite = (id) => {
		if (check.length > 0) {
			var changedCheck = check.find((cb) => cb.id === id);
			if (changedCheck) {
				changedCheck.checked = !changedCheck.checked;

				let chkes = check;
				for (let i = 0; i < chkes.length; i++) {
					if (chkes[i].id === id) {
						chkes.splice(i, 1, changedCheck);
					}
				}
				setCheck([]);
				setCheck((prev) => [ ...prev, ...chkes ]);
			} else {
				setCheck((prev) => [
					...prev,
					{
						id: id,
						checked: true
					}
				]);
			}
		} else {
			setCheck((prev) => [
				...prev,
				{
					id: id,
					checked: true
				}
			]);
		}
	};


	return (
		<View style={{ backgroundColor: 'white', flex: 1 }}>
			<View style={styles.search}>
				<Input
					placeholder="Search"
					leftIcon={<AntDesign name="search1" size={24} color="gray" />}
					inputContainerStyle={{ borderBottomWidth: 0 }}
				/>
			</View>
			<View style={styles.list}>
				<FlatList
					data={users}
					keyExtractor={(item) => item.uid}
					renderItem={({ item }) => (
						<View>
							{item.uid !== user.uid ? (
								<TouchableOpacity onPress={() => handleInvite(item.uid)} style={styles.container}>
									<CheckBox checked={
									(check?.filter((cb) => cb.id === item.uid)?.[0]?.id === item.uid) && 
									check?.filter((cb) => cb.id === item.uid)?.[0]?.checked
										} />
									<Image
										source={{ uri: item.photoURL }}
										style={{ height: 70, width: 70, borderRadius: 70 }}
									/>
									<Text style={styles.text}>{item.displayName}</Text>
								</TouchableOpacity>
							) : null}
						</View>
					)}
				/>
			</View>
		</View>
	);
};

export default Invite;

 