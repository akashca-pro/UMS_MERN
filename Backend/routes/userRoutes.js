import express from "express";
import upload from '../multer/multer.js'
import { register ,login , logout ,getUserDetails ,  editUser} from "../controllers/userController.js";
import verifyToken from '../middlewares/userAuthMiddleware.js'
const router = express.Router()


router.post('/signup',upload.single('image'),register) 

router.post('/login',login) 

router.post('/logout',logout)

router.get('/:id',verifyToken,getUserDetails)

router.post('/edit-profile',verifyToken,upload.single('image'),editUser)


export default router