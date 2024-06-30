import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert, ScrollView } from 'react-native';
import {useState, useEffect, useRef} from 'react';
import { useSelector } from 'react-redux';

import OpenAI from "openai";

// import {OPENAI_API_KEY, OPENAI_ORGANIZATION, SERVER_IP} from "@env";
import {OPENAI_API_KEY} from "@env";

import sendToServer from "../../functions/communicateWithServer";

import globalStyle from '../globalStyle';

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

export default function Examine({navigation}){
    //각 대화의 배열을 저장하는 state
    const [convList, setConvList] = useState([]);

    const [userText, setUserText] = useState('');

    const userInfo = useSelector(state=>state.setInformation);

    const chatRef = useRef(null);

    const openai = new OpenAI({
        // organization:OPENAI_ORGANIZATION,
        apiKey:OPENAI_API_KEY
    });

    const openai_chat_start = async ()=>{
        const systemContent = "You are a chatbot acting as a doctor who questions patients. Based on the symptoms experienced by the patient, you identify diseases or health issues to maintain their health and treat diseases. In this process, you listen to the patient's medical history and, if necessary, may request physical examinations or diagnostic tests to make an accurate diagnosis. Based on the diagnosis results, you help decide and implement the best treatment methods. Treatment options may include prescribing medication, surgery, lifestyle adjustments, and physical therapy. If necessary, you can also counsel the patient or their family about the disease, treatment options, and methods of health management. Provide clear, concise, and positive guidance, with brief responses to keep conversations understandable for the elderly user. Do generate responses as short and concise as possible. When generating a response, you must ask only one question at a time."
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: systemContent }],
            model: "gpt-3.5-turbo",
          });
        
        // console.log(completion.choices[0].message);
        // return completion.choices[0].message;
        setConvList([{ role: "system", content: systemContent }, completion.choices[0].message]);
    }

    const openai_chat = async (chatList)=>{
        const completion = await openai.chat.completions.create({
            messages: chatList,
            model: "gpt-3.5-turbo",
          });
        
        return completion.choices[0].message;
        // console.log(completion);
    }
    //사용자가 채팅 입력하면 작동하는 함수
    //1. 채팅 내용을 대회내역에 저장 ->()  convList에 저장)
    //2. 채팅이 화면에 표시되고
    //3. gpt에 전송
    const userChat = async (text, convList)=>{
        if(text === '')
            return;
        else if(text ==='end')
            return conversationEnd();
        convList.push({role:'user', content:text});

        const gptchat = await openai_chat(convList);

        setConvList(e=>[...e, gptchat]);
    }


    const conversationEnd = async ()=>{
        Alert.alert(
            title='대화를 제출하시겠습니까?',
            message='대화의 내용에 따라 제출이 거부될 수 있습니다. 해당 내용은 오직 진단을 내리는 의료진만 열람이 가능합니다.',
            buttons=[
                {text:'네', onPress: async ()=>{
                    const identification ={
                        email:userInfo.email,
                        password:userInfo.password
                    }
                    const data = {
                        conversation:convList
                    };
                    const res = await sendToServer("patient/examine", identification, data);
                    
                    // 성공시 창 이동
                    if(res.result === 0)
                        navigation.navigate('patient', {restart:true });
                    // 실패나 에러 발생시
                    else{
                        console.error(res.message);
                    }
                }},
                {text:'아니오', onPress:()=>{chatRef.current.focus();}},
            ]
        )
    }

    useEffect(()=>{
        openai_chat_start();
    }, []);

    return(<View style={globalStyle.container}>
        <Button
        style={style.navBar}
        title='환자 메인 창으로' 
        onPress={()=>{
            navigation.navigate('patient', {restart:false});
        }}/>

        <Text style={style.title}>
            상담 창
        </Text>

        {/* 채팅 올라오는곳과 치는 부분 합친 박스 */}
        <View style={style.chattingBox}>

            {/* 모든 채팅이 올라오는 곳 */}
            <ScrollView style={style.conversationWarpper}>
                {/* 이 범위 안쪽에서 스크롤 가능하도록 */}
                {convList.map((e, idx)=>{
                    // system은 배제하도록 함
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

            {/* 유저가 채팅 치는 부분 */}
            <View style={style.userChattingWarpper}>
                <TextInput 
                    style={globalStyle.input} 
                    onChangeText={
                        (event)=>{
                            setUserText(event);
                        }
                    }
                    onSubmitEditing={()=>{
                        userChat(userText, convList);
                        setUserText('');
                    }}
                    value={userText}
                    ref={chatRef}
                    blurOnSubmit={false}
                    autoCapitalize={'none'}
                />
                <Button 
                    // 채팅 치면?
                    onPress={()=>{
                        userChat(userText, convList);
                        setUserText('');
                    }}
                    style={style.chatSendButton}
                    title={'전송'}
                />
            </View>
        </View>

        <Button
        onPress={()=>{
            conversationEnd();
        }}
        style={style.chatSendButton}
        title={'제출하기'}/>

    </View>);
}