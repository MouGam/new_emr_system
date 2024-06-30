import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import {useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxEmail, setReduxPassword } from '../redux/setInformation';

import sendToServer from '../functions/communicateWithServer';

import globalStyle from './globalStyle';

const style = StyleSheet.create({
    titleContainer:{

    },
    title:{

    },

    formContainer:{

    }
});

// 이메일, 비밀번호, 휴대전화(인증필요) -> 일단 이정도만
// 뭐 저장할 때 일회용으로 쓰면 한번만 사용합니다 이런거 써놓고 처리 -> 혹시 나중에 앱 검사같은거 받으면 보일 수 있도록 처리
// *************** 서식에 안맞으면 거를 수 있도록 처리**************
export default function SignUp({navigation}){
    //role: 환자인지 의료진인지, 'patient' : 환자, 'medical_staff' : 의료진
    const [role, setRole] = useState(null);
    //privacy: 이름, 이메일, 핸드폰번호, 비밀번호 저장
    //**********보안처리 필요*****************
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const [gender, setGender] = useState(null);

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [date, setDate] = useState('');
    
    const dispatch = useDispatch();

    const handleSubmit = async ()=>{
        const birth = new Date(`${year}-${month}-${date}`);
        const data = {
            role:role,
            gender:gender,
            email:email,
            password:password,
            name:name,
            phone:phone,
            birth:birth
        };
        const res = await sendToServer('signup', null, data);

        //동일 이메일이 존재하지 않음
        if(res.result === 0){
            await dispatch(setReduxEmail({email:email}));
            await dispatch(setReduxPassword({password:password}));
            Alert.alert(
                '회원가입이 완료되었습니다.',
                '확인을 누르면 다음 페이지로 이동합니다.',
                [
                    {text:'확인', 
                    onPress:()=>
                        navigation.navigate(role === "patient" ? 'patient' : 'medicalstaff', {restart:true})
                    }
                ]
            );
        }
        //동일 이메일이 존재함
        else if(res.result === 1){
            if(res.message === 'EMAILEXIST'){
                Alert.alert(
                    '동일한 이메일이 존재합니다.',
                    '다른 이메일로 다시 시도하세요',
                    [
                        {text:'확인', onPress:()=>{}}
                    ]
                );
            }
        }
        else{
            console.error(res.message);
            Alert.alert(
                '오류가 발생했습니다',
                '다시 시도해주세요',
                [
                    {text:'확인', onPress:()=>{}}
                ]
            )
        }
    }

    return(<View style={globalStyle.container}>
        
        <View style={style.titleContainer}>
            <Text style={style.title}>회원가입</Text>
        </View>

        <View>
        <Button
                style={style.button}
                title='로그인 페이지로 이동'
                onPress={()=>{
                    navigation.navigate('login');
                }}
            />
        </View>

        <View>
            <Text>
                {role} 정보기입
            </Text>

            <Button
                style={style.button}
                title='환자'
                onPress={()=>{
                    setRole('patient');
                }}
            />
            <Button
                style={style.Button}
                title='의료진'
                onPress={()=>{
                    setRole('medical_staff');
                }}
            />

            <Text>{gender}</Text>
            <Button
                style={style.button}
                title='남성'
                onPress={()=>{
                    setGender('male');
                }}
            />
            <Button
                style={style.Button}
                title='여성'
                onPress={()=>{
                    setGender('female');
                }}
            />
            
            {/* 이메일 */}
            <TextInput id={'email'} value={email} placeholder={'이메일'} onChangeText={(value)=>{setEmail(value)}} autoCapitalize='none'/>
            {/* 이름 */}
            <TextInput id={'name'} value={name} placeholder={'이름'} onChangeText={(value)=>setName(value)} autoCapitalize='none'/>
            {/* 비밀번호 */}
            <TextInput id={'password'} value={password} placeholder={'비밀번호'} onChangeText={(value)=>setPassword(value)} secureTextEntry={true} autoCapitalize='none'/>
            {/* 전화번호 */}
            <TextInput id={'phone'} value={phone} placeholder={'전화번호'} onChangeText={(value)=>{setPhone(value)}} autoCapitalize='none'/>
            {/* 생년월일 */}
            <View style={{flexDirection:'row'}}>
                <TextInput id={'year'} placeholder={'생년'} value={year} onChangeText={(value)=>setYear(value)}/>
                <TextInput id={'month'} placeholder={'월'} value={month} onChangeText={(value)=>setMonth(value)}/>
                <TextInput id={'date'} placeholder={'일'} value={date} onChangeText={(value)=>setDate(value)}/>
            </View>

            <Button
            style={style.Button}
            title='완료'
            onPress={handleSubmit}
            />
        </View> 
    </View>);
}