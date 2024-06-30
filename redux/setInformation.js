import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email:'',
    password:'',
}

export const informationSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setReduxEmail:(state, action)=>{
            // console.log(action.payload);
            state.email = action.payload.email;
        },
        setReduxPassword: (state, action) => {
            state.password = action.payload.password; // action.payload를 사용하여 전달된 비밀번호 값을 상태에 저장
        },
        resetAuth: (state) => {
            state.email = ''; // 이메일 상태 초기화
            state.password= ''; // 비밀번호 상태 초기화
        }
    }
})

export const { setReduxEmail, setReduxPassword, resetAuth } = informationSlice.actions;

export default informationSlice.reducer;