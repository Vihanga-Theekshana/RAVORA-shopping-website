const express = require("express");
const {cod,createpayment,notify} = require("../controllers/payment.controller");
const { veryfytoken } = require("../middleware/auth.middleware");

const router = express.Router();

// COD ROUTE
router.post("/cod",veryfytoken, cod);
// PAYHERE CREATE
router.post("/create-payment",veryfytoken,createpayment);
// PAYHERE NOTIFY
router.post("/notify",notify);

module.exports = router;
