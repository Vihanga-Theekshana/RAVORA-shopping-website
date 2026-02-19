const bcrypt = require("bcrypt");
const pool = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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



async function login(req,res) {
    const email = req.body.email;
    const password = req.body.password;
    try{
        

        if(!password || !email){
            return res.status(400).json({message:"error login"});
        }

        const [users] = await pool.query("SELECT id,username,password_hash,email,role FROM users WHERE email = ?",[email]);
    
        if(users.length === 0){
            return res.status(400).json({message:"invalid email or password "})
        }

        const user = users[0];

        // compare password with hash
        const ok = await bcrypt.compare(password,user.password_hash);

        if(!ok){
            return res.status(400).json({message:"invalid email or password "})
        }

        let accesstoken = jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:60 * 60});

        // store token in the session
        req.session.authorization = {accesstoken}
        req.session.user = {id:user.id,username:user.username,email:user.email,role:user.role}
        return res.status(200).json({message:"login successful" ,user:{ id:user.id , username : user.username , email : user.email} })
 
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"server error"});
    }
    
}





module.exports = {register,login};