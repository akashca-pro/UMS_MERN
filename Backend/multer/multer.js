import multer from "multer";
import path from 'path'
import fs from 'fs'
import { dirname } from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


function ensureDirExist(directory){
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory,{recursive:true})
    }
}

const storage =  multer.diskStorage({
    destination : (req,file,cb) =>{
        const uploadDir = path.join(__dirname,'uploads')
        ensureDirExist(uploadDir);
        cb(null,uploadDir)
    },
    filename : (req,file,cb)=>{
        const sanitisedOrgName=file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')
        const newFilename=`${file.fieldname}_${Date.now()}_${sanitisedOrgName}`
        // creating unique filename
        console.log(newFilename);

        cb(null,newFilename)
    }
})

const upload = multer({storage : storage})

export default upload