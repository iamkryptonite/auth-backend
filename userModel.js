const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    first_name:String,
    last_name:String,
    facebook_id:Number,
    username: String
})

const User = mongoose.model('user',userSchema)
module.exports = User;