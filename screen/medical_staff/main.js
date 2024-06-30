import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import globalStyle from '../globalStyle.js';
import sendToServer from '../../functions/communicateWithServer.js';

import { useEffect, useState } from 'react';
import {useSelector} from "react-redux";

export default function MedicalStaffMain({navigation}){

    const [counsels, setCounsels] = useState([]);
    const {email, password} = useSelector(state=>state.setInformation);

    const makeListShow = async ()=>{
        const identification = {email:email, password:password};
        const res = await sendToServer("medical_staff/requestCounsels", identification, null);
        const list = res.data.counselList;
        if(list.length){
            Promise.all(list.map((val, idx)=>{
                const time = new Date(val.createdAt);
                const title = 
                `[${idx + 1}]${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}자 상담, ${val.isDiagnosed ? "진단 완료" : "진단 완료되지 않았음"}`;
                return <Button 
                key={idx}
                title={title}
                onPress={()=>navigation.navigate('detail', {data:val})}
                />;
            }))
            .then((val)=>setCounsels(val));
        }
    }

    useEffect(()=>{
        makeListShow()
    }, []);

    return(<View style={globalStyle.container}>
        <Text>
            의료진 메인 창
        </Text>

        <Button
        title='새로고침' 
        onPress={makeListShow}/>
        <ScrollView>
            <Text>결과 리스트</Text>
            {counsels}
        </ScrollView>
        <Button 
        title='리스트 창으로' 
        onPress={()=>{
            navigation.navigate('list');
        }}/>

    </View>);
}