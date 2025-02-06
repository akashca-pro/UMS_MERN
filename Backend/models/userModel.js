import mongoose from "mongoose";

const userSchema  = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String ,
        required : true,
        unique : true
    },
    phone : {
        type : Number ,
        required : true
    },
    image : {
        type : String,
        required : false
    },
    isAdmin : {
        type : Number,
        required : true,
        default : 0
    }
})

export default mongoose.model('User',userSchema)

