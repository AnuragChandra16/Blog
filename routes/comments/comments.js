const express=require('express');
const {
  createCommentCtrl,commentDetailsCtrl,deletecommentCtrl,updateCommentCtrl
}=require("../../controllers/comments/comments");
const commentRoutes=express.Router();
const protected=require("../../middlewares/protected");
commentRoutes.post("/:id",protected,createCommentCtrl );
  
  //GET/api/v1/comments/:id
  commentRoutes.get("/:id", commentDetailsCtrl);
  
  //DELETE/api/v1/comments/:id
  commentRoutes.delete("/:id",protected,deletecommentCtrl);
  
  //PUT/api/v1/comments/:id
  commentRoutes.put("/:id",protected, updateCommentCtrl);
  
module.exports=commentRoutes;