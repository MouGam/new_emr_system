import { StyleSheet, Text, View, Button } from 'react-native';

export default function List({navigation}){

    return(<View>
        <Button 
        title='의료진 메인 창으로' 
        onPress={()=>{
            navigation.navigate('medicalstaff');
        }}/>

        <Text>
            환자 리스트업 창
        </Text>
        
        <Button 
        title='환자정보 상세 페이지로' 
        onPress={()=>{
            navigation.navigate('detail');
        }}/>

    </View>);
}