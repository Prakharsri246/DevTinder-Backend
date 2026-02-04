const express = require('express');
const { userAuth } = require("../middleware/auth.js")
// Hash the new password
const bcrypt = require("bcrypt");
const { validateEditProfileData } = require('../utils/validations');
const profileRouter = express.Router();

//Profile  API
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message)
    }
})

// Profile edit API
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {

    try {
        //Validate the in coming Data
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Req")
        }
        // this user comes from auth middleware
        const loggedInUser = req.user;

        // Update the fields
        Object.keys(req.body).forEach((key) => { loggedInUser[key] = req.body[key] })

        // Save the updated user to the database
        await loggedInUser.save();

        res.json({ message: `${loggedInUser.firstName} your data is updated successfully`, data: loggedInUser })

    } catch (error) {
        res.send("Error:" + error.message)
    }
})

//Forgot Password API (Change Password for logged-in users)
profileRouter.patch('/profile/changepassword', userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const loggedInUser = req.user;

        // Validate that both passwords are provided
        if (!currentPassword || !newPassword) {
            throw new Error("Current password and new password are required");
        }

        // Verify current password
        const isCurrentPasswordValid = await loggedInUser.isPasswordValid(currentPassword);
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Check if new password is same as current password
        if (currentPassword === newPassword) {
            throw new Error("New password must be different from current password");
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
})

module.exports = profileRouter;