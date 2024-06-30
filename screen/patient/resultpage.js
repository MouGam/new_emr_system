import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert } from 'react-native';
import { useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxEmail, setReduxPassword } from '../redux/setInformation';

import globalStyle from './globalStyle';

import checkInfo from '../functions/checkInfo';

const {width:screenWidth, height:screenHeight} = Dimensions.get('window');


export default function resultPage({navigation, route}){

    // const {patientId} = route.params;
    // console.log(route);
    const [userID, setUserID] = useState(null);
    const {email, password} = useSelector(state=>state.setInformation);

    const {resultID} = route.params;

    //서버로부터 결과 하나만 얻어오는 함수
    const getAResult = async ()=>{
        const submitData = {
            userID:userID,
            password:password,
        }
        const result = await (await fetch(`http://${SERVER_IP}:3000/patient/aResult/${resultID}`,{
            method:'GET',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(submitData)
        })).json();

        console.log(result);
    }

    useEffect(()=>{
        getAResult();
    }, []);

    // console.log(email, password);
    return(<View style={globalStyle.container}>
        <Text>
            결과페이지
        </Text>

    </View>);
}