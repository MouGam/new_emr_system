import { StyleSheet, Dimensions } from "react-native";

const {width:screenWidth, height:screenHeight} = Dimensions.get('window');

export default StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:5,
        paddingTop:screenHeight*0.05,
        paddingBottom:5
    },
    input:{
        height:screenHeight*0.07,
        width:screenWidth*0.8,
        borderWidth:1,
        borderColor:'black',
        borderRadius:5,
        marginVertical:10,
        paddingLeft:10,
        paddingVertical:10,
        fontSize:screenHeight*0.035
    }
});