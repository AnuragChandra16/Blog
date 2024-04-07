require("dotenv").config();

const express=require("express");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const methodOverride=require("method-override");
const userRoutes=require("./routes/users/users");
const postRoutes=require("./routes/posts/posts");
const commentRoutes=require("./routes/comments/comments");
const globalErrHandler = require('./middlewares/globalHandlers');
const Post=require("./models/post/Post");
const {truncatePost} = require("./utils/helpers");
const path = require('path');
require("./config/dbConnect");
const MONGO_URL=process.env.MONGO_URL;
const app=express();
//middlewares
//-------
//helpers

app.locals.tuncatePost=truncatePost;
//configure ejs
app.set("views",path.join(__dirname, "views"));
app.set("view engine","ejs");

//serve static file
app.use(express.json(__dirname,"/public"));
app.use(express.json());//pass incoming data
app.use(express.urlencoded({extended: true}));//pass form data
//method override
app.use(methodOverride("_method"));
//session config
//const mongoUrl = process.env.MONGO_URL;

// app.use(
//   session({
//     secret: 'mykey2392',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URL}),
//   })
// );

app.use(session({
  secret:'mykey2392',
  resave:false,
  saveUninitialized:true,
  store:new MongoStore({
    mongoUrl:'mongodb+srv://anuragchandra1601:vIvusQKfjbZK8wUw@blogapp.gik2fhc.mongodb.net/blogapp?retryWrites=true&w=majority&appName=blogapp',
    ttl:24*60*60,
  }),
})
);

//save the login user into locals
app.use((req,res,next)=>{
  if(req.session.userAuth){
    res.locals.userAuth=req.session.userAuth;
  }else{
    res.locals.userAuth=null;
  }
  next();
})
//render home
app.use(express.static('public'));
app.get('/',async(req,res)=>{
  try{
    const posts=await Post.find().populate("user");
    res.render("index.ejs",{posts});
  } catch(error){
    res.render('index',{error:error.message});
  }
    
});
//users route
//------
app.use("/api/v1/users",userRoutes);

  //posts route
  //------
  app.use("/api/v1/posts",postRoutes);
 
  //comments
  //------
  app.use("/api/v1/comments",commentRoutes);

//Error hadnler
app.use(globalErrHandler);


const PORT=process.env.PORT || 9000;

app.listen(PORT,console.log("Server is running on ${PORT}"))