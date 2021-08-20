import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container:{
        flexDirection: "column",
        flex:1,
        backgroundColor:"whitesmoke",

    }
    ,button:{

        alignSelf:"flex-end",
        margin: 15
    },
    row: {
      top: 15,
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    slider:{
      height: 7,
      marginTop: 40,
      marginBottom: 20
    },
});
