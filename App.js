// import { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';

import login from "./screen/login";
import signup from "./screen/signup";

import PatientMain from './screen/patient/main';
import Examine from './screen/patient/examine';
import Result from './screen/patient/result';

import MedicalStaffMain from './screen/medical_staff/main';
import List from './screen/medical_staff/list';
import Detail from './screen/medical_staff/detail';
import PrevDetail from './screen/medical_staff/prevdetail';
import Diagnosis from './screen/medical_staff/diagnosis';

import store from "./redux/store"

const Stack = createNativeStackNavigator();

// const LoginContext = createContext();

export default function App(){
  
  return (
    // store는 redux store
    <Provider store={store}> 
      <NavigationContainer >
        <Stack.Navigator initialRouteName="login" screenOptions={{ headerShown: false }}>
          {/* 로그인 */}
          <Stack.Screen name="login" component={login} />
          <Stack.Screen name="signup" component={signup}/>
          {/* 환자 */}
          <Stack.Screen name="patient" component={PatientMain} options={{gestureEnabled: false}}/>
          <Stack.Screen name="examine" component={Examine}/>
          <Stack.Screen name="result" component={Result}/>
          {/* 의료진 */}
          <Stack.Screen name="medicalstaff" component={MedicalStaffMain} options={{gestureEnabled: false}}/>
          <Stack.Screen name="list" component={List}/>
          <Stack.Screen name="detail" component={Detail}/>
          <Stack.Screen name="prevdetail" component={PrevDetail}/>
          <Stack.Screen name="diagnosis" component={Diagnosis}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
