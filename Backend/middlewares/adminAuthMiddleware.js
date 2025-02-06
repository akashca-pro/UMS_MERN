import jwt from "jsonwebtoken";
import 'dotenv/config'
import User from '../models/userModel.js'
const verifyAdminToken = async (req,res,next) => {
    const token = req.cookies.adminToken;
    if(!token){
        return res.status(401).json({message:"Unauthorized,no token"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        await User.findById(decoded.id).select('-password')   
        next()
       
    } catch (error) {
        console.log("invalid token");
        
        return res.status(401).json({message:'Invalid token'})
    }
}

export default verifyAdminToken