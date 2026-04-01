const router = require("express").Router();
const {isAdmin,veryfytoken} = require("../middleware/auth.middleware")
const {admin,deleteitem,updateItem,toggleStock,getDashboard,getOrderDetail,completeOrder} = require("../controllers/admin.controller");
const upload = require("../middleware/upload");

router.get("/dashboard",veryfytoken,isAdmin,getDashboard)
router.get("/orders/:id",veryfytoken,isAdmin,getOrderDetail);
router.post("/additem",veryfytoken,isAdmin,upload.array("images",4),admin);
router.post("/deleteitem",veryfytoken,isAdmin,deleteitem);
router.post("/updateitem",veryfytoken,isAdmin,updateItem);
router.post("/togglestock",veryfytoken,isAdmin,toggleStock);
router.post("/orders/:id/complete",veryfytoken,isAdmin,completeOrder);


module.exports = router;
