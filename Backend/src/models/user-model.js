const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : [true , "username already taken"],
        required : [true, "must have a username"],
    },
    email : {
        type : String,
        unique : [true , "account already exist with this email"],
        required: true,
    },
    password : {
        type : String,
        required : true,
    }
})

module.exports  = mongoose.model("users", userSchema);