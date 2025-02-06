import { adminAuth } from "./IsAuth";
import { userAuth } from "./IsAuth";
import { Navigate } from "react-router-dom";

const IsAdminLogout = ({children})=>{
    const admin = adminAuth()
    const user = userAuth();
    if(user.userInfo){
        return <Navigate to={'/'}/>
    }
    else if(admin.adminInfo){
        return <Navigate to={'/admin/dashboard'}/>
    }
    return children
}

export default IsAdminLogout