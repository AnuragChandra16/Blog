const mongoose=require('mongoose');
const dbConnect=async ()=>{
    try{
        await mongoose.connect('mongodb+srv://anuragchandra1601:vIvusQKfjbZK8wUw@blogapp.gik2fhc.mongodb.net/blogapp?retryWrites=true&w=majority&appName=blogapp');
        console.log('DB Connected Successfully');
    }catch(error){
        console.log('DB Connection failed',error.message);

    }

};
dbConnect();