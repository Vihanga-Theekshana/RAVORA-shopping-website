require("dotenv").config();
const authroute = require("./routes/auth.route");
const adminroute = require("./routes/admin.route");
const itemroute = require("./routes/item.route");
const cartroute = require("./routes/cart.route");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);


app.use(express.json());
app.use("/api/auth",authroute);
app.use("/api/admin",adminroute);
app.use("/upload", express.static("uploads"));
app.use("/api/item",itemroute); //item route
app.use("/api/item/additem",cartroute);
app.use("/api/item/getitem",cartroute);


console.log('server listening on port: '+ process.env.PORT);
app.listen(process.env.PORT);