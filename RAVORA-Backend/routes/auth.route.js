const express = require("express");
const { register,login } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register",register); //register end point
router.post("/login",login) //login end point
router.get("/me",(req,res)=>{
    if(! req.session.user){
        return res.status(401).json({ message: "Not logged in" });
    }
    res.json({user:req.session.user});
})

module.exports=router;