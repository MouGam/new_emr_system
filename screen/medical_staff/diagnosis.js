import { StyleSheet, Text, View, Button, Dimensions,ScrollView, TextInput,Alert } from 'react-native';
import { useEffect, useState } from 'react';
import globalStyle from '../globalStyle.js';
import sendToServer from '../../functions/communicateWithServer.js';

import {useDispatch, useSelector} from "react-redux";

export default function Diagnosis({navigation, route}){
    const data = route.params;

    const [userText, setUserText] = useState("");
    const {email, password} = useSelector(state=>state.setInformation);

    const submitData = async ()=>{
        Alert.alert(
            title='진단을 제출하시겠습니까?',
            message='',
            buttons=[
                {
                    text:'네', 
                    onPress: async ()=>{
                        const identification ={
                            email:email,
                            password:password
                        };
                        const diagnoseData = {
                            diagnose:userText,
                            counselId:data.id
                        };
                        const res = await sendToServer("medical_staff/submitDiagnose", identification, diagnoseData);
                        
                        // 성공시 창 이동
                        if(res.result === 0)
                            navigation.navigate('medicalstaff');
                        // 실패나 에러 발생시
                        else{
                            console.error(res.message);
                        }
                    }
                },
                {text:'아니오', onPress:()=>{
                    // chatRef.current.focus();
                }},
            ]
        )
    }

    return(<View style={globalStyle.container}>
        <Button 
        title='환자 상세정보 페이지로' 
        onPress={()=>navigation.navigate('medicalstaff')}
        />

        <Text>
            환자 진단 창
        </Text>

        <ScrollView>
            <TextInput
                style={globalStyle.input} 
                onChangeText={(event)=>setUserText(event)}
                // onSubmitEditing={()=>{}}
                value={userText}
                // ref={chatRef}
                blurOnSubmit={false}
                autoCapitalize={'none'}
            />
            <Button
                onPress={submitData}
                title={'제출'}
            />
        </ScrollView>
    </View>);
}