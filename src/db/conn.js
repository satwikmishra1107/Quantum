const mongoose=require("mongoose");

const DB=process.env.DATABASE;
//const localmongo=mongodb://localhost:27017/userregistrationdetail;
mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection succesfully");
}).catch((err)=>{
    console.log("not connected");
})