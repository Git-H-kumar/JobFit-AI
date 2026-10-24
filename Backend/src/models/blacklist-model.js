const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "token is required"] ,
    }
}, {
    timestamps : true
})


module.exports = mongoose.model("blackListed" , blackListSchema);