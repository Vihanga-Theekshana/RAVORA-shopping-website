require("dotenv").config();
const authroute = require("./routes/auth.route");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(session({secret:process.env.JWT_SECRET,resave:false, saveUninitialized:false}));
app.use(express.json());
app.use("/api/auth",authroute);



console.log('server listening on port: '+ process.env.PORT);
app.listen(process.env.PORT);