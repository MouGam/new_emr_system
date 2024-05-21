import { StyleSheet, Text, View, Button, Dimensions,ScrollView, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import globalStyle from '../globalStyle.js';
import sendToServer from '../../functions/communicateWithServer.js';

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

//여기서 진단 기다리는 내용들 '대기 표시'필요
//환자 홈에서 진단 대기 표시하고
//여기서는 상세 결과 표시하는거로
export default function Result({navigation, route}){
    const data = route.params.data;
    const conversation = data.counsel.conversation;
    const {email, password} = useSelector(state=>state.setInformation);
    // const [convList, setConvList] = useState([]);
    const [diagList, setDiagnose] = useState([]);

    const getDiagnose = async () => {
        //for debugging
        // console.log(1111111);
        const identification =  {email:email, password:password};
        const sendData = {counselId:data.id};
        const res = await sendToServer("patient/getDiagnose", identification, sendData);
        
        if(res.result == 0){
            setDiagnose(res.data.diagnoseList);
        }
        //에러떴음
        else{
            Alert.alert(
                title='에러가 발생했습니다.',
                message='문제가 있는데요',
                buttons=[
                    {
                        text:'확인', 
                        onPress: async ()=>{
                        }
                    },
                ]
            )
        }
    }

    useEffect(()=>{
        getDiagnose();
    }, []);

    return(<View style={globalStyle.container}>
        <Button 
            title='환자 메인 창으로' 
            onPress={()=>{
                navigation.navigate('patient');
        }}/>

        <Button 
            title='새로고침' 
            onPress={()=>{
                getDiagnose();
        }}/>
        
        <Text>대화내역</Text>
        <ScrollView style={style.conversationWarpper}>
            {conversation.map((e, idx)=>{
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

        <Text>
            {email}님의 진단 내역
        </Text>
        <ScrollView style={style.conversationWarpper}>
            {diagList.map((e, idx)=>{
                return (<View style={style.innerChatting} key={idx}>
                    <Text style={style.innerChattingBot}>
                        {e.diagnose}
                    </Text>
                </View>);
            })}
        </ScrollView>
    </View>);
}