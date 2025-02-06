import React, { useState } from "react";
import { createContext } from "react";

export const UserDetails = createContext()

export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null);

    return (<UserDetails.Provider value={{user , setUser}}>
        {children}
    </UserDetails.Provider>)
}