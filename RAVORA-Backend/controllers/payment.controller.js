const pool = require("../db");
require("dotenv").config();
const crypto = require("crypto");

const md5 = (text) =>
  crypto.createHash("md5").update(text).digest("hex").toUpperCase();

const formatAmount = (amount) => Number(amount).toFixed(2);
const isPublicUrl = (url) => {
  if (!url) return false;
  return !/localhost|127\.0\.0\.1/i.test(url);
};
const isUnknownColumnError = (error) =>
  error?.code === "ER_BAD_FIELD_ERROR" ||
  /unknown column/i.test(error?.message || "");

const insertOrderItem = async (connection, dbOrderId, item) => {
  try {
    await connection.query(
      `INSERT INTO order_items
      (order_id, product_id, product_name, product_price, quantity, image, size, color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dbOrderId,
        item.product_id,
        item.product_name,
        item.product_price,
        item.quantity,
        item.image,
        item.size || null,
        item.color || null,
      ]
    );
  } catch (err) {
    if (!isUnknownColumnError(err)) {
      throw err;
    }

    try {
      await connection.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, product_price, quantity, image, size)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          dbOrderId,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.image,
          item.size || null,
        ]
      );
      return;
    } catch (nestedErr) {
      if (!isUnknownColumnError(nestedErr)) {
        throw nestedErr;
      }
    }

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
      subtotal == null ||
      deliveryFee == null ||
      amount == null ||
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
      await insertOrderItem(connection, dbOrderId, item);
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
const connection = await pool.getConnection();
  try {
    const {
      fullName,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      postal_code,
      deliveryFee,
      subtotal,
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
      !fullName ||
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      subtotal == null||
      deliveryFee == null ||
      amount == null||
      !postal_code ||
      !items ||
      !items.length
    ) 
    {
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
    
    await connection.beginTransaction();
    const user_id = req.user.id;
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
        postal_code,
        subtotal,
        deliveryFee,
        amount,
        "CARD",
        "PENDING",
        "PLACED",
      ]
    );

    const dbOrderId = orderResult.insertId;

    for (const item of items) {
      await insertOrderItem(connection, dbOrderId, item);
    }

    await connection.commit();

    res.json({
      paymentUrl,
      formData: {
        merchant_id: merchantId,
        return_url: `${frontendUrl}/success?order_id=${orderId}`,
        cancel_url: `${frontendUrl}/checkout`,
        notify_url: `${backendUrl}/api/payhere/notify`,

        order_id: orderId,
        items :"RAVORA Clothing Order",
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
    await connection.rollback();
    res.status(500).json({ message: "Payment error" });
  }
  finally {
  connection.release();
}
}


// -----------payhere notify ----------------
async function notify(req,res) {
   
  try {
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    if (!merchantSecret) {
      return res.status(500).send("Merchant secret not configured");
    }
    const localSig = md5(
      req.body.merchant_id +
        req.body.order_id +
        req.body.payhere_amount +
        req.body.payhere_currency +
        req.body.status_code +
        md5(merchantSecret)
    );


    if (localSig === req.body.md5sig && req.body.status_code == "2") {
     await pool.query(
      `UPDATE orders SET payment_status = "PAID" WHERE order_id = ? `,[req.body.order_id]
     );
      console.log("PAID:", req.body.order_id);
      
    } else {
       await pool.query(
      `UPDATE orders SET payment_status = "FAILED" WHERE order_id = ? `,[req.body.order_id]
     );
    }

    res.send("OK");

  } catch (err) {
    console.error(err);
    res.status(500).send("ERROR");
  }
}

async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    let orders;

    try {
      [orders] = await pool.query(
        `SELECT id, order_id, full_name, email, phone, address, city, postal_code,
                total_amount, payment_method, payment_status, order_status, created_at
         FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC, id DESC`,
        [userId],
      );
    } catch (error) {
      if (!isUnknownColumnError(error)) {
        throw error;
      }

      [orders] = await pool.query(
        `SELECT id, order_id, full_name, email, phone, address, city, postal_code,
                total_amount, payment_method, payment_status, order_status
         FROM orders
         WHERE user_id = ?
         ORDER BY id DESC`,
        [userId],
      );
    }

    const orderIds = orders.map((order) => order.id);
    let orderItems = [];

    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => "?").join(", ");

      try {
        [orderItems] = await pool.query(
          `SELECT order_id, product_name, product_price, quantity, image, size, color
           FROM order_items
           WHERE order_id IN (${placeholders})`,
          orderIds,
        );
      } catch (error) {
        if (!isUnknownColumnError(error)) {
          throw error;
        }

        try {
          [orderItems] = await pool.query(
            `SELECT order_id, product_name, product_price, quantity, image, size
             FROM order_items
             WHERE order_id IN (${placeholders})`,
            orderIds,
          );
        } catch (nestedError) {
          if (!isUnknownColumnError(nestedError)) {
            throw nestedError;
          }

          [orderItems] = await pool.query(
            `SELECT order_id, product_name, product_price, quantity, image
             FROM order_items
             WHERE order_id IN (${placeholders})`,
            orderIds,
          );
        }
      }
    }

    const itemsByOrderId = orderItems.reduce((acc, item) => {
      if (!acc[item.order_id]) {
        acc[item.order_id] = [];
      }
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const result = orders.map((order) => ({
      ...order,
      items: itemsByOrderId[order.id] || [],
    }));

    res.json({ orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

async function cancelUserOrder(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [orders] = await pool.query(
      `SELECT id, order_status FROM orders WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orders[0].order_status === "DELIVERED") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }

    if (orders[0].order_status === "CANCELLED") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    await pool.query(`UPDATE orders SET order_status = "CANCELLED" WHERE id = ?`, [
      id,
    ]);

    return res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to cancel order" });
  }
}

module.exports = {cod,createpayment,notify,getUserOrders,cancelUserOrder};
