const router = require("express").Router();
const {isAdmin} = require("../middleware/auth.middleware")
const {admin} = require("../controllers/admin.controller");
const upload = require("../middleware/upload");

router.get("/dashboard",isAdmin,(req,res)=>{
    res.json({message:"welcome admin", user:req.session.user});
 })
router.post("/additem",isAdmin,upload.array("images",4),admin);


module.exports = router;