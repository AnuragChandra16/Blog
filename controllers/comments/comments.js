const Comment=require("../../models/comment/Comment");
const Post=require("../../models/post/Post");
const User=require("../../models/user/User");
const session = require('express-session');
const appErr=require("../../utils/appErr")
//create
const createCommentCtrl=async (req, res) => {
  const  { message }=req.body; 
  try {
      //find the post
      const post=await Post.findById(req.params.id);
      //create the comment
      const comment = await Comment.create({
        user: req.session.userAuth,
        message,
        post: post._id,
      });
      //push the post
      post.comments.push(comment._id);
      //find the user
      const user=await User.findById(req.session.userAuth);
      //push the comment into user
      user.comments.push(comment._id);
      //disable validation
      //save
      await post.save({validateBeforeSave:false});
      await user.save({validateBeforeSave:false});
      //redireect 
      res.redirect(`/api/v1/posts/${post._id}`);
    } catch (error) {
      res.json(error);
    }
  };

//single
const commentDetailsCtrl=async (req, res) => {
    try {
      const comment=await Comment.findById(req.params.id);
      res.render('comments/updateComment',{
        comment,error:''
      });
    } catch (error) {
      res.render('comments/updateComment',{
        error:error.message,
      })
    }
  };

const deletecommentCtrl= async (req, res,next) => {
    try {
      //find the post
      const comment=await Comment.findById(req.params.id);
      //check if it belongs to user
      console.log(req.session);
      console.log(comment.user.toString());
      console.log(req.session.userAuth.id);
      if(comment.user.toString()!==req.session.userAuth._id.toString()){
        return next(appErr("You are not allowed to delete this comment",403));

      } 
      //delete post
      await Comment.findByIdAndDelete(req.params.id);

      res.redirect(`/api/v1/posts/${req.query.postId}`);
    } catch (error) {
     next(appErr(error.message));
    }
  };
//update
// Update comment
const updateCommentCtrl = async (req, res, next) => {
  try {
      // Find the comment
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
          return next(appErr('Comment not found'));
      }
      // Check if it belongs to user
      //console.log(comment.user.toString());
      //console.log(req.session.userAuth.toString());
      //const p=req.session.userAuth.toString();
      //console.log(p);
      if (comment.user.toString()!== req.session.userAuth._id.toString()) {
          return next(appErr("You are not allowed to update this comment", 403));
      }
      // Update
      const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, {
          message: req.body.message,
      }, {
          new: true,
      });
      res.redirect(`/api/v1/posts/${req.query.postId}`);
  } catch (error) {
      next(appErr(error.message));
  }
};


module.exports={
    createCommentCtrl,commentDetailsCtrl,deletecommentCtrl,updateCommentCtrl,
}