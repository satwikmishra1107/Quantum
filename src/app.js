const express = require("express")
const app=express()
const port=process.env.PORT || 4000
const path=require("path")
const hbs=require("hbs")
// const { title } = require("process")

const staticPath=path.join(__dirname,"../public")
app.use(express.static(staticPath))
app.set('view engine',"hbs")

const templatepath=path.join(__dirname,"../templates/views")
const partialpath=path.join(__dirname,"../templates/partials")

hbs.registerPartials(partialpath)
app.set('views',templatepath)
app.get("/login",(req,res)=>{
    res.render("login")
})
app.get("/home",(req,res)=>{
    res.render("home")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/consult",(req,res)=>{
    res.render("consult")
})
app.get("*",(req,res)=>{
    res.render("error",({
        errmsg: `Oops! the page could not be found` 
    }))
})

app.listen(port,()=>{
    console.log(`The program is listening to the port ${port}`)
})