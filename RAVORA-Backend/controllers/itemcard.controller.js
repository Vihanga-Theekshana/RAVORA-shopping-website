const pool = require("../db");
require("dotenv").config();
const isUnknownColumnError = (error) =>
  error?.code === "ER_BAD_FIELD_ERROR" ||
  /unknown column/i.test(error?.message || "");

// create mensclothing function to retreve product table
async function clothing (req,res) {
    try{
        // get value in product table
        let item;
        try {
            [item] =await pool.query("SELECT id,name,description,category,price,images,sizes,colors,in_stock FROM products" );
        } catch (err) {
            if (!isUnknownColumnError(err)) {
                throw err;
            }
            [item] = await pool.query("SELECT id,name,description,category,price,images FROM products" );
        }
        if(item.length == 0){
            return res.status(400).json({message:"empty items"});
        }
        return res.status(200).json({item});

    }catch(err){
        console.log(err);
    }

    
}
async function eachclothing(req,res) {
   try{
        // get value in product table
        const {id} = req.query;
        let item;
        try {
            [item] =await pool.query("SELECT id,name,description,category,price,images,sizes,colors,in_stock FROM products WHERE id = ?" , [id] );
        } catch (err) {
            if (!isUnknownColumnError(err)) {
                throw err;
            }
            [item] = await pool.query("SELECT id,name,description,category,price,images FROM products WHERE id = ?" , [id] );
        }
        if(item.length == 0){
            return res.status(400).json({message:"empty items"});
        }
        return res.status(200).json({item});

    }catch(err){
        console.log(err);
    }
    
}

module.exports = {clothing,eachclothing};
