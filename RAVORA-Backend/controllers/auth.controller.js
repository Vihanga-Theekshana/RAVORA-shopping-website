const bcrypt = require("bcrypt");
const pool = require("../db");

async function register(req,res) {

    try{
        const{username,email,password} = req.body;
        
        if(!username || !email || !password){
           return res.status(400).json({message:"All fields are required !"});
        
        }
           const[existing] = await pool.query("SELECT id FROM users WHERE email = ?",[email]);
           if(existing.length>0){
            return res.status(400).json({message:"email already registerd !"});
           }

           const password_hash = await bcrypt.hash(password,10);
           
           await pool.query(
            "INSERT INTO users (username,email,password_hash) VALUES(? ,? ,? )",[username,email,password_hash]
           )
           return res.status(200).json({message:"register successfuly "});
        }catch(err){
            console.log(err);
            return res.status(500).json({message:"server error"});
        }

    
}

module.exports = {register};