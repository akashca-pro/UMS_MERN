import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import createUserToken from '../utils/adminSecretToken.js'

export const adminLogin = async (req,res) => {
    const {email,password} = req.body
   
    try {
        const user = await User.findOne({email : email})

        if(user){
            const checkPass = await bcrypt.compare(password,user.password)

            if(user.isAdmin != 1) return res.status(401).json({message : "Only Admins are alowed"})

            if(!checkPass) return res.status(401).json({ message: "Invalid Password" });

            createUserToken(res,user._id); // Token created // cookies sent

            res.json({message : "Admin Login successfull" ,
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.phone,
            });
        }
        else return res.status(404).json({message : "User doesn't exist"});

    } catch (error) {
        console.log("Error during login:", error.message);
        res.status(500).json({ message: "Server internal error" });
    }
}

export const dashboard = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
  
      const searchQuery = {
        isAdmin: 0,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
  
      const users = await User.find(searchQuery)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalUsers = await User.countDocuments(searchQuery);
  
      return res.status(200).json({
        users,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      });
  
    } catch (error) {
      console.log("error fetching from db", error.message);
      res.status(500).json({ message: error.message });
    }
  };

export const logout = async (req, res) => {
    try {
      res.cookie("adminToken", "", { maxAge: 1 });
      res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      console.log(error.message);
  
      res.status(404).json({ message: error.message });
    }
};

const hashpassword = async (password) => {
    const securePassword = await bcrypt.hash(password, 10);
    return securePassword;
};

export const addUser = async (req,res) => {
    const {name,email,phone,password} = req.body;
    const image = req.file ? req.file?.filename : null;

    try {
        const existUser = await User.findOne({email : email});

        if(existUser) return res.status(409).json({message : "User exists"})
        
        const spassword = await hashpassword(password)

        const user = new User({
            name,
            email,
            phone,
            password: spassword,
            image: image,
            is_admin: 0,
          });

          const userData = await user.save()

        if(userData){
            res.status(200).json({message : "User data added" ,
                id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                image: userData.image,
            })
        }
        
    } catch (error) {
        console.log("error in adding user-", error.message);
        res.status(409).json({ message: error.message });
    }
};

export const getDetails = async (req,res) => {
    try {
        
        const user = await User.findById(req.params.id).select("-password -isAdmin");

        if(!user) return res.status(409).json({message : "user doesn't exist"});

        res.status(201).json(user);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

export const editUser = async (req,res) => {

    const user_id = req.params.id;
    const {email} = req.body;
    const updateData = req.body;
    const image = req.file ? req.file?.filename : null;
    updateData.image = image;
    
    try {
        const existEmail = await User.findOne({email : email , _id : {$ne : user_id}})

        const currntUser = await User.findOne({email:email})
        
        if(updateData.image === null)updateData.image = currntUser.image;

        if(existEmail) return res.status(409).json({message : "User already exists"})
        
        const updatedUser = await User.findByIdAndUpdate(user_id,updateData,{new : true});

        if(updatedUser) res.status(200).json(updatedUser);        
        
    } catch (error) {
        console.log("editing failed", error);

        res.status(409).json({ message: error.message });
    }
};

export const deleteUser = async (req,res) => {
    const user_id = req.params.id;
    try {
        await User.findByIdAndDelete(user_id);

        const users = await User.find({isAdmin : 0});

        res.status(200).json(users);
        
    } catch (error) {

        res.status(500).json({message:"Deletion unsuccessfull"})
    }
}
