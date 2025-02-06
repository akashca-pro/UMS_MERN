import express from "express";
import upload from '../multer/multer.js'
import verifyAdminToken from '../middlewares/adminAuthMiddleware.js'
import {adminLogin ,dashboard,logout,addUser ,editUser ,getDetails ,deleteUser} from '../controllers/adminController.js'
const router = express.Router()

router.post('/',adminLogin)

router.get('/dashboard',verifyAdminToken,dashboard)

router.post('/logout',logout)

router.get('/:id',verifyAdminToken,getDetails)

router.post('/add-user',verifyAdminToken,upload.single('image'),addUser)

router.put('/edit-user/:id',verifyAdminToken,upload.single('image'),editUser)

router.delete('/delete/:id',verifyAdminToken,deleteUser)


export default router