import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	containerAvoidingView: {
		flex: 1,
		alignItems: 'center',
		padding: 10
	},
	textTitle: {
		marginTop: 50,
		marginBottom: 50,
		fontSize: 16
	},
	containerInput: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	cellView: {
		paddingVertical: 11,
		width: 40,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1.5
	},
	cellText: {
		textAlign: 'center',
		fontSize: 16
	},
	bottomView: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'flex-end',
		marginBottom: 50,
		alignItems: 'center'
	},
	btnChangeNumber: {
		width: 150,
		height: 50,
		borderRadius: 10,
		alignItems: 'flex-start',
		justifyContent: 'center'
	},
	textChange: {
		color: '#234DB7',
		alignItems: 'center',
		fontSize: 15
	},
	btnResend: {
		width: 150,
		height: 50,
		borderRadius: 10,
		alignItems: 'flex-end',
		justifyContent: 'center'
	},
	textResend: {
		alignItems: 'center',
		fontSize: 15
	}
});
