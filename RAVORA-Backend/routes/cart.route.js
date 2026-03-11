const express = require("express");
const { veryfytoken } = require("../middleware/auth.middleware");
const { addToCart, getCart } = require("../controllers/cart.controller");
const router = express.Router();

router.post("/addtocart",veryfytoken,addToCart);
router.get("/getcart",veryfytoken,getCart);

module.exports = router;