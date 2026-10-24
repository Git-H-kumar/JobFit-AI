const userModel  = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/blacklist-model');

/* register new user */
module.exports.registerUser = async function (req, res){
    let {username, email, password} = req.body;

    /* check if user provided credentials */
    if(!username || !email || !password){
        return res.status(400).json({
            message : "please provide reqired credentials"
        });
    }

    /* check if user already exist */
    let userAlreadyExist = await userModel.findOne({email},{username});

    if(userAlreadyExist){
        return res.status(400).json({  // <--- 'return' added here
            message : "user already exist"
        });
    }

    /* create new user with 'hash' password */
    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password : hash,
    });

    /* create token */
    const token = jwt.sign({id : user._id, email : user.email}, process.env.JWT_SECRETS);

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? 'none' : 'lax'
    });

    res.status(201).json({
        message : "user register successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    });
};

/* login the user */
module.exports.loginUser = async function(req, res){
    let {email, password} = req.body;

    /* check if user exist */
    let user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message : "invalid email or password",
        });
    }

    /* check valid password */
    let passCheck = await bcrypt.compare(password, user.password);

    if(!passCheck){
        return res.status(400).json({
            message : "Invalid email or password",
        });
    }

    const token = jwt.sign({id : user._id, email : user.email}, process.env.JWT_SECRETS);

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction, 
        sameSite: isProduction ? 'none' : 'lax'
    });

    res.status(200).json({
        message : "user logged-In successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    });
};

/* logout user & blackList the token */
module.exports.logoutUser = async function(req, res){
    const token = req.cookies.token;

    if(token){
        await tokenModel.create({token});
    }

    res.clearCookie('token');

    res.status(200).json({
        message : "user logged-out successfully"
    });
};

/* get user details */
module.exports.getUser = async function(req, res){
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message : "user details fetched successfully",
        user : {
            id : user._id,
            username : user.username,
            email : user.email,
        }
    });
};