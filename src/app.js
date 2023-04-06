const dotenv=require("dotenv");
require('dotenv').config();
const express=require("express");
const app=express();
const port=process.env.PORT;
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser");
const auth=require("./middleware/auth");
const path=require("path");
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const validator=require("validator");

require("./db/conn");
const Register=require("./models/register");
const { json }=require("express");
const { log }=require("console");


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

const staticpath=path.join(__dirname,"../public");
const templatespath=path.join(__dirname,"../templates/views");
const partialpath=path.join(__dirname,"../templates/partials");

app.use(express.static(staticpath));

app.set("view engine","hbs");
hbs.registerPartials(partialpath);
app.set("views",templatespath);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/consult",(req,res)=>{
    res.render("consult")
})

app.get("/secret",auth,(req,res)=>{
    res.render("secret");
})

app.get("/about",(req,res)=>{
    res.render("about");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/logout",auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((currElement)=>{
            return currElement.token!==req.token
        })

        res.clearCookie("jwt");
        console.log("logout Successfully");
        await req.user.save();
        res.render("login");
    }
    catch(error){
        res.status(400).send(error);
    }
})

app.post("/register",async (req,res)=>{
    //try{
    const password=req.body.password;
    const cpassword=req.body.cpassword;
    
    if(password===cpassword){
        const userdetail=new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            age: req.body.age,
            password: req.body.password,
            cpassword: req.body.cpassword
        })
        const token=await userdetail.generateAuthToken();
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+1800000),
            httpOnly: true
        })
        const registered=await userdetail.save();
        res.status(201).render("secret");
    }
    else{
        //alert("password is not matching");
        //res.render("404page");
        res.send("password not matching");
    }
    //}
    // catch(err){
    //     res.status(400).send(err);
    //     console.log("error part page");
    // }
})

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        //console.log(email);
        const useremail=await Register.findOne({email:email});
        //console.log(useremail);
        const isMatch=await bcrypt.compare(password,useremail.password);
        //console.log(isMatch);
        //const token=await useremail.generateAuthToken();
        //console.log(isMatch);
        //console.log("the token part"+token);
        // res.cookie("jwt",token,{
        //     expires: new Date(Date.now()+1000000),
        //     httpOnly: true
        // })

        if(isMatch){
            const token=await useremail.generateAuthToken();
            res.cookie("jwt",token,{
                expires: new Date(Date.now()+1800000),
                httpOnly: true
            })
            res.status(200).render("secret");
        }
        else{
            //alert("password is not matching");
            //res.status(400).send("password is not matching");
            res.status(400).render("login",{ errorMessage: "Invalid email or password." });
        }
    }
    catch(error){
        //alert("password is not matching");
        res.status(400).render("login");
        //res.status(400).send("invalid email");
    }
})

app.get("*",(req,res)=>{
    res.render("404page",({
        errmsg: `Oops! the page could not be found` 
    }))
})

app.listen(port,()=>{
    console.log(`port is running on ${port}`)
});