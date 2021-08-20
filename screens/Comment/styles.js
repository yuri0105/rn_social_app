import { StyleSheet } from 'react-native';	
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	footer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: windowWidth,
		padding: 12,
	},
	textInput: {
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 15,
		backgroundColor: '#ECECEC',
		padding: 10,
		color: 'black',
		borderRadius: 30
    },
	emoji:{
		marginRight: 5,
		fontSize: 22,
	},
	image: {
		width:windowWidth/2,
		height: 150,
		borderWidth: 3,
		marginBottom: 20
	  },
   gif:{ 
 
	backgroundColor:"gray",
   },
   top:{
	height: 300
   },
   modalHeader: {
	flexDirection: "row",
	justifyContent:"space-between",
	margin: 10,
	alignItems:"center"
   }
 
});
