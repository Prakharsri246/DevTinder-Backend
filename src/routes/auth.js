const express = require('express');
//getiing schema from user.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validateSignUp");
// Creating the Auth Router
const authRouter = express.Router();


authRouter.post('/signup', async (req, res) => {
    //Saving the user in the database and performing error handling 
    try {
        //Validate the data
        validateSignUpData(req);
        // destructure the data
        const { firstName, lastName, email, password, age, gender, photoUrl, skills } = req.body;
        //Encrypting the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Creating a new instance for the User Model
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashPassword,
            age,
            gender,
            photoUrl,
            skills
        })
        await user.save();
        res.send("User Registered Successfully");
    } catch (error) {
        res.status(400).send(error.message);
        console.log("ERROR:" + error.message);
    }
})

//login API
authRouter.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        // checks if email is present in db or not
        const isEmail = await User.findOne({ email: email })
        if (!isEmail) {
            console.log("why")
            throw new Error("Invalid credentials")
        }
        const isPassword = await isEmail.isPasswordValid(password);
        if (isPassword) {

            // Creating A JWT TOKEN
            const token = await isEmail.getJWT()
            //Add the token to cookie 
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send("User Logged in Successfully")
        } else {
            throw new Error("Invalid credentials")
        }


    } catch (error) {
        res.status(400).send("Error:" + error.message);
    }


})

module.exports = authRouter;