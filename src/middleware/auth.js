const jwt=require("jsonwebtoken");
const Register=require("../models/register");

const auth= async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const varifyUser=jwt.verify(token,process.env.SECRET_KEY);

        const user=await Register.findOne({_id: varifyUser._id});
        req.token=token;
        req.user=user;

        next();
    }
    catch(error){
        res.status(400).send(error);
    }
}

module.exports=auth;