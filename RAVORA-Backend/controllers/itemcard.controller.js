const pool = require("../db");
require("dotenv").config();

// create mensclothing function to retreve product table
async function clothing (req,res) {
    try{
        // get value in product table
        const[item] =await pool.query("SELECT id,name,description,category,price,offerPrice,images FROM products" );
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
        const[item] =await pool.query("SELECT id,name,description,category,price,offerPrice,images FROM products WHERE id = ?" , [id] );
        if(item.length == 0){
            return res.status(400).json({message:"empty items"});
        }
        return res.status(200).json({item});

    }catch(err){
        console.log(err);
    }
    
}

module.exports = {clothing,eachclothing};