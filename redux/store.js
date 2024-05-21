// import { createStore } from "redux";
// import reducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";

import informationReducer from "./setInformation";

export default store = configureStore({
    reducer:{
        setInformation:informationReducer
    },
});
