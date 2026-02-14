require("dotenv").config();
const authroute = require("./routes/auth.route");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authroute);


console.log('server listening on port: '+ process.env.PORT);
app.listen(process.env.PORT);