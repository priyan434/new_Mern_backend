const jwt=require("jsonwebtoken");
const auth=(req,res,next)=>{
const token=req.header('x-auth-token');

if(!token){
    return res.status(401).send("Acess denied");
}
try{
    const secretkey=process.env.SECRET_KEY
const user=jwt.verify(token,secretkey);
req.user=user;
next()
}catch(err){
    console.log(err);
    return res.status(401).send("Acess denied,invalid auth token");
}
}
const isAdmin=(req,res,next)=>{
    auth(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            return res.status(403).send("Acess denied,not authorized");
        }
    })

}
module.exports={auth,isAdmin}