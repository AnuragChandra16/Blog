const Post=require("../../models/post/Post");
const User=require("../../models/user/User");
const appErr = (message) => {
  const error = new Error(message);
  error.statusCode = 400; // Set appropriate status code
  return error;
};
const createPostCtrl= async (req, res,next) => {
  const {title,description,category,user}=req.body;
  try {
    if(!title || !description|| !category ||!req.file){
      
      return res.render('posts/addPost',{error:'All fields are required'});
    }
      //find the user

      const userId=req.session.userAuth;
      const userFound=await User.findById(userId);
      //create the post
      const postCreated=await Post.create({
        title,
        description,
        category,
        user:userFound._id,
        image:req.file.path,
      });
      //push the post created into the array of user's posts
      userFound.posts.push(postCreated._id);
      //re save the user
      await userFound.save();
      res.redirect("/");
    } catch (error) {
      return res.render('posts/addPost',{error: error.message});
    }
  
  };
 const fetchPosts= async (req, res,next) => {
    try {
      const posts=await Post.find().populate('comments').populate("user");

      res.json({
        status: "success",
        data:posts,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
//details
const fetchPostCtrl=async (req, res,next) => {
    try {
      //get id from params
      const id=req.params.id;
      //find teh post
      const post =await Post.findById(id).populate({
        path:"comments",
        populate:{
          path:"user",
        }
      }).populate("user");
      res.render("posts/postDetails",{post,error:"",});
    } catch (error) {
      next(appErr(error.message));
    }
  };
const deletePostCtrl=  async (req, res,next) => {
    try {
      //find the post
      const post=await Post.findById(req.params.id);
      //check if it belongs to user
      if(post.user.toString()!==req.session.userAuth._id.toString()){
        return res.render("posts/postDetails",{
          error:"You are not authorized to delete this post",
          post:""
        }
        
        );

      }
      //delete post
      await Post.findByIdAndDelete(req.params.id);

      res.redirect("/");
    } catch (error) {
      return res.render("posts/postDetails",{
        error:error.message,
        post:""
      }
      
      );
    }
  };
const updatePostCtrl=async (req, res,next) => {
  //const { title,description,category,image }=req.body;
  const {title,description,category,image,user}=req.body;
  try {
      //find the post
      
      const post=await Post.findById(req.params.id);
      //check if it belongs to user
      if(post.user.toString()!==req.session.userAuth._id.toString()){
        return res.render('posts/updatePost',{
          post:'',
          error:'You are not authorized to update'
        });

      }
      //check if user is updating image
      if(req.file){
        await Post.findByIdAndUpdate(req.params.id,{
          title,
          description,
          category,
          image:req.file.path
        },
        {
          new: true,
        });
      } else{
        await Post.findByIdAndUpdate(req.params.id,{
          title,
          description,
          category,
          
        },
        {
          new: true,
        });
      }
      //update
      
      

      res.redirect("/");
    } catch (error) {
      return res.render('posts/updatePost',{
        post:'',
        error:error.message,
      });
    }
  };
module.exports={
    createPostCtrl,fetchPosts,fetchPostCtrl,deletePostCtrl,
    updatePostCtrl,};