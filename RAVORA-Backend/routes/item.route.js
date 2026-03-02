const { mensclothing } = require("../controllers/itemcard.controller");

const express = require("express");
const router = express.Router();

router.get("/mensclothing",mensclothing);

module.exports = router;