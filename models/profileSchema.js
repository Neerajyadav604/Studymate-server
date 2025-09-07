const mongoose = require("mongoose");

const profileSchema = new  mongoose.Schema({
    gender:{
        type:String,
        
    },

    dateOfBirth:{
      tyoe:String
    },
    about:{
        type:String,
        trim:true,

    },
    contact:{
        type:Number,
        trim:true
    }



});

module.exports = mongoose.model("Profile",profileSchema);