const express = require("express");
const { register,login} = require("../controllers/auth.controller");
const { veryfytoken } = require("../middleware/auth.middleware");
const {email,veryfyotp,resetpassword} = require("../controllers/forgotpassword.controller")
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db")

router.post("/register",register); //register end point
router.post("/login",login) //login end point
router.get("/me",veryfytoken,(req,res)=>{
    res.json({user:req.user});
})

router.post("/logout",(req,res)=>{
        res.json({message:"logout successfuly"});
})

router.post("/send-otp",email);
router.post("/verify-otp",veryfyotp);
router.post("/reset-password",resetpassword);

module.exports=router;