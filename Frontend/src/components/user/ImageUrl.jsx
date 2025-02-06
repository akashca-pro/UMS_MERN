export const fileNameExtractor=(imgPath)=>{
    const fullPath=imgPath
    return fullPath.split("/").pop()//filename
}

export default fileNameExtractor