const express = require('express');
const { userAuth } = require("../middleware/auth.js")
const requestRouter = express.Router();


//Send connection request
requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;

        res.send(user.firstName + ": connection request sent")
    } catch (error) {
        res.status.send(error.message);
    }

})

module.exports = requestRouter;