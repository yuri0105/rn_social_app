import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	ActivityIndicator,
	FlatList,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	TouchableOpacity,
	Platform,
	SafeAreaView,
	Modal,
	Alert,
	TextInput,
	Image
} from 'react-native';
import { Text, Button } from 'react-native-elements';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import * as firebase from 'firebase';
import { Countries } from '../../Countries';
import styles from './styles';
import { auth } from '../../firebase'


const FIREBASE_CONFIG = {
	apiKey: "AIzaSyAF8G-PkCy4u7y-ZbrO5k22gzni-X4U4lM",
	authDomain: "socially-dd898.firebaseapp.com",
	projectId: "socially-dd898",
	storageBucket: "socially-dd898.appspot.com",
	messagingSenderId: "195286176803",
	appId: "1:195286176803:web:28d7d216d2cf5c7e5bcd96",
	measurementId: "G-BSP507SDEB"
};

try {
	if (FIREBASE_CONFIG.apiKey) {
		firebase.initializeApp(FIREBASE_CONFIG);
	}
} catch (err) {
	// ignore app already initialized error on snack
}


const MobileVerification = ({ navigation }) => {
	let clockCall = null;
	const recaptchaVerifier = React.useRef(null);
	const verificationCodeTextInput = React.useRef(null);
	const firebaseConfig = firebase.app().options;
	// console.log('config-->', firebaseConfig);
	const attemptInvisibleVerification = false;
	const defaultCodeCountry = '+91';
	let textInput = useRef(null);
	const defaultMaskCountry = '99999 99999';
	const [phoneNumber, setPhoneNumber] = useState('');
	const [verificationId, setVerificationId] = React.useState();
	const [verificationCode, setVerificationCode] = React.useState();
	const [verifyInProgress, setVerifyInProgress] = React.useState(false);
	const [verifyError, setVerifyError] = React.useState();
	const [confirmError, setConfirmError] = React.useState();
	const [confirmInProgress, setConfirmInProgress] = React.useState(false);
	const [internalVal, setInternalVal] = useState('');
	const defaultCountDown = 30;
	const [countDown, setCountDown] = useState(defaultCountDown);
	const [enableResend, setEnableResend] = useState(false);
	const [focusInput, setFocusInput] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [dataCountries, setDataCountries] = useState(Countries);
	const [codeCountry, setCodeCountry] = useState(defaultCodeCountry);
	const [placeholder, setPlaceholder] = useState(defaultMaskCountry);



	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => setLoading(false), 2000);
	}, []);





	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
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


	const onShowHideModal = () => {
		setModalVisible(!modalVisible);
		console.log(modalVisible);
	};

	const onChangePhone = (number) => {
		setPhoneNumber(number);
	};


	const onPressContinue = async () => {
		if (phoneNumber) {
			const phoneProvider = new firebase.auth.PhoneAuthProvider();
			try {
				setVerifyError(undefined);
				setVerifyInProgress(true);
				setVerificationId('');
				const verificationId = await phoneProvider.verifyPhoneNumber(
					codeCountry + phoneNumber,
					// @ts-ignore
					recaptchaVerifier.current
				);
				setVerifyInProgress(false);
				setVerificationId(verificationId);
				verificationCodeTextInput.current?.focus();



			} catch (err) {
				setVerifyError(err);
				setVerifyInProgress(false);
			}
		}
	};

	const onChangeFocus = () => {
		setFocusInput(true);
	};

	const onChangeBlur = () => {
		setFocusInput(false);
	};

	const onCountryChange = (item) => {
		setCodeCountry(item.dialCode);
		setPlaceholder(item.mask);
		onShowHideModal();
	};

	useEffect(() => {
		if (verificationId) {
			clockCall = setInterval(() => {
				decrementClock();
			}, 1000);

			return () => {
				clearInterval(clockCall);
			};
		}
	});

	const decrementClock = () => {
		if (countDown === 0) {
			setEnableResend(true);
			setCountDown(0);
			clearInterval(clockCall);
		} else {
			setCountDown(countDown - 1);
		}
	};

	const onResendOTP = () => {
		if (enableResend) {
			setCountDown(defaultCountDown);
			setEnableResend(false);
			clearInterval(clockCall);
			clockCall = setInterval(() => {
				decrementClock();
			}, 1000);
		}
	};

	const filterCountries = (value) => {
		if (value) {
			const countryData = dataCountries.filter(
				(obj) => obj.en.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1
			);
			setDataCountries(countryData);
		} else {
			setDataCountries(Countries);
		}
	};

	const onChangeNumber = () => {
		setInternalVal('');
		setVerificationId(false);
	};


	useEffect(() => {
		let isCancelled = false;
		const runAsync = async () => {
			try {
				if (!isCancelled) {
					//   do the job
					if (!verificationId && !loading)
						textInput.focus();
				}
			} catch (e) {
				if (!isCancelled) {
					throw e;
				}
			}
		};

		runAsync();

		return () => {
			isCancelled = true;
		};

	}, []);

	const renderModal = () => {
		return (

			<Modal animationType="slide" transparent={false} visible={modalVisible}>
				<SafeAreaView style={{ flex: 1 }}>
					<View style={styles.modalContainer}>
						<View style={styles.filterInputContainer}>
							<TextInput
								autoFocus={true}
								onChangeText={filterCountries}
								placeholder="Filter"
								focusable={true}
								style={styles.filterInputStyle}
							/>
						</View>
						<FlatList
							style={{ flex: 1 }}
							data={dataCountries}
							extraData={dataCountries}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => (
								<TouchableWithoutFeedback onPress={() => onCountryChange(item)}>
									<View style={styles.countryModalStyle}>
										<View style={styles.modalItemContainer}>
											<Text style={styles.modalItemName}>{item.en}</Text>
											<Text style={styles.modalItemDialCode}>{item.dialCode}</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>
							)}
						/>
					</View>
					<TouchableOpacity onPress={onShowHideModal} style={styles.closeButtonStyle}>
						<Text style={styles.closeTextStyle}>CLOSE</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</Modal>
		);
	};

	const signIn = async (credential) =>
		await firebase.auth().signInWithCredential(credential).then((result) => {
			// User signed in successfully.

			const user = result.user;

			if (!user?.email) {
				navigation.navigate('Login');
			}
			// console.log('user-->',user);
			// navigation.navigate('SignUp');
			// ...
		}).catch((error) => {
			// User couldn't sign in (bad verification code?)
			console.log('error in signing in-->', error.message);
			// ...
		});


	return (
		<SafeAreaView style={styles.container}>
			{
				!loading ? (
					<>
						<KeyboardAvoidingView
							keyboardVerticalOffset={50}
							behavior={Platform.OS == 'android' ? 'height' : 'padding'}
							style={styles.containerAvoidingView}
						>
							<FirebaseRecaptchaVerifierModal
								ref={recaptchaVerifier}
								firebaseConfig={firebaseConfig}
								attemptInvisibleVerification={attemptInvisibleVerification}
							/>
							<View>
								{!verificationId ? (
									<View>
										<Image source={{ uri: 'https://cdn2.iconfinder.com/data/icons/instagram-outline/19/11-512.png' }}
											style={styles.image}
										/>
										<View style={{ alignSelf: "center" }}>
											<Text style={styles.textTitle} h4>
												PHONE NUMBER
											</Text>
										</View>
										<View
											style={[
												styles.containerInput,
												{ borderBottomColor: focusInput ? '#244DB7' : '#ffffff' }
											]}
										>
											<TouchableOpacity onPress={onShowHideModal}>
												<View style={styles.openDialogView}>
													<Text>{codeCountry + ' |'}</Text>
												</View>
											</TouchableOpacity>
											{renderModal()}
											<TextInput
												ref={(input) => (textInput = input)}
												keyboardType="numeric"
												maxLength={10}
												value={phoneNumber}
												placeholder={placeholder}
												onChangeText={onChangePhone}
												secureTextEntry={false}
												style={styles.phoneInputStyle}
												onFocus={onChangeFocus}
												onBlur={onChangeBlur}
												autoFocus={focusInput}
												editable={!verificationId}
											/>
										</View>
										<View>
											<Text style={styles.textDetail}>
												You may receive SMS updates from Socially and can opt out at any time.
											</Text>
										</View>
										<View style={styles.viewBottom}>
											<TouchableOpacity onPress={() => navigation.navigate('Login', { loginDirect: true })} activeOpacity={0.8}>
												<Text style={styles.signinText}>Or sign up</Text>
											</TouchableOpacity>
											<TouchableOpacity onPress={onPressContinue}>
												<View
													style={[
														styles.btnContinue,
														{ backgroundColor: phoneNumber ? '#49cbe9' : 'gray' }
													]}
												>
													<Text style={styles.textContinue}>{`${verificationId
														? 'Resend'
														: 'Send'} Verification Code`}</Text>
												</View>
											</TouchableOpacity>
											{/* <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>Login Using Email And Password</Text> */}
										</View>
									</View>
								) : (
									<View style={styles.verified}>
										<Text style={styles.textTitle}>{'Input Your OTP code sent via SMS'}</Text>
										<TextInput
											maxLength={6}
											ref={verificationCodeTextInput}
											style={styles.textInput}
											editable={!!verificationId}
											style={[
												styles.cellView,
											]}
											placeholder="123456"
											onChangeText={(verificationCode) => setVerificationCode(verificationCode)}
										/>
										<Button
											title="Confirm Verification Code"
											disabled={!verificationCode}
											buttonStyle={{ marginTop: 20, marginBottom: 10 }}
											onPress={async () => {
												try {
													setConfirmError(undefined);
													setConfirmInProgress(true);
													const credential = firebase.auth.PhoneAuthProvider.credential(
														verificationId,
														verificationCode
													);
													// const authResult = await firebase.auth().signInWithCredential(credential).then(() => console.log('user-->',user));
													setConfirmInProgress(false);
													setVerificationId('');
													setVerificationCode('');
													verificationCodeTextInput.current?.clear();
													signIn(credential);
													// Alert.alert('Phone authentication successful!');
												} catch (err) {
													setConfirmError(err);
													setConfirmInProgress(false);
												}
											}}
										/>
										<View style={styles.bottomView}>

											<TouchableOpacity onPress={onChangeNumber}>
												<View style={styles.btnChangeNumber}>
													<Text style={styles.textChange}>Change Number</Text>
												</View>
											</TouchableOpacity>
											<TouchableOpacity onPress={onResendOTP}>
												<View style={styles.btnResend}>
													<Text
														style={[
															styles.textResend,
															{
																color: enableResend ? '#49cbe9' : 'gray'
															}
														]}
													>
														Resend OTP ({countDown})
													</Text>
												</View>
											</TouchableOpacity>
										</View>
									</View>
								)}
								{confirmError && <Text style={styles.error}>{`Error: ${confirmError.message}`}</Text>}
								{confirmInProgress && <ActivityIndicator style={styles.loader} />}
							</View>
						</KeyboardAvoidingView>

						{attemptInvisibleVerification && <FirebaseRecaptchaBanner />}

					</>

				) : (
					<ActivityIndicator size="large" color='#49cbe9' style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
				)
			}

		</SafeAreaView>
	);
};

export default MobileVerification;

