const jwt = require('jsonwebtoken');
const getAuthToken=(user)=>{
    const secretkey=process.env.SECRET_KEY
    const token =jwt.sign({
        _id:user.id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin
    },
    secretkey,
    );
    return token;
}
module.exports=getAuthToken;