import { StyleSheet, Text, View, Button, TextInput, Dimensions, Alert } from 'react-native';
import { useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { setReduxEmail, setReduxPassword } from '../redux/setInformation';

import globalStyle from './globalStyle';

// import checkInfo from '../functions/checkInfo';
import sendToServer from '../functions/communicateWithServer';

const {width:screenWidth, height:screenHeight} = Dimensions.get('window');


const style = StyleSheet.create({
    titleContainer:{
        flex:2,
    },
    title:{
        textAlign:'center',
        fontSize:screenHeight*0.05,
        paddingVertical:screenHeight*0.1
    },

    loginContainer:{
        flex:3,
        alignItems:'center',
        justifyContent:'top'
    },
    button:{
        height:screenHeight*0.1,
        width:screenWidth*0.8,
        backgroundColor:'grey'
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

// 추가할것
//2. 로그인 성공하면 유저 ID(로그인할 때 쓰는 것 말고 판별할 때 쓰는것), 이름 서버에서 받아와서 리덕스에 저장

/*
로그인 실패(에러아님)시 올 수 있는 메시지
"EMAILNOTEXIST"
"PASSWORDNOTMATCH"
*/
export default function Login({navigation}){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const inputRef = useRef(null);

    // const states = useSelector(state=>state.setInformation);
    const dispatch = useDispatch();

    const onSubmit = async (event)=>{
        const identification = {email:email, password:password};
        const data = null;
        const res = await sendToServer("login", identification, data);
        
        //로그인 성공
        if(res.result === 0){
            await dispatch(setReduxEmail({email:email}));
            await dispatch(setReduxPassword({password:password}));
            // console.log()
            //db에 등록된 정보가 환자일 경우 
            if(res.data.role === 'patient'){
                navigation.navigate('patient', {restart:true});
            }
            //의료진일경우
            else{
                navigation.navigate('medicalstaff');
            }
        }
        //실패
        else if(res.result === 1){
            if(res.message === "EMAILNOTEXIST"){
                Alert.alert(
                    '해당 이메일이 존재하지 않습니다.',
                    '',
                    [
                        {text:'확인', onPress:()=>{}}
                    ]
                );
            }
            else if(res.message === "PASSWORDNOTMATCH"){
                Alert.alert(
                    '비밀번호가 일치하지 않습니다.',
                    '',
                    [
                        {text:'확인', onPress:()=>{}}
                    ]
                );
            }
        }
        //오류
        else{
            console.error(res.message);
            Alert.alert(
                '서버와의 통신중 오류가 발생했습니다.',
                '',
                [
                    {text:'확인', onPress:()=>{}}
                ]
            )
        }

    }

    //local에 id, pw저장된 기록 있으면 체크해서 자동으로 넘어가도록 함.
    // useState(()=>{

    // }, []);

    return(<View style={globalStyle.container}>

        <View style={style.titleContainer}>
            <Text style={style.title}>
                진료 도우미
            </Text>
        </View>

        <View style={style.loginContainer}>
            {/* 이메일, return누르면 비밀번호로 포커싱 */}
            <TextInput 
                id={'email'} 
                style={style.input} 
                onChangeText={(event)=>{
                    setEmail(event);
                }}
                onSubmitEditing={()=>{
                    inputRef.current.focus();
                }}
                value={email} 
                placeholder='이메일'
                autoCapitalize='none'
            />

            {/* 비밀번호, return 누르면 로그인 버튼 누른것과 같은 효과 */}
            <TextInput 
                id={'password'} 
                style={style.input} 
                onChangeText={(event)=>{
                    setPassword(event);
                }}
                onSubmitEditing={onSubmit}
                value={password} 
                placeholder='비밀번호' 
                secureTextEntry={true}
                ref={inputRef}
                autoCapitalize='none'
            />

            <Button 
                style={style.button}
                title='로그인' 
                onPress={onSubmit}
            />

            <Button 
                style={style.button}
                title='회원가입' 
                onPress={()=>{
                    navigation.navigate('signup');
                }}
            />
        </View>
    </View>);
}