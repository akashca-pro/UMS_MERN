import jwt from "jsonwebtoken";
import 'dotenv/config'
import user from '../models/userModel.js'
const verifyToken = async (req,res,next) => {
    
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"Unauthorized,no token"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_KEY);
        await user.findById(decoded.id).select('-password') 
        next();
       
    } catch (error) {
        console.log("invalid token");
        
        return res.status(401).json({message:'Invalid token'})
    }
}

export default verifyToken