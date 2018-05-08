const fs=require('fs');
const path=require('path');
let idx=0;
const getExt=(fileName)=>{
  const reg=/\.[^.]*/g;
  return fileName.match(reg).pop();
}
const genFileName=(file)=>{
  const date=Number(new Date());
  return `${date}_${idx++}${getExt(file.name)}`;
}
const checkImage=(file)=>{
  const reg = /\.(jpg|png|bmp|gif)$/i;
  return reg.test(getExt(file.name));
}
const checkSize=(file,maxSize=5*1024*1024)=>{
  return file.size<=maxSize
}
module.exports=function (key,files) {
  const file=files[key];
  // console.log(file);
  if(file){
    if(checkSize(file)){
      const isImage=checkImage(file);
      const newName=path.join(__dirname, `../../upload/${isImage?'images/':''}`, genFileName(file))
      fs.rename(file.path, newName, err => {
        err && console.log(err);
      });
      return newName;
    }else{
      console.log('file size too large');
      fs.unlinkSync(file.path)
    }
  }else{
    console.log('file err',file)
  }
  
  
  return null;
}