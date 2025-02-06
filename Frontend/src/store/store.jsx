import { configureStore } from "@reduxjs/toolkit";
import userAuth from './slice/userAuthSlice'
import adminAuth from './slice/adminAuthSlice'


const store = configureStore({
    reducer :{
        userAuth : userAuth,
        adminAuth : adminAuth
    },
    devTools : true
})

export default store