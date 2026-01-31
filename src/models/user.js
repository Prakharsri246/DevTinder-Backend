const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email Address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Your Password is not strong enough" + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {               // this only works when creating a new user
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Invalid Gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default description for the user!"
    },
    skills: {
        type: [String],
    }
}, { timestamps: true })


//schema methods - helper functions
userSchema.methods.getJWT = async function () {
    // creating the instance of the user model
    const user = this;
    // Creating A JWT TOKEN
    const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$123", { expiresIn: '7d' })
    return token;
}

userSchema.methods.isPasswordValid = async function (passwordByUser) {
    const user = this;
    const psswordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordByUser, psswordHash);
    return isPasswordValid;

}
module.exports = mongoose.model("User", userSchema);