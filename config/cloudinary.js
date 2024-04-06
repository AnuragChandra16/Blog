require('dotenv').config()
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");

//configure cloudinary
cloudinary.config({
    cloud_name:'dpj8f44ko',
    api_key:'679121715644989',
    api_secret:'Z9sIsjAUxCMhIV69jwOZ3uAEOR0',
});

//instance of cloudinary storage
const storage=new CloudinaryStorage({
    cloudinary,
    allowedFormats:['jpg','jpeg','png'],
    params:{
        folder:'blog-app-v3',
        transformation:[{width:500,height:500,crop:"limit"}],
    },
});
module.exports=storage;
