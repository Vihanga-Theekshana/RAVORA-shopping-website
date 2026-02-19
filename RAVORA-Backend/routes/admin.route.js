const router = require("express").Router();
const {isAdmin} = require("../middleware/auth.middleware")

 router.get("/dashboard",isAdmin,(req,res)=>{
    res.json({message:"welcome admin", user:req.session.user});
 })
module.exports = router;