const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

//checks if token present inside the request
const userAuth = async (req, res, next) => {
    // getting cookie
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Token is not Valid");
        }
        const decodedObj = await jwt.verify(token, "Dev@Tinder$123");
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send(error.message)
    }
}
module.exports = { userAuth };