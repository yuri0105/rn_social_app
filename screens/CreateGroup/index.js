import React, { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { setPage } from '../../redux/features/pageSlice';
import { styles } from './styles';

const CreateGroup = ({navigation}) => {
	const [ name, setName ] = useState('');
	const [ description, setDescription ] = useState('');
	const isNotValid = name === '' || description === '';
	const errorMessage = isNotValid ? 'This Field is Required' : '';
	const dispatch = useDispatch();

	useLayoutEffect(() =>{
		navigation.setOptions({
			headerTitleAlign: "center",
			headerTitle: "Create Page"
		})
	},[navigation]);

	const handlePress = () => {
		if(name && description){
			dispatch(setPage({
				name: name,
				description: description
			}))
			navigation.navigate("GroupSettings");
		}
    };

	return (
		<KeyboardAvoidingView style={{flex:1, backgroundColor: "white"}}>
			<ScrollView style={styles.container}>
				<Input
					labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
					label="Page Name"
					style={[ styles.input ]}
					value={name}
					onChangeText={setName}
					autoFocus
					errorMessage={errorMessage}
					autoCapitalize="none"
					inputContainerStyle={{margin: 10}}
				/>
				<Input
					onChangeText={(text) => setDescription(text)}
					value={description}
					label="Page Description"
					inputContainerStyle={{ height: 40 }}
					labelStyle={{ paddingBottom: 5, color: '#49cbe9', margin: 10 }}
                    autoFocus
					errorMessage={errorMessage}
					autoCapitalize="none"
					inputContainerStyle={{margin: 10}}
				/>
				<Button
					title="Create Page And Continue"
					buttonStyle={{ backgroundColor: '#49cbe9', margin: 20, height: 50 }}
					onPress={() => handlePress()}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default CreateGroup;

