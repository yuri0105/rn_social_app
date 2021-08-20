import React, { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'react-native';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { CheckBox, Input, Text, Button } from 'react-native-elements';
import * as firebase from 'firebase';
// import { auth } from '../../firebase';
import { SafeAreaView } from 'react-native';
import { db } from '../../firebase';

const Login = ({ navigation, route }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checked, setChecked] = useState(false);
	const [username, setUsername] = useState('');
	const isValidPassword = password?.length >= 6 ? true : false;
	const passwordError = !isValidPassword ? "Password length should be atleast 6" : '';

	// console.log('Login direect', route.params.loginDirect);

	const handleCheck = () => {
		setChecked(!checked);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false
		})
	}, [navigation])

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
			// console.warn(authUser);
			if (authUser?.email) {
				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'Socially',
							params: { screen: 'Home' },
						},
					],
				})
			}
		});
		return unsubscribe;
	}, []);

	const login = () => {
		if (route.params?.loginDirect === true) {
			firebase.auth().signInWithEmailAndPassword(email, password)
				.then((userCredential) => {
					// Signed in
					var user = userCredential.user;
					const refUser = db.collection('users')
						.doc(user?.uid)
					if (!refUser.exists) {
						db.collection('users').add({
							"displayName": user.displayName,
							"email": user.email,
							"photoURL": user.photoURL,
							"uid": user.uid,
						})
					}

					// console.log('user is signed in -->', user);
					// ...
				})
				.catch((error) => {
					var errorCode = error.code;
					var errorMessage = error.message;
					console.log(errorMessage)
				});
		} else {

			firebase.auth().currentUser.updateProfile({
				displayName: username || ''
			})
			// firebase.auth().createUserWithEmailAndPassword(email, password).
			// 	then((userCredential) => {
			// 		// Signed in 
			// 		var user = userCredential.user;
			// 		const refUser = db.collection('users')
			// 			.doc(user?.uid)
			// 		if (!refUser.exists) {
			// 			db.collection('users').add({
			// 				"displayName": username,
			// 				"email": user.email,
			// 				"photoURL": user.photoURL,
			// 				"uid": user.uid,
			// 			})
			// 		}
			// 	})
			// 	.catch(function (error) {
			// 		var errorCode = error.code;
			// 		var errorMessage = error.message;
			// 	});

			var credential = firebase.auth.EmailAuthProvider.credential(email, password);
			firebase.auth().currentUser
				.linkWithCredential(credential)
				.then(function async(usercred) {
					var user = usercred.user;

					console.log('Account linking success', user);
				})
				.catch(function (error) {
					console.log('Account linking error', error);
				});

			navigation.reset({
				index: 0,
				routes: [
					{
						name: 'Socially',
						params: { screen: 'Home' },
					},
				],
			})
			console.log('login');





		}




	};

	const create = () => {
		console.log('create');
	};

	const forgotPassword = () => {
		console.log('forgot');
	};

	return (
		<KeyboardAvoidingView style={styles.container}>
			<SafeAreaView>
				<StatusBar style="auto" />
				<View style={styles.loginHeader}>
					<Text style={styles.loginHeaderText}>LOGIN</Text>
				</View>

				<View style={styles.inputContainer}>
					<Input
						label="Email"
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						value={email}
						onChangeText={setEmail}
						inputContainerStyle={{ borderStyle: 'dotted' }}
						autoFocus
						type="email"
						style={styles.input}
						autoCapitalize="none"
					/>
					{!route.params?.loginDirect ? (
						<Input
							label="Username"
							inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
							labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
							value={username}
							onChangeText={setUsername}
							inputContainerStyle={{ borderStyle: 'dotted' }}
							autoFocus
							type="name"
							style={styles.input}
							autoCapitalize="none"
						/>

					) : null}

					<Input
						label="Password"
						errorMessage={passwordError}
						inputStyle={{ borderWidth: 1, borderColor: 'gray' }}
						onChangeText={setPassword}
						labelStyle={{ marginBottom: 5, fontWeight: '300', color: 'gray' }}
						secureTextEntry
						type="password"
						style={styles.input}
						autoCapitalize="none"
						inputContainerStyle={{ borderStyle: 'dotted' }}
						onSubmitEditing={login}
					/>

				</View>
				<View style={styles.bottom}>
					<View style={styles.login}>
						<Button
							style={styles.loginButton}
							title="LOG IN"
							buttonStyle={{ width: 250, backgroundColor: '#49cbe9' }}
							onPress={login}
						/>
					</View>

					<View>
						<Button
							style={styles.otherButton}
							type="outline"
							title="LOST PASSWORD ?"
							titleStyle={{ color: 'gray' }}
							buttonStyle={{ borderWidth: 0, width: 250 }}
							onPress={forgotPassword}
						/>
					</View>
				</View>
				<View style={{ height: 50 }} />
			</SafeAreaView>
		</KeyboardAvoidingView>
	);
};

export default Login;

const styles = StyleSheet.create({
	container: {
		height: '100%',

		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		color: 'black',
		backgroundColor: "white"
	},
	loginHeader: {
		marginBottom: 30,
		padding: 10,
		backgroundColor: 'gray',
		borderRadius: 5,
		paddingHorizontal: 20
	},
	loginHeaderText: {
		color: 'white',
		fontWeight: '300',
		fontSize: 30,
		alignSelf: "center"
	},
	inputContainer: {
		width: 330,
		marginTop: 20,
		marginBottom: 20
	},
	input: {
		padding: 10
	},
	rememberMe: {
		color: 'black',
		flexDirection: 'row',
		alignItems: 'center',
		width: 300,
		alignSelf: 'center'
	},
	rememberMeText: {},

	otherButton: {
		backgroundColor: 'transparent',
		color: 'white'
	},
	login: {
		flexDirection: 'column',
		padding: 10,
		marginBottom: 10
	},
	bottom: {
		alignSelf: "center"
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		width: '100%',
		height: 220,
		margin: 0,
		alignItems: 'center'
	}
});
