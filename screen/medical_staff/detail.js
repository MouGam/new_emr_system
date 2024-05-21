import { StyleSheet, Text, View, Button, Dimensions,ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import globalStyle from '../globalStyle.js';

const {width:screenWidth, height:screenHeight} = Dimensions.get('window');

const style = StyleSheet.create({
    navBar:{
        flex:1
    },
    title:{
        flex:1,
        textAlign:'center'
    },
    chattingBox:{
        flex:12,
        borderColor:'black',
        borderWidth:1,
        marginBottom:screenHeight*0.05,
        justifyContent:'space-between'
    },
    conversationWarpper:{

    },
    innerChatting:{
        flexDirection:'column',
        borderColor:'black',
        borderWidth:1,
        padding:5,
        margin:5
    },
    innerChattingBot:{
        textAlign:'left'
        
    },
    innerChattingUser:{
        textAlign:'right'
    },
    
    userChattingWarpper:{
        flexDirection:'row',
        alignItems:'center',
        margin:5
    },
    chattingText:{
        fontSize:30,
        borderColor:'black',
        borderWidth:1,
        padding:5,
        margin:5
    }
});

export default function Detail({navigation, route}){
    const data = route.params.data;
    const counsel = data.counsel;
    const [convList, setConvList] = useState([]);

    useEffect(()=>{
        setConvList(counsel.conversation);
    }, []);

    return(<View style={globalStyle.container}>
        <Button 
        title='메인페이지로' 
        onPress={()=>{
            navigation.navigate('medicalstaff');
        }}/>

        <Text>
            환자 상세정보 페이지
        </Text>
        <Text>
            환자 대화내역
        </Text>
        <ScrollView style={style.conversationWarpper}>
            {convList.map((e, idx)=>{
                if(e.role === 'user'){
                    return (<View style={style.innerChatting} key={idx}>
                        <Text style={style.innerChattingUser}>
                            {e.content}
                        </Text>
                    </View>);
                }else if(e.role === 'assistant'){
                    return (<View style={style.innerChatting} key={idx}>
                        <Text style={style.innerChattingBot}>
                            {e.content}
                        </Text>
                    </View>);
                }
            })}
        </ScrollView>
        <Button 
        title='진단 내리기' 
        onPress={()=>{
            navigation.navigate('diagnosis', data);
        }}/>
    </View>);
}