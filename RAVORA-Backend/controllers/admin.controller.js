const pool = require("../db")
async function admin(req,res) {
try{
   const{name,description,catagory,price,offerprice} = req.body;

if(! req.files || req.files.length === 0){
    return res.status(400).json({ message: "No images uploaded" });
}
    const imagepaths = req.files.map(file => file.filename);
    await pool.query("INSERT INTO PRODUCTS (name,description,category,price,offerPrice,images) VALUES(?,?,?,?,?,?)",[name,description,catagory,price,offerprice,JSON.stringify(imagepaths)]);
    return res.status(200).json({message:"upload successfuly"});
}catch(err){
    console.log(err);
    return res.status(500).json({message:"server error"});
}


    
}

async function deleteitem(req,res) {
    const id = req.body.id;
    await pool.query("DELETE FROM products WHERE id = ?",[id]);
    return res.status(200).json({message:"delete successfuly"});
}





module.exports = {admin,deleteitem}