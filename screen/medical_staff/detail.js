import { StyleSheet, Text, View, Button, Dimensions,ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import globalStyle from '../globalStyle.js';
import sendToServer from '../../functions/communicateWithServer.js';

import {useDispatch, useSelector} from "react-redux";
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
    const [prevConvList, setPrevConvList] = useState([]);
    const [privacy, setPrivacy] = useState({});

    const {email, password} = useSelector(state=>state.setInformation);

    // data가 counsel행에 대한 데이터라 userId있음. userId가져다가 요청하면 이름, 생일, 성별정도만 가져오도록 처리
    // 그리고 userId넣으면 이전 진료기록들 쫙 가져오도록 처리
    const getPrevConv = async (patientId) => {
        const identification = {email:email, password:password};
        const res = await sendToServer("medical_staff/requestPrevCounsels", identification, {patientId:patientId});
        // console.log(res);
        setPrivacy(res.data.privacy);
        setPrevConvList(res.data.prevCounselList);
        // console.log(res.data.prevCounselList);
    }


    useEffect(()=>{
        // console.log(data);
        // console.log(counsel);
        const patientId = data.userId;
        getPrevConv(patientId);
        setConvList(counsel.conversation);
    }, []);

    return(<View style={globalStyle.container}>
        <Button 
        title='이전페이지로' 
        onPress={()=>{
            navigation.goBack();
        }}/>

        <Text>
            [{privacy.name}]환자 상세정보 페이지
        </Text>
        <View>
        <Text>
            {privacy.gender === "male" ? "남" : "여"}, {privacy.birth}년생
        </Text>
        <Text>
            이 환자의 다른 진료목록
        </Text>
        {
            prevConvList.map((val, idx)=>{
                // console.log(val.id);
                // console.log(data.id);
                if(val.id !== data.id){
                    const time = new Date(val.createdAt);
                    const title = 
                    `[${idx + 1}]${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}자 상담, ${val.isDiagnosed ? "진단 완료" : "진단 완료되지 않았음"}`;
                    return <Button 
                    key={idx}
                    title={title}
                    onPress={()=>navigation.navigate('prevdetail', {data:val})}
                    />;
                }
            })
        }

        </View>
        
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