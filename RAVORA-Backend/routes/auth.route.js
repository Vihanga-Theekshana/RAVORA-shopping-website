const express = require("express");
const { register,login } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register",register); //register end point
router.post("/login",login) //login end point

module.exports=router;