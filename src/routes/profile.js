const express = require('express');
const { userAuth } = require("../middleware/auth.js")
const profileRouter = express.Router();

//Profile API
profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user);
    }
    catch (error) {
        res.status(404).send(error.message)
    }
})

module.exports = profileRouter;