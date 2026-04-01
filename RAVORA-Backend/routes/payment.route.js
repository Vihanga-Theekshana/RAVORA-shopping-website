const express = require("express");
const {cod,createpayment,notify,getUserOrders} = require("../controllers/payment.controller");
const { veryfytoken } = require("../middleware/auth.middleware");

const router = express.Router();

// COD ROUTE
router.post("/cod",veryfytoken, cod);
// PAYHERE CREATE
router.post("/create-payment",veryfytoken,createpayment);
router.get("/my-orders",veryfytoken,getUserOrders);
// PAYHERE NOTIFY
router.post("/notify",notify);

module.exports = router;
