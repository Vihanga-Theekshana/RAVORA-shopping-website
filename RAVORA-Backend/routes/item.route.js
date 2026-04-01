const { clothing,eachclothing} = require("../controllers/itemcard.controller");

const express = require("express");
const router = express.Router();

router.get("/mensclothing",clothing);
router.get("/womenclothing",clothing);
router.get("/home",clothing);
router.get("/getitemdetail",eachclothing);


module.exports = router;
