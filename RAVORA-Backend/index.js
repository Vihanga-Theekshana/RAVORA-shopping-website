require("dotenv").config();
const authroute = require("./routes/auth.route");
const adminroute = require("./routes/admin.route");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);


app.use(express.json());
app.use(session( {secret:process.env.JWT_SECRET,resave:false, saveUninitialized:false ,cookie: {
      httpOnly: true,
     
    },}));

app.use("/api/auth",authroute);
app.use("/api/admin",adminroute);
app.use("/upload", express.static("uploads"));


console.log('server listening on port: '+ process.env.PORT);
app.listen(process.env.PORT);