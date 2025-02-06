import { userAuth } from "./IsAuth";  
import { adminAuth } from "./IsAuth";
import { Navigate } from "react-router-dom";

const IsUserLogout = ({children})=>{
    const user = userAuth();
    const admin = adminAuth();
    if(admin.adminInfo){
        return <Navigate to={'/admin'}/>
    }
    else if(user.userInfo){
        return <Navigate to={'/'}/>
    }
    return children
}

export default IsUserLogout