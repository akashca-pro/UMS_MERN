import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import createUserToken from '../utils/secretToken.js'


const hashPassword = async (password) => {
    try {
        const securePassword = await bcrypt.hash(password,10)
        console.log("password hashed",securePassword)

        return securePassword

    } catch (error) {
        console.log("error in hashing password" + error.message);
    }
}


export const register = async (req,res) => {

    console.log(req.body);
    const {name,email,phone,password} = req.body
    const image = req.file ? req.file?.filename : null;
    console.log("image recieved"  +  image)

    try {
        const existUser = await User.findOne({email : email})
        if(existUser){
            return res.status(409).json({message :"User exists"});
        }
        const spassword = await hashPassword(password)

        const user = new User({
            name : name,
            email : email,
            phone : phone,
            password : spassword,
            image : image,
            isAdmin : 0
        })

        const userData = await user.save()

        if(userData){
            console.log("data saved in database");
            return res.status(201)
            .json({message : "User data saved on the database",success : true ,user})
        }
        
    } catch (error) {
        console.log("data not received" + error.message);
        return res.status(500).json({message : "Server internal error"})
    }
};

export const login = async (req,res) => {
    const {email,password} = req.body
    console.log(req.body)
    try {
        const userExist = await User.findOne({email : email})

        if(!userExist) return res.status(401).json({message : "User doesn't exist"})

        const checkPass = await bcrypt.compare(password,userExist.password)

        if(!checkPass) return res.status(401).json({message : "Incorrect password"})
        
        //creating token-used userid in payload
        createUserToken(res,userExist._id)

        //set jwt token in secure cookie

        //respond with data

        res.json({
            message: "Login successfull",
            success : true,
            _id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            phone: userExist.phone,
            image: userExist.image,
          });
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "server error,Login unsuccessfull" });
    }
};

export const logout = (req,res) =>{
    //CLEAR COOKIE
    res.cookie("token", "", { maxAge: 1 });//expire in one milli sec
    res.status(200).json({message : "Logout successfull"});
    console.log('cookie removed')
}

export const getUserDetails = async (req,res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -isAdmin')
        console.log("user",user)

        if(!user) return res.status(404).json({message : "user not found"})

        res.json(user);
        
    } catch (error) {
        console.log(error.message);

        res.json({ message: "user not Found" });
    }
};

export const editUser = async (req,res) => {
    try {
        const user_id = req.body._id;
        const updateData = req.body;

        const updateEmail = req.body.email;

        const emailExist = await User.findOne({email : updateEmail , _id : {$ne : user_id}});

        if(emailExist) return res.status(409).json({message : "Email exists"})

        if(req?.file) updateData.image = req.file?.filename;

        const updatedUser = await User.findByIdAndUpdate(user_id,updateData,{new : true});
        
        if(updatedUser){
            res.status(200).json({ message: "updation successfull",
                success : true,
             _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            image: updatedUser.image,})
            console.log("updation success",updatedUser);            
        }


    } catch (error) {
        console.log("updation failed" , error.message)
        res.json({message:"updation failed",error})
    }
}

