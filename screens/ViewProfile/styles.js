import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';




export const styles = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	container:{
		paddingTop: Constants.statusBarHeight + 20,
		flexDirection: "column",
		// margin: 10,
        flex:1,
		backgroundColor: "white",
	},	
	bottom:{
		flexDirection: "column",
		alignItems :"center",
        marginBottom:10,
		marginTop: 50,
		justifyContent: "center"
	},
 
	footer:{
		flexDirection: "row",
		justifyContent:"space-between",
		marginTop: 20
	},
	image:{
		width: 370, 
		height: 450,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.30,
		shadowRadius: 4.65,
		elevation: 8,
	},
	user:{
		color: 'white', 
		fontSize: 22, 
		fontWeight: "600",
		width: "100%",
		paddingHorizontal: 19,
		// paddingVertical: 10
		
	},
 
	userDetails:{
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		justifyContent: 'space-between', 
		alignItems: 'center',
		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.6)",
		position: "absolute",
		bottom: 0,
		width: "100%"
	},
	left:{

	},
	right:{
		flexDirection: "row",
		marginBottom: 10
	},
 
	stats:{
		flexDirection: "column",
		alignItems: "center",
		justifyContent:"center",
		marginHorizontal: 5,
		marginTop: 10,
	
	},
	userText:{
		color: "white",
		fontSize: 14
	},	
	text:{
		color: "white",
		fontSize: 14,
		fontWeight: "600"
	},


	icon:{
		padding: 25,
		borderRadius: 40,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,
		marginHorizontal: 20,
		marginTop: 10,
		elevation: 10,
	},
	rightActions: {
		justifyContent:"center",
		
		height: 50,
		borderRadius: 110,
		paddingVertical: 10,
		paddingHorizontal: 10,
		alignItems :"center",
		justifyContent: 'center',
		alignSelf:"center"
		// marginTop :100,
		// flex: 1,
	},
    rightText:{
		color: "white",
        // padding: 20,
		height: "100%",
		alignItems: "center",
		justifyContent:"center",
		alignSelf: "center"

    },
});