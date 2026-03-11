import db from "../db.js";

// add item to cart
export const addToCart = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    if (!user_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "user_id and product_id are required",
      });
    }

    const qty = quantity || 1;

    // check user cart
    const [cartRows] = await db.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [user_id]
    );

    let cart_id;

    if (cartRows.length === 0) {
      // create cart
      const [newCart] = await db.query(
        "INSERT INTO carts (user_id) VALUES (?)",
        [user_id]
      );
      cart_id = newCart.insertId;
    } else {
      cart_id = cartRows[0].id;
    }

    // check if product already exists in cart
    const [itemRows] = await db.query(
      "SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cart_id, product_id]
    );

    if (itemRows.length > 0) {
      // update quantity
      await db.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?",
        [qty, cart_id, product_id]
      );
    } else {
      // insert new item
      await db.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cart_id, product_id, qty]
      );
    }

    res.json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    console.log("addToCart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// get cart items
export const getCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [items] = await db.query(
      `SELECT 
        cart_items.id,
        cart_items.product_id,
        cart_items.quantity,
        products.name,
        products.price,
        products.images
       FROM cart_items
       JOIN carts ON cart_items.cart_id = carts.id
       JOIN products ON cart_items.product_id = products.id
       WHERE carts.user_id = ?`,
      [user_id]
    );

    res.json({
      success: true,
      cart: items,
    });
  } catch (error) {
    console.log("getCart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// update cart item quantity
export const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    await db.query("UPDATE cart_items SET quantity = ? WHERE id = ?", [
      quantity,
      id,
    ]);

    res.json({
      success: true,
      message: "Cart updated",
    });
  } catch (error) {
    console.log("updateCartItem error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// remove item from cart
export const removeCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM cart_items WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Item removed",
    });
  } catch (error) {
    console.log("removeCartItem error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// clear user cart
export const clearCart = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [cartRows] = await db.query(
      "SELECT id FROM carts WHERE user_id = ?",
      [user_id]
    );

    if (cartRows.length === 0) {
      return res.json({
        success: true,
        message: "Cart already empty",
      });
    }

    const cart_id = cartRows[0].id;

    await db.query("DELETE FROM cart_items WHERE cart_id = ?", [cart_id]);

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.log("clearCart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};