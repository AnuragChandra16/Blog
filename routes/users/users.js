const express=require('express');
const multer=require("multer");
const storage=require("../../config/cloudinary");
//const multer=require("multer");
const { registerCtrl,loginCtrl,
  userDetailsCtrl,
  profileCtrl,
  uploadProfilePhoto,
  uploadCoverImgCtrl,
  updatePasswordCtrl,
  updateUserCtrl,
  logoutCtrl, }=require("../../controllers/users/users");
const protected=require('../../middlewares/protected')
const userRoutes=express.Router();
//instances of multer
const upload=multer({storage});

//rendering forms
//login form
userRoutes.get("/login",(req,res)=>{
  res.render("./users/login.ejs",{
    error:''
  });
});
//register form
userRoutes.get("/register",(req,res)=>{
  res.render("./users/register.ejs",{
    error:''
  });
});
//profile template
// userRoutes.get("/profile-page",(req,res)=>{
//   res.render("./users/profile.ejs",{
//     title:"profile",
//     error:"",
//   });
// });

//upload profile pic
userRoutes.get("/upload-profile-photo-form",(req,res)=>{
  res.render("./users/uploadProfilePhoto.ejs",{error:""});
});

//upload cover pic
userRoutes.get("/upload-cover-photo-form",(req,res)=>{
  res.render("./users/uploadCoverPhoto.ejs",{error:""});
});

// //update user form
userRoutes.get("/update-user-password",(req,res)=>{
  res.render("./users/updatePassword.ejs",{error:""});
});

userRoutes.post("/register",upload.single("firstimg"),registerCtrl);

//POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);



//GET/api/v1/users/profile/:id
userRoutes.get("/profile-page",protected, profileCtrl);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/profile-photo-upload",protected,upload.single("firstimg"), uploadProfilePhoto);

//PUT/api/v1/users/profile-photo-upload/:id
userRoutes.put("/cover-photo-upload",protected,upload.single("firstimg"), uploadCoverImgCtrl);

//PUT/api/v1/users/update-password/:id
userRoutes.put("/update-password/", updatePasswordCtrl);
userRoutes.put("/update", updateUserCtrl);
//GET/api/v1/users/logout
userRoutes.get("/logout", logoutCtrl);
//GET/api/v1/users/:id
userRoutes.get("/:id", userDetailsCtrl);

module.exports=userRoutes;