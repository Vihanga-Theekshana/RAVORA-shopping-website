const pool = require("../db")
const isUnknownColumnError = (error) =>
    error?.code === "ER_BAD_FIELD_ERROR" ||
    /unknown column/i.test(error?.message || "");

async function admin(req,res) {
try{
   const{name,description,catagory,price,offerprice,sizes,colors} = req.body;

if(! req.files || req.files.length === 0){
    return res.status(400).json({ message: "No images uploaded" });
}
    const imagepaths = req.files.map(file => file.filename);
    const parsedSizes = Array.isArray(sizes)
      ? sizes
      : sizes
        ? [sizes]
        : [];
    const parsedColors = Array.isArray(colors)
      ? colors
      : colors
        ? [colors]
        : [];
    try {
        await pool.query("INSERT INTO PRODUCTS (name,description,category,price,offerPrice,images,sizes,colors,in_stock) VALUES(?,?,?,?,?,?,?,?,?)",[name,description,catagory,price,offerprice,JSON.stringify(imagepaths),JSON.stringify(parsedSizes),JSON.stringify(parsedColors),1]);
    } catch (err) {
        if (!isUnknownColumnError(err)) {
            throw err;
        }
        await pool.query("INSERT INTO PRODUCTS (name,description,category,price,offerPrice,images) VALUES(?,?,?,?,?,?)",[name,description,catagory,price,offerprice,JSON.stringify(imagepaths)]);
    }
    return res.status(200).json({message:"upload successfuly"});
}catch(err){
    console.log(err);
    return res.status(500).json({message:"server error"});
}


    
}

async function deleteitem(req,res) {
    try{
     const id = req.body.id;
    await pool.query("DELETE FROM products WHERE id = ?",[id]);
    return res.status(200).json({message:"delete successfuly"});    
    }catch(err){
        console.log(err);
    }
   
}

async function updateItem(req, res) {
    try {
        const { id, name, description, category, price, offerprice } = req.body;
        await pool.query(
            "UPDATE products SET name = ?, description = ?, category = ?, price = ?, offerPrice = ? WHERE id = ?",
            [name, description, category, price, offerprice, id]
        );
        return res.status(200).json({ message: "update successfuly" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
}

async function toggleStock(req, res) {
    try {
        const { id, inStock } = req.body;
        try {
            await pool.query("UPDATE products SET in_stock = ? WHERE id = ?", [inStock ? 1 : 0, id]);
        } catch (err) {
            if (!isUnknownColumnError(err)) {
                throw err;
            }
            return res.status(400).json({ message: "in_stock column missing" });
        }
        return res.status(200).json({ message: "stock updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
}

async function getDashboard(req, res) {
    try {
        const [[productStats]] = await pool.query(
            `SELECT 
                COUNT(*) AS totalProducts,
                SUM(CASE WHEN in_stock = 0 THEN 1 ELSE 0 END) AS outOfStock
             FROM products`
        );

        const [[orderStats]] = await pool.query(
            `SELECT
                COUNT(*) AS totalOrders,
                SUM(CASE WHEN payment_status IN ("PENDING", "PENDING_COD") THEN 1 ELSE 0 END) AS pendingOrders,
                SUM(CASE WHEN payment_status = "PAID" THEN total_amount ELSE 0 END) AS totalSales
             FROM orders`
        );

        const [[userStats]] = await pool.query(
            `SELECT COUNT(*) AS registeredUsers FROM users WHERE role = "user" OR role IS NULL`
        );

        let orders;
        try {
            [orders] = await pool.query(
                `SELECT 
                    o.id,
                    o.order_id,
                    o.full_name,
                    o.email,
                    o.phone,
                    o.address,
                    o.city,
                    o.postal_code,
                    o.total_amount,
                    o.payment_method,
                    o.payment_status,
                    o.order_status,
                    o.created_at
                 FROM orders o
                 ORDER BY o.created_at DESC, o.id DESC`
            );
        } catch (error) {
            if (!isUnknownColumnError(error)) {
                throw error;
            }
            [orders] = await pool.query(
                `SELECT 
                    o.id,
                    o.order_id,
                    o.full_name,
                    o.email,
                    o.phone,
                    o.address,
                    o.city,
                    o.postal_code,
                    o.total_amount,
                    o.payment_method,
                    o.payment_status,
                    o.order_status
                 FROM orders o
                 ORDER BY o.id DESC`
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
                    orderIds
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
                        orderIds
                    );
                } catch (nestedError) {
                    if (!isUnknownColumnError(nestedError)) {
                        throw nestedError;
                    }
                    [orderItems] = await pool.query(
                        `SELECT order_id, product_name, product_price, quantity, image
                         FROM order_items
                         WHERE order_id IN (${placeholders})`,
                        orderIds
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

        const formattedOrders = orders.map((order) => ({
            ...order,
            items: itemsByOrderId[order.id] || [],
        }));

        return res.status(200).json({
            stats: {
                totalProducts: Number(productStats?.totalProducts || 0),
                outOfStock: Number(productStats?.outOfStock || 0),
                totalOrders: Number(orderStats?.totalOrders || 0),
                pendingOrders: Number(orderStats?.pendingOrders || 0),
                totalSales: Number(orderStats?.totalSales || 0),
                registeredUsers: Number(userStats?.registeredUsers || 0),
            },
            orders: formattedOrders,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to load dashboard" });
    }
}

async function getOrderDetail(req, res) {
    try {
        const { id } = req.params;
        let orders;

        try {
            [orders] = await pool.query(
                `SELECT id, order_id, full_name, email, phone, address, city, postal_code,
                        total_amount, payment_method, payment_status, order_status, created_at
                 FROM orders
                 WHERE id = ?`,
                [id]
            );
        } catch (error) {
            if (!isUnknownColumnError(error)) {
                throw error;
            }
            [orders] = await pool.query(
                `SELECT id, order_id, full_name, email, phone, address, city, postal_code,
                        total_amount, payment_method, payment_status, order_status
                 FROM orders
                 WHERE id = ?`,
                [id]
            );
        }

        if (orders.length === 0) {
            return res.status(404).json({ message: "order not found" });
        }

        const order = orders[0];
        let items = [];

        try {
            [items] = await pool.query(
                `SELECT product_name, product_price, quantity, image, size, color
                 FROM order_items
                 WHERE order_id = ?`,
                [order.id]
            );
        } catch (error) {
            if (!isUnknownColumnError(error)) {
                throw error;
            }

            try {
                [items] = await pool.query(
                    `SELECT product_name, product_price, quantity, image, size
                     FROM order_items
                     WHERE order_id = ?`,
                    [order.id]
                );
            } catch (nestedError) {
                if (!isUnknownColumnError(nestedError)) {
                    throw nestedError;
                }
                [items] = await pool.query(
                    `SELECT product_name, product_price, quantity, image
                     FROM order_items
                     WHERE order_id = ?`,
                    [order.id]
                );
            }
        }

        return res.status(200).json({ order: { ...order, items } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to load order detail" });
    }
}

async function completeOrder(req, res) {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE orders SET order_status = "DELIVERED" WHERE id = ?`,
            [id]
        );
        return res.status(200).json({ message: "order completed" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "failed to complete order" });
    }
}

module.exports = {admin,deleteitem,updateItem,toggleStock,getDashboard,getOrderDetail,completeOrder}
