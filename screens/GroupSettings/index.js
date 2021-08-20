import React, { useLayoutEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { CheckBox, Button } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { selectPage, setPage } from '../../redux/features/pageSlice';
import { styles } from './styles';

const GroupSettings = ({ navigation }) => {
	const [ privacy, setPrivacy ] = useState('');
	const dispatch = useDispatch();
	const page = useSelector(selectPage);
	const [ invite, setInvite ] = useState(false);
	const [ checkBoxes, setCheckBoxes ] = useState([
		{
			id: 0,
			title: 'Tech',
			checked: false
		},
		{
			id: 1,
			title: 'Fashions',
			checked: false
		},
		{
			id: 2,
			title: 'Facts',
			checked: false
		},
		{
			id: 3,
			title: 'Automobile',
			checked: false
		},
		{
			id: 4,
			title: 'Travel',
			checked: false
		},
		{
			id: 5,
			title: ' Food',
			checked: false
		},
		{
			id: 6,
			title: 'Politics',
			checked: false
		},
		{
			id: 7,
			title: 'Business',
			checked: false
		},
		{
			id: 8,
			title: 'Sports',
			checked: false
		},
		{
			id: 9,
			title: 'Movies',
			checked: false
		},
		{
			id: 10,
			title: 'Lifestyle',
			checked: false
		}
	]);

	const handlePrivacy = (text) => {
		if(text !== ''){
			if(privacy === text){
				setPrivacy('');
			}else{
				setPrivacy(text);
			}
		}
	};
	const toggleCheckbox = (id) => {
		var changedCheckbox = checkBoxes.find((cb) => cb.id === id);
		changedCheckbox.checked = !changedCheckbox.checked;
		 
		let chkboxes = checkBoxes;
		for (let i = 0; i < chkboxes.length; i++) {
			if (chkboxes[i].id === id) {
				chkboxes.splice(i, 1, changedCheckbox);
			}
		}
		setCheckBoxes([]);
		setCheckBoxes(prev => ([...prev, ...chkboxes]));
	};


	const handleGroupInvitations = (text) => {
		if(text !== ''){
			if (invite === text) {
				setInvite('');
			} else {
				setInvite(text);
			}
		}
	};

	useLayoutEffect(
		() => {
			navigation.setOptions({
				headerTitle: 'Page Settings',
				headerTitleAlign: 'center'
			});
		},
		[ navigation ]
	);

	const handlePress = () =>{
		 var t = checkBoxes.filter((cb) => cb.checked === true);
		dispatch(setPage({
			name: page.name,
			description: page.description,
			privacy: privacy,
			invite: page.invite,
			types: t 
		}))
		navigation.navigate('Invite')
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.box}>
				<Text style={styles.heading}>Privacy Options</Text>
				<View style={styles.info}>
					<CheckBox
						center
						title="This is a public page"
						checkedIcon="dot-circle-o"
						uncheckedIcon="circle-o"
						checked={privacy === "public"}
						onPress={() => handlePrivacy('public')}
					/>
					<View style={styles.list}>
						<Text style={styles.text}>{'\u2022'} Any user can join this page.</Text>
						<Text style={styles.text}>
							{'\u2022'} This page will be listed in the pages directory and in search results.
						</Text>
						<Text style={styles.text}>
							{'\u2022'} Page content and activity will be visible to any user.
						</Text>
					</View>
				</View>
				<View style={styles.info}>
					<CheckBox
						center
						title="This is a private page"
						checkedIcon="dot-circle-o"
						uncheckedIcon="circle-o"
						checked={privacy === "private"}
						onPress={() => handlePrivacy('private')}
					/>
					<View style={styles.list}>
						<Text style={styles.text}>
							{'\u2022'} Only users who request to follow and are accepted can join the page.
						</Text>
						<Text style={styles.text}>
							{'\u2022'} This page will be listed in the pages directory and in search results.
						</Text>
						<Text style={styles.text}>
							{'\u2022'} Page content and activity will only be visible to followers of the page.
						</Text>
					</View>
				</View>
				<View style={styles.info}>
					<CheckBox
						center
						title="This is a hidden page"
						checkedIcon="dot-circle-o"
						uncheckedIcon="circle-o"
						checked={privacy === "hidden"}
						onPress={() => handlePrivacy('hidden')}
					/>
					<View style={styles.list}>
						<Text style={styles.text}>{'\u2022'} Only users who are invited can join the page.</Text>
						<Text style={styles.text}>
							{'\u2022'} This page will not be listed in the pages directory or search results.
						</Text>
						<Text style={styles.text}>
							{'\u2022'} Page content and activity will only be visible to followers of the page.
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.box}>
				<Text style={styles.heading}>Page Types</Text>
				<Text style={[ styles.text, { color: 'black' } ]}>Select the types this page should be a part of.</Text>
				{checkBoxes.map((cb) => (
					<CheckBox
						key={cb.id}
						title={cb.title}
						checked={checkBoxes[cb.id].checked === true || cb.checked === true}
						onPress={() => toggleCheckbox(cb.id)}
					/>
				))}
			 
			</View>

			<View style={styles.box}>
				<Text style={styles.heading}>Which members of this page are allowed to invite others?</Text>
				<CheckBox
					title="All page followers"
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={invite === 'all'}
					onPress={() => handleGroupInvitations('all')}
				/>
				<CheckBox
					title="Page admins and mods only"
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={invite === 'admin_and_modes'}
					onPress={() => handleGroupInvitations('admin_and_modes')}
				/>
				<CheckBox
					title="Page admins only"
					checkedIcon="dot-circle-o"
					uncheckedIcon="circle-o"
					checked={invite === 'admins'}
					onPress={() => handleGroupInvitations('admins')}
				/>
			</View>

			<Button
				buttonStyle={{ margin: 20, backgroundColor: '#49cbe9',height: 50}}
				onPress={() => handlePress()}
				title="Next"
			/>
		</ScrollView>
	);
};

export default GroupSettings;

