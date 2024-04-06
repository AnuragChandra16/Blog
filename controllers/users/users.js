const bcrypt=require("bcryptjs");
const User=require("../../models/user/User");
const appErr=require("../../utils/appErr");

const registerCtrl=async (req, res,next) => {
    const{fullname,email,password,role,bio}=req.body;
    try {
      //if any fireld empty
      if(!fullname || !email || !password ||!role||!bio){
          return res.render('users/register',{
            error:"All fields are required",
          });
      }
        //check if user exist via email
       const userFound=await User.findOne({email});
        //throw an error
        if(userFound){
          return res.render('users/register',{
            error:"Already exists this credentials",
          });
            //return res.json({status:"failed",data:"User already Exist"});

        }
        //hashpassword
        const salt=await bcrypt.genSalt(10);
        const passwordHashed=await bcrypt.hash(password,salt);
        //register user
        const user=await User.create({
            fullname,
            email,
            password:passwordHashed,
            role,
            bio,
        });
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      res.json(error);
    }
};
const loginCtrl=async (req, res,next) => {
  const {email,password}=req.body;
  if(!email || !password){
    return res.render('users/login',{
      error:"Email and Password are required",
    });
  }
    try {
      //check if email exist
      const userFound=await User.findOne({email});
      if(!userFound){
          //throw an error
          return res.render('users/login',{
            error:"Invalid login credentials",
          });
          
      }
      // if(userFound){
      //   return next(appErr('Invalid login credentials'))
      // }
      //verify pass
      const isPasswordValid=await bcrypt.compare(password,userFound.password);
      if(!isPasswordValid){
        return res.render('users/login',{
          error:"Invalid login credentials",
        });
      }
      req.session.userAuth=userFound;
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      res.json(error);
    }
};
const userDetailsCtrl=async (req, res) => {
    try {
      //get userId from params
      const userId=req.params.id;
      //find the user
      const user=await User.findById(userId)

      
      res.render('users/updateUser',{
        user,
        error:"",
      });
    } catch (error) {
      res.render('users/updateUser',{
      
        error:error.message,
      });
    }
};
const profileCtrl=async (req, res) => {
    try {
      //profile
      const userID=req.session.userAuth;
      //find the user
      const user=await User.findById(userID).populate("posts").populate('comments');
      res.render('users/profile',{user});
    } catch (error) {
      res.json(error);
    }
  };
const uploadProfilePhoto= async (req, res,next) => {
  console.log(req.file);
    try {
      //check if file exists
      if(!req.file){
        
        return res.render('users/uploadProfilePhoto',{
          error:'Please upload image',
        })
      }
      //1.find the user to be updated
      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      //2.check if user is found
      if(!userFound){
        return res.render('users/uploadProfilePhoto',{
          error:'User not found',
        })
      }
      //update the profile photo
      await User.findByIdAndUpdate(userId,{
        profileImage:req.file.path,
      },{
        new:true,
      });
   // redirect  
   res.redirect('/api/v1/users/profile-page')
    } catch (error) {
      
      return res.render('users/uploadProfilePhoto',{
        error:error.message,
      })
    }
  };

const uploadCoverImgCtrl=async (req, res) => {
  try {
    if(!req.file){
        
      return res.render('users/uploadProfilePhoto',{
        error:'Please upload image',
      })
    }
    
    //1.find the user to be updated
    const userId=req.session.userAuth;
    const userFound=await User.findById(userId);
    //2.check if user is found
    if(!userFound){
      return res.render('users/uploadProfilePhoto',{
        error:'User not found',
      })
    }
    //update the profile photo
    const userUpdated=await User.findByIdAndUpdate(userId,{
      coverImage:req.file.path,
    },{
      new:true,
    });
    res.redirect('/api/v1/users/profile-page')
  } catch (error) {
    
    return res.render('users/uploadProfilePhoto',{
      error:error.message,
    });
  }
  };
const updatePasswordCtrl= async (req, res,next) => {
  const {password}=req.body;
  
  try {
    //check if user is updating
    if(password){
      const salt=await bcrypt.genSalt(10);
      const passwordHashed=await bcrypt.hash(password,salt);
      //update
    await User.findByIdAndUpdate(req.session.userAuth,{
      password:passwordHashed,
    },
    {
      new:true,
    }
    )
    res.redirect("/api/v1/users/profile-page");
    } 
    
  } catch (error) {
    return res.render('users/uploadProfilePhoto',{
      error:error.message,
    });
    }
  };

  const updateUserCtrl= async (req, res,next) => {
    const {fullname,email}=req.body;

    try {
      if(!fullname || !email){
        return res.render('users/updateUser',{
          error:"Please provide details",
          user:"",
        });
      }
      //check if email is not taken
      if(email){
        const emailTaken=await User.findOne({email});
        if(emailTaken){
          return res.render('users/updateUser',{
            error:"Email is taken",
            user:"",
          });
        }
      }
      //update the user
     await User.findByIdAndUpadte(req.session.userAuth._id.toString(),{
        fullname,
        email,

      },
      {
        new:true,
      })
      res.redirect("/api/v1/users/profile-page");
    } catch (error) {
      return res.render('users/updateUser',{
        error:error.message,
        user:"",
      });
    }
  };
const logoutCtrl= async (req, res) => {
   
      //destroying the session
      req.session.destroy(()=>{
        res.redirect("/api/v1/users/login");
      })
    };   
  
module.exports={
    registerCtrl,
    loginCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfilePhoto,
    uploadCoverImgCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl,




};