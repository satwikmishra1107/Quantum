const express=require("express");
const app=express();

const mongoose=require("mongoose");
const validator=require("validator");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const path=require("path");
const hbs=require("hbs");

const staticpath=path.join(__dirname,"../public");
const templatespath=path.join(__dirname,"../templates/views");
const partialpath=path.join(__dirname,"../templates/partials");

app.use(express.static(staticpath));

app.set("view engine","hbs");
hbs.registerPartials(partialpath);
app.set("views",templatespath);

const userSchema=new mongoose.Schema({
    firstname:{
        type: String,
        require: true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique: true,
        require: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Email is invalid");
        //     }
        // }
    },
    phone:{
        type: Number,
        unique: true,
        require: true
    },
    age:{
        type: Number,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    cpassword:{
        type: String,
        require: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken=async function(req,res){
    try{
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(error){
        //res.send("the error path",error)
        console.log(error);
        //res.render("404page");
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.cpassword=await bcrypt.hash(this.cpassword,10);
    }
    next();
})

const Register=new mongoose.model("Register",userSchema);
module.exports=Register;