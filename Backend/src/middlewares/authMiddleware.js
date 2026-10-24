/* middleware to verify the user */
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/blacklist-model');

module.exports.authUser = async function(req,res,next){
    const token = req.cookies.token;

if(!token){
    return res.status(401).json({
        message : "Token is not avilable",
    })
}

const blackList = await tokenModel.findOne({token});
if(blackList){
    return res.status(401).json({
        message : "Invalid token",
    })
}

try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRETS);
    req.user = decoded;

    next();

}catch(err){
    return res.status(401).json({
        message : " Invalid token ",
    });

}

}