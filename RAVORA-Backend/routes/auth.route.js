const express = require("express");
const { register,login } = require("../controllers/auth.controller");
const { veryfytoken } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register",register); //register end point
router.post("/login",login) //login end point
router.get("/me",veryfytoken,(req,res)=>{
    res.json({user:req.user});
})

router.post("/logout",(req,res)=>{
        res.json({message:"logout successfuly"});
})

module.exports=router;