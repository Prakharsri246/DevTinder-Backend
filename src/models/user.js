const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){               // this only works when creating a new user
            if(!["male","female","others"].includes(value)){
                throw new Error("Invalid Gender");
            }
        }
    },
    photoUrl:{
       type :String,
       default:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    about:{
        type:String,
        default:"This is a default description for the user!"
    },
    skills:{
       type:[String],
    }
},{timestamps:true})

module.exports = mongoose.model("User",userSchema);