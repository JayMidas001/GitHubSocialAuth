const mongoose = require(`mongoose`)

const socialSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String
    },
    profilePicture:{
        type: String
    },
    provider:{
        type: String
    }
},{timestamps: true})

const socialModel = mongoose.model(`User`, socialSchema)

module.exports = socialModel