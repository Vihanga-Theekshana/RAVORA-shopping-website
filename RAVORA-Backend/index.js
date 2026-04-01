require("dotenv").config();
const authroute = require("./routes/auth.route");
const adminroute = require("./routes/admin.route");
const itemroute = require("./routes/item.route");
const cartroute = require("./routes/cart.route");
const paymentroute = require("./routes/payment.route");
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
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth",authroute);
app.use("/api/admin",adminroute);
app.use("/upload", express.static("uploads"));
app.use("/api/item",itemroute); //item route
app.use("/api/item/additem",cartroute);
app.use("/api/item/getitem",cartroute);
app.use("/api/item/removeitem",cartroute);
app.use("/api/orders",paymentroute);
app.use("/api/payhere",paymentroute);


const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log("server listening on port: " + port);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other server and restart nodemon.`);
    return;
  }

  console.error("Server failed to start:", error);
});
