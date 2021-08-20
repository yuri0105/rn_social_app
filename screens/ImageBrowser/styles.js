import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	flex: {
		flex: 1
	},
	container: {
		position: 'relative'
	},
	emptyStay: {
		textAlign: 'center'
	},
	countBadge: {
		paddingHorizontal: 8.6,
		paddingVertical: 5,
		borderRadius: 50,
		position: 'absolute',
		right: 3,
		bottom: 3,
		justifyContent: 'center',
		backgroundColor: '#0580FF'
	},
	countBadgeText: {
		fontWeight: 'bold',
		alignSelf: 'center',
		padding: 'auto',
		color: '#ffffff'
	}
});
