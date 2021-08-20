export const decrementClock = () => {
    if (countDown === 0) {
        setEnableResend(true);
        setCountDown(0);
        clearInterval(clockCall);
    } else {
        setCountDown(countDown - 1);
    }
};

export const onResendOTP = () => {
    if (enableResend) {
        setCountDown(defaultCountDown);
        setEnableResend(false);
        clearInterval(clockCall);
        clockCall = setInterval(() => {
            decrementClock();
        }, 1000);
    }
};

export const filterCountries = (value) => {
    if (value) {
        const countryData = dataCountries.filter(
            (obj) => obj.en.indexOf(value) > -1 || obj.dialCode.indexOf(value) > -1
        );
        setDataCountries(countryData);
    } else {
        setDataCountries(Countries);
    }
};

export const onChangeNumber = () => {
    setInternalVal('');
    setVerificationId(false);
};


export const onShowHideModal = () => {
    setModalVisible(!modalVisible);
    console.log(modalVisible);
};

export const onChangePhone = (number) => {
    setPhoneNumber(number);
};


export const onPressContinue = async () => {
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
            console.log('success');
            
        

        } catch (err) {
            setVerifyError(err);
            setVerifyInProgress(false);
            console.log('failure', err.message);
        }
    }
};

export const onChangeFocus = () => {
    setFocusInput(true);
};

export const onChangeBlur = () => {
    setFocusInput(false);
};

export const onCountryChange = (item) => {
    setCodeCountry(item.dialCode);
    setPlaceholder(item.mask);
    onShowHideModal();
};