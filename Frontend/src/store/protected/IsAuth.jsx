import { useSelector } from "react-redux";

export const userAuth = ()=>{
    const userInfo = useSelector((state)=>state?.userAuth?.userInfo)
    return {userInfo : userInfo || null}
}

export const adminAuth = ()=>{
    const adminInfo = useSelector((state)=>state?.adminAuth?.adminInfo)
    return {adminInfo : adminInfo || null}
}