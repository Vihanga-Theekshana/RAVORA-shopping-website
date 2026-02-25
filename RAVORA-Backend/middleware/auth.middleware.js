const jwt = require("jsonwebtoken");
require("dotenv").config();
function veryfytoken(req,res,next){
 const authheader = req.headers.authorization;
   if (!authheader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authheader.split(" ")[1];
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    return res.status(401).json({ message: "Invalid token" });
  }
}
function isAdmin(req,res,next){
    if(req.user.role !== "admin"){
        return res.status(403).json({ message: "Admin access only" });
    }
    next();

}

module.exports = {isAdmin,veryfytoken}