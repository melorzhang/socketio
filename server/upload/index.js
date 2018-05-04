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
module.exports=function (key,files) {
  const file=files[key];
  // console.log(file);
  const isImage=checkImage(file);
  fs.rename(
    file.path,
    path.join(__dirname, `../../upload/${isImage?'images/':''}`, genFileName(file)),
    err => {
      console.log(err);
    }
  );
}