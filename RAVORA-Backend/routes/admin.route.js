const router = require("express").Router();
const {isAdmin,veryfytoken} = require("../middleware/auth.middleware")
const {admin,deleteitem} = require("../controllers/admin.controller");
const upload = require("../middleware/upload");

router.get("/dashboard",veryfytoken,isAdmin,(req,res)=>{
    res.json({message:"welcome admin", user:req.user});
 })
router.post("/additem",veryfytoken,isAdmin,upload.array("images",4),admin);
router.post("/deleteitem",veryfytoken,isAdmin,deleteitem);


module.exports = router;