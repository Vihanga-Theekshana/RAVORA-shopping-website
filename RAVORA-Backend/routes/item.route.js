const { clothing } = require("../controllers/itemcard.controller");

const express = require("express");
const router = express.Router();

router.get("/mensclothing",clothing);
router.get("/womenclothing",clothing);
router.get("/home",clothing);


module.exports = router;