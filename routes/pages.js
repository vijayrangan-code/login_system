const express = require("express");// connect server
const router = express.Router();
const userController = require("../controllers/users");


//creating route   / - mean homepage- step 1
router.get(["/","/login"],(req,res) => {
    // res.send("<h1> hello vijay's family</h1>"); // sending reponse
    res.render("login");// connecting html template step -8
});

router.get("/register",(req,res)=>{
    res.render("register") // 
});

router.get("/profile",userController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("profile",{user:req.user});
    } else {
        res.redirect("/login")
    }
    // res.render("profile") 
});

router.get("/home",userController.isLoggedIn,(req,res)=>{
    // console.log(req.name);
    if(req.user){
        res.render("home",{user:req.user})
    } else {
        res.redirect("/login")
    }
    // res.render("home") // 
});

module.exports = router;