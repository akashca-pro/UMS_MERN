import { userAuth } from "./IsAuth";
import { adminAuth } from "./IsAuth";
import { Navigate } from "react-router-dom";

const IsUserLogin = ({children}) =>{
    const user = userAuth();
    const admin = adminAuth();
    if(admin.adminInfo){
        return <Navigate to={'/admin'}/>
    }
    else if(!user.userInfo){
        return <Navigate to={'/login'}/>
    }
    return children
}

export default IsUserLogin