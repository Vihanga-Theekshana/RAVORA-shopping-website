function isAdmin(req,res,next){
    if(! req.session.user){
        return res.status(401).json({ message: "Not logged in" });
    }
    if(req.session.user.role !== "admin"){
        return res.status(403).json({ message: "Admin only" });
    }
    next();
}
module.exports = {isAdmin}