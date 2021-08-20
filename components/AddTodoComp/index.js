import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { CheckBox, Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

const AddTodoComp = ({ onBlur, onAdd }) => {
	const [ title, setTitle ] = useState('');
	// const [ completed, setCompleted ] = useState(false);

	const onSubmit = () => {
		if (title.length > 0)
			onAdd({
				title: title,
				completed: false
			});
		return null;
	};

	return (
		<View
			style={{
				flex: 1,
				width: '100%',
				flexDirection: 'row',
				alignItems: 'center',
				paddingRight: 10,
				paddingBottom: 5,
				paddingTop: 5
			}}
		>
			{/* <CheckBox checked={completed} onPress={() => setCompleted(!completed)} /> */}
			<View
				style={{
					flex: 1,
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					paddingLeft: 25
				}}
			>
				<TextInput
					style={{ width: '90%' }}
					placeholder="What needs to be done?"
					autoFocus
					underLineColorAndroid="transparent"
					underlineColor="transparent"
					blurOnSubmit
					onSubmitEditing={onSubmit}
					onChangeText={(changedTitle) => setTitle(changedTitle)}
					value={title}
					autoCorrect={false}
					autoCapitalize="none"
					onBlur={onBlur}
				/>
			</View>
			{/* <TouchableOpacity
				//   onPress={() => this.props.onCancelDelete}
				style={{ paddingLeft: 25, paddingRight: 15 }}
			>
				<Ionicons name="ios-trash" color={`${title.length > 0 ? 'black' : 'grey'}`} size={23} />
			</TouchableOpacity> */}
		</View>
	);
};

export default AddTodoComp;

const styles = StyleSheet.create({});
