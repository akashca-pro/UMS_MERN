import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    userInfo : localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')) : null 

}

const userAuthSlice = createSlice({
    name : 'userAuth',
    initialState : initialState,
    reducers : {
        setUserCredentials : (state,action) =>{
            state.userInfo = action.payload
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        },
        userLogout : (state) =>{
            state.userInfo = null
            localStorage.removeItem('userInfo')
        }
    }
})

export const {setUserCredentials,userLogout} = userAuthSlice.actions

export default userAuthSlice.reducer;