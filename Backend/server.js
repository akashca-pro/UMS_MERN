import express from "express";
import 'dotenv/config'
import cors from 'cors'
import path from 'path'
import {notFound,errorHandler} from './middlewares/errorHandling.js'
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRouter from './routes/userRoutes.js'
import adminRouter from './routes/adminRoutes.js'
 

const app = express()
connectDB()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())

app.use('/uploads',express.static(path.join(process.cwd(),'multer',"uploads")))

app.use('/',userRouter) // For user Router
app.use('/admin',adminRouter) // For admin Router


app.use(notFound);
app.use(errorHandler);
app.listen(process.env.PORT,()=>{
    console.log(`Server is running in ${"http://localhost:9000/"}`)
})

