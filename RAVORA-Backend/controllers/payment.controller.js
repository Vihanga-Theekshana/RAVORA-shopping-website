const pool = require("../db");
require("dotenv").config;
const crypto = require("crypto");

// temp storage (later use DB)
const orders = new Map();

const md5 = (text) =>
  crypto.createHash("md5").update(text).digest("hex").toUpperCase();

const formatAmount = (amount) => Number(amount).toFixed(2);
const isPublicUrl = (url) => {
  if (!url) return false;
  return !/localhost|127\.0\.0\.1/i.test(url);
};

// ----------- cashon delevery --------------

async function cod(req, res) {
  const connection = await pool.getConnection();
  const user_id = req.user.id;

  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      subtotal,
      deliveryFee,
      amount,
      items,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !subtotal ||
      !deliveryFee ||
      !amount ||
      !items ||
      !items.length
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const orderId = "COD-" + Date.now();

    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders
      (order_id,user_id,full_name, email, phone, address, city, postal_code, subtotal, delivery_fee, total_amount, payment_method, payment_status, order_status)
      VALUES (?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        user_id,
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        subtotal,
        deliveryFee,
        amount,
        "COD",
        "PENDING_COD",
        "PLACED",
      ]
    );

    const dbOrderId = orderResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, product_price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          dbOrderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.image,
        ]
      );
    }

    await connection.commit();

    res.json({ orderId });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
}

// ----------------create payment ------------------------
async function createpayment(req,res) {

  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postal_code,
      items,
      amount,
    } = req.body;

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const frontendUrl = process.env.FRONTEND_URL;
    const backendUrl = process.env.BACKEND_URL;
    const useSandbox = process.env.PAYHERE_SANDBOX !== "false";
    const paymentUrl = useSandbox
      ? "https://sandbox.payhere.lk/pay/checkout"
      : "https://www.payhere.lk/pay/checkout";

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postal_code ||
      !items ||
      !amount
    ) {
      return res.status(400).json({ message: "Missing payment fields" });
    }

    if (!merchantId || !merchantSecret) {
      return res.status(500).json({
        message: "PayHere merchant credentials are not configured",
      });
    }

    if (!frontendUrl || !backendUrl) {
      return res.status(500).json({
        message: "Frontend or backend URL is not configured",
      });
    }

    if (!isPublicUrl(backendUrl)) {
      console.warn(
        "PayHere notify_url is not public. Payment notifications will not reach localhost.",
      );
    }

    const orderId = "CARD-" + Date.now();
    const currency = "LKR";
    const formattedAmount = formatAmount(amount);
    const hashedSecret = md5(merchantSecret);

    const hash = md5(
      merchantId +
        orderId +
        formattedAmount +
        currency +
        hashedSecret
    );

    orders.set(orderId, {
      orderId,
      email,
      amount: formattedAmount,
      paymentMethod: "CARD",
      status: "PENDING",
    });

    res.json({
      paymentUrl,
      formData: {
        merchant_id: merchantId,
        return_url: `${frontendUrl}/success?order_id=${orderId}`,
        cancel_url: `${frontendUrl}/cancel`,
        notify_url: `${backendUrl}/api/payhere/notify`,

        order_id: orderId,
        items,
        currency,
        amount: formattedAmount,

        first_name,
        last_name,
        email,
        phone,
        address,
        city,
        country: "Sri Lanka",

        hash,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment error" });
  }
}


// -----------payhere notify ----------------
async function notify(req,res) {
   
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      return res.status(500).send("Merchant secret not configured");
    }

    const localSig = md5(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        md5(merchantSecret)
    );

    const order = orders.get(order_id);

    if (!order) return res.send("Order not found");

    if (localSig === md5sig && status_code == "2") {
      order.status = "PAID";
      console.log("PAID:", order_id);
    } else {
      order.status = "FAILED";
    }

    res.send("OK");

  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR");
  }
}
    




module.exports = {cod,createpayment,notify};