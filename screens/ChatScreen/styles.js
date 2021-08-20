import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    container: {
		flex: 1,
	},
	footer: {
		alignItems: 'center',
		width: '100%',
		padding: 15
	},
	textInput: {
		bottom: 0,
		height: 40,
		flex: 1,
		marginRight: 15,
		backgroundColor: '#ECECEC',
		padding: 10,
		color: 'grey',
		borderRadius: 30
    },
    image: {
		width:windowWidth/2,
		height: 150,
		borderWidth: 3,
		marginBottom: 20
	},
    modalHeader: {
		flexDirection: "row",
		justifyContent:"space-between",
		margin: 10,
		alignItems:"center"
    },
    gif:{ 
        backgroundColor:"gray",
    },
    emoji:{
		marginRight: 5,
		fontSize: 22,
	},
    top:{
        height: 300
    },
	header:{
		borderBottomWidth: 0.5,
		padding: 10
	},
	receiverTimestamp: {
		fontSize: 10,
		color: "gray",
	
		marginLeft: 30
	},
	senderTimestamp:{
		fontSize: 10,
		color:"gray",
		marginRight: 10,
		alignSelf: "flex-end",
		position:"relative",
	},
	commentContainer:{
		flexDirection: "column",
		justifyContent:"center",
	}, 
	 sender:{
		padding: 13,
		alignSelf: "flex-end",
		borderRadius: 20,
		maxWidth: "90%",
		position: 'relative',
		flex: 1,
		flexDirection: "row",
		alignItems: 'center',
	},
	reciever:{
		padding: 13,
		alignSelf: "flex-start",
		borderRadius: 20,
		maxWidth: "90%",
		position: 'relative',
		flex: 1,
		flexDirection: "row",
		alignItems: 'center',
	},
	receiverName:{
		right: 10, 
		paddingLeft: 10,
		fontSize: 17,
		color: "black",
		fontWeight: "bold",
		marginRight: 10
	},
	senderName:{
		left: 10, 
		paddingRight: 10,
		fontSize: 17,
		color: "black",
		fontWeight: "bold",
		marginLeft: 10
	},
	recieverText:{
		color: "black",
		fontWeight: "500",
		fontSize: 17,
		marginRight: 10,
	},
	senderText:{
		color: "white",
		fontWeight: "500",
		fontSize: 17,
		marginLeft: 10,
	},
	 
	content:{
		flexDirection: "row",
		alignItems:"center",
		justifyContent: "center"
	},

	col:{
		flexDirection: "column",
		padding: 10,
		borderRadius: 10
	}
})
