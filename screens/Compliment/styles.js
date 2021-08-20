import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;

export const styles = StyleSheet.create({
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
    footer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		padding: 12,
		// backgroundColor: "yellow"
	},
    container: {
		flex: 1,
		// backgroundColor:"black"
	},
    image:{
        height: 200, 
        width: 200,

    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: 0.3,
        backgroundColor: 'black',
        width: width/2,
        height: width/2,
        // borderWidth: 1
      }  
})
