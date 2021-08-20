import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native-elements';
import { TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';

const InputOTP = ({ navigation, route }) => {
	let clockCall = null;
	let textInput = useRef(null);
	const [ internalVal, setInternalVal ] = useState('');
	const defaultCountDown = 30;
	const [ countDown, setCountDown ] = useState(defaultCountDown);
	const [ enableResend, setEnableResend ] = useState(false);
	const lengthInput = 6;

	useEffect(() => {
		clockCall = setInterval(() => {
			decrementClock();
		}, 1000);

		return () => {
			clearInterval(clockCall);
		};
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

	const onChangeText = (val) => {
		setInternalVal(val);
		if (val.length === lengthInput) {
			navigation.navigate('Home');
		}
	};

	useEffect(() => {
		textInput.focus();
	}, []);

	const onChangeNumber = () => {
		setInternalVal('');
		navigation.navigate('Authentication');
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

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				keyboardVerticalOffset={50}
				style={styles.containerAvoidingView}
				behavior={Platform.OS == 'android' ? 'height' : 'padding'}
			>
				<Text style={styles.textTitle}>{'Input Your OTP code sent via SMS'}</Text>
				<View>
					<TextInput
						ref={(input) => (textInput = input)}
						onChangeText={onChangeText}
						style={{ width: 0, height: 0 }}
						value={internalVal}
						maxLength={lengthInput}
						returnKeyType="done"
						keyboardType="numeric"
						autoFocus={true}
					/>
					<View style={styles.containerInput}>
						{Array(lengthInput).fill().map((data, index) => (
							<View
								key={index}
								style={[
									styles.cellView,
									{
										borderBottomColor: index === internalVal.length ? '#FB6C6A' : '#234DB7'
									}
								]}
							>
								<Text onPress={() => textInput.focus()} style={styles.cellText}>
									{internalVal && internalVal.length > 0 ? internalVal[index] : ''}
								</Text>
							</View>
						))}
					</View>
				</View>
				<View style={styles.middleView}>
					<Button
						title="Confirm Verification Code"
						disabled={!verificationCode}
						onPress={async () => {
							try {
								setConfirmError(undefined);
								setConfirmInProgress(true);
								const credential = firebase.auth.PhoneAuthProvider.credential(
									verificationId,
									verificationCode
								);
								const authResult = await firebase.auth().signInWithCredential(credential);
								setConfirmInProgress(false);
								setVerificationId('');
								setVerificationCode('');
								verificationCodeTextInput.current?.clear();
								Alert.alert('Phone authentication successful!');
							} catch (err) {
								setConfirmError(err);
								setConfirmInProgress(false);
							}
						}}
					/>
				</View>
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
										color: enableResend ? '#234DB7' : 'gray'
									}
								]}
							>
								Resend OTP ({countDown})
							</Text>
						</View>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default InputOTP;
