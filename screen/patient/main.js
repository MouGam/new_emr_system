import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import globalStyle from '../globalStyle.js';
import sendToServer from '../../functions/communicateWithServer.js';

import {useDispatch, useSelector} from "react-redux";

export default function PatientMain({navigation, route}){
    // const restart = route.params.restart;
    const [counsels, setCounsels] = useState([]);
    const [reset, setReset] = useState();
    const {email, password} = useSelector(state=>state.setInformation);

    const makeListShow = async ()=>{
        const identification = {email:email, password:password};
        const res = await sendToServer("patient/results", identification, null);
        const list = res.data.counselList;
        if(list.length){
            Promise.all(list.map((val, idx)=>{
                const time = new Date(val.createdAt);
                const title = 
                `[${idx + 1}]${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}자 상담, ${val.isDiagnosed ? "진단 완료" : "진단 완료되지 않았음"}`;
                return <Button 
                key={idx}
                title={title}
                onPress={()=>navigation.navigate('result', {data:val})}
                />;
            }))
            .then((val)=>setCounsels(val));
        }
    }
    // setReset(true);
    useEffect(()=>{
        makeListShow();
    }, []);

    return(<View style={globalStyle.container}>
        <Text>
            환자 메인 창
        </Text>
        
        <Button
        title='상담 창' 
        onPress={()=>{
            navigation.navigate('examine');
        }}/>

        <Button
        title='새로고침' 
        onPress={makeListShow}/>

        <ScrollView>
            <Text>결과 리스트</Text>
            {counsels}
            {/* <Button title='결과 리스트' onPress={()=>{navigation.navigate('result');}}
            /> */}
        </ScrollView>
    </View>);
}